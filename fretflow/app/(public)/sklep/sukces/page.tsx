import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { fulfillShopPurchase } from "@/lib/shop-fulfillment";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Zakup zakończony",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

/**
 * Success landing: also fulfills entitlement if webhook is delayed (idempotent).
 */
export default async function SklepSukcesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const sessionId = params.session_id?.trim();

  let message =
    "Dzięki za zakup. E-book jest w Twoim koncie — możesz go od razu pobrać.";

  if (sessionId && isStripeConfigured()) {
    try {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const userId = session.metadata?.user_id;
      const productId = session.metadata?.product_id;

      if (
        session.payment_status === "paid" &&
        user &&
        userId === user.id &&
        productId
      ) {
        const result = await fulfillShopPurchase({
          userId,
          productId,
          checkoutSessionId: session.id,
          customerEmail:
            session.customer_details?.email ?? session.customer_email,
          amountTotalGrosze: session.amount_total,
        });
        if (!result.ok) {
          message =
            "Płatność przyjęta, ale trwa przypisywanie dostępu. Odśwież konto za chwilę albo napisz przez kontakt.";
        } else {
          message =
            "Gotowe — e-book jest przypisany do Twojego konta. Sprawdź też skrzynkę mailową (PDF w załączniku).";
        }
      }
    } catch {
      message =
        "Płatność powinna przejść. Jeśli nie widzisz produktu w koncie, odśwież stronę za minutę.";
    }
  }

  return (
    <section className="mx-auto w-full max-w-lg px-4 py-16 text-center sm:px-6">
      <p className="text-base font-bold uppercase tracking-wide text-sky-600">
        Sklep
      </p>
      <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
        Zakup zakończony
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
        {message}
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button asChild>
          <Link href="/moje-kursy#zakupy">Zobacz kupiony produkt</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/moje-kursy">Moje konto</Link>
        </Button>
      </div>
      <p className="mt-4">
        <Link
          href="/sklep"
          className="text-sm font-medium text-sky-700 underline-offset-2 hover:underline"
        >
          Wróć do sklepu
        </Link>
      </p>
    </section>
  );
}
