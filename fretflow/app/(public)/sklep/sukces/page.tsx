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
    "Dzięki za zakup. Produkt powinien pojawić się w sekcji Zakupy w Twoim koncie.";

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
            "Gotowe — produkt jest w Twoim koncie. Wysłaliśmy też e-mail z PDF (gdy Resend jest skonfigurowany).";
        }
      }
    } catch {
      message =
        "Płatność powinna przejść. Jeśli nie widzisz produktu w Zakupach, odśwież stronę za minutę.";
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
          <Link href="/moje-kursy">Przejdź do Zakupów</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/sklep">Wróć do sklepu</Link>
        </Button>
      </div>
    </section>
  );
}
