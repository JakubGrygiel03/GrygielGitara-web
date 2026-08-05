"use server";

import { getRequestSiteUrl } from "@/lib/env";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import type { ProductRow } from "@/lib/shop";

export type CheckoutState = {
  ok: boolean;
  message?: string;
  /** Stripe Checkout URL — client navigates (avoid server redirect() black screen). */
  url?: string;
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

  if (!productId || productId.startsWith("fallback-")) {
    return {
      ok: false,
      message:
        "Katalog demo — uruchom SQL sklepu w Supabase (20260326_shop_products.sql), odśwież stronę i spróbuj ponownie.",
    };
  }

  try {
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

    // Published products are readable via RLS (anon/authenticated) — no service role needed.
    const { data: product, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .eq("published", true)
      .maybeSingle();

    if (error) {
      console.error("startProductCheckout product error:", error.message);
      return {
        ok: false,
        message: `Nie udało się wczytać produktu (${error.message}).`,
      };
    }

    if (!product) {
      return {
        ok: false,
        message:
          "Nie znaleziono produktu. Odśwież sklep albo uruchom migrację SQL produktów w Supabase.",
      };
    }

    const typed = product as ProductRow;
    if (typed.coming_soon) {
      return { ok: false, message: "Ten produkt jest jeszcze niedostępny." };
    }

    const { data: existing } = await supabase
      .from("user_entitlements")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", typed.id)
      .maybeSingle();

    if (existing) {
      return { ok: false, message: "Masz już ten produkt w koncie." };
    }

    const site = await getRequestSiteUrl();
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

    return { ok: true, url: session.url };
  } catch (error) {
    console.error("startProductCheckout error:", error);
    const message =
      error instanceof Error ? error.message : "Nie udało się rozpocząć płatności.";
    return { ok: false, message };
  }
}
