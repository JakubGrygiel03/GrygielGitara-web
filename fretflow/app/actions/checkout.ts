"use server";

import { getRequestSiteUrl } from "@/lib/env";
import type { ProductRow } from "@/lib/shop";
import {
  digitalConsentCheckboxLabel,
  regulaminCheckboxLabel,
} from "@/lib/shop-digital-terms";
import { isShopSalesOpen } from "@/lib/shop-sales";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type CheckoutState = {
  ok: boolean;
  message?: string;
  /** Stripe Checkout URL — client navigates (avoid server redirect() black screen). */
  url?: string;
};

export async function startProductCheckout(
  productId: string,
  digitalConsent = false,
  regulaminAccepted = false,
): Promise<CheckoutState> {
  if (!digitalConsent || !regulaminAccepted) {
    return {
      ok: false,
      message:
        "Zaznacz obie zgody, żeby przejść do płatności: natychmiastowe dostarczenie oraz Regulamin sklepu.",
    };
  }

  if (!isShopSalesOpen()) {
    return {
      ok: false,
      message: "Sklep jest chwilowo zamknięty — sprzedaż wróci już wkrótce.",
    };
  }

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

    const consentText = [
      digitalConsentCheckboxLabel,
      regulaminCheckboxLabel,
    ].join(" | ");

    try {
      const admin = createAdminClient();
      const { error: consentError } = await admin
        .from("shop_digital_consents")
        .insert({
          user_id: user.id,
          product_id: typed.id,
          email: user.email ?? null,
          immediate_delivery_consent: true,
          regulamin_accepted: true,
          consent_text: consentText,
          source: "checkout_start",
        });
      if (consentError) {
        console.error(
          "shop_digital_consents insert:",
          consentError.message,
          "(run 20260326_shop_digital_consents.sql if table missing)",
        );
      }
    } catch (consentLogError) {
      console.error("shop_digital_consents log failed:", consentLogError);
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
        digital_consent: "1",
        regulamin_accepted: "1",
        digital_consent_note:
          "immediate_delivery_waiver_of_withdrawal_accepted",
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
