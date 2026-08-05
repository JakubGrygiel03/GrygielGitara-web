"use server";

import { redirect } from "next/navigation";

import { getSiteUrl } from "@/lib/env";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { ProductRow } from "@/lib/shop";

export type CheckoutState = {
  ok: boolean;
  message?: string;
};

export async function startProductCheckout(
  productId: string,
): Promise<CheckoutState> {
  if (!isStripeConfigured()) {
    return {
      ok: false,
      message: "Płatności online nie są jeszcze skonfigurowane.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      ok: false,
      message: "Zaloguj się, żeby kupić produkt.",
    };
  }

  const admin = createAdminClient();
  const { data: product, error } = await admin
    .from("products")
    .select("*")
    .eq("id", productId)
    .eq("published", true)
    .maybeSingle();

  if (error || !product) {
    return { ok: false, message: "Nie znaleziono produktu." };
  }

  const typed = product as ProductRow;
  if (typed.coming_soon) {
    return { ok: false, message: "Ten produkt jest jeszcze niedostępny." };
  }

  const { data: existing } = await admin
    .from("user_entitlements")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", typed.id)
    .maybeSingle();

  if (existing) {
    return { ok: false, message: "Masz już ten produkt w koncie." };
  }

  const site = getSiteUrl();
  const stripe = getStripe();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: user.email ?? undefined,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: typed.currency || "pln",
          unit_amount: typed.price_grosze,
          product_data: {
            name: typed.title,
            description: typed.short_description || undefined,
          },
        },
      },
    ],
    metadata: {
      user_id: user.id,
      product_id: typed.id,
    },
    success_url: `${site}/sklep/sukces?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${site}/sklep?anulowano=1`,
  });

  if (!session.url) {
    return { ok: false, message: "Stripe nie zwrócił linku do płatności." };
  }

  redirect(session.url);
}
