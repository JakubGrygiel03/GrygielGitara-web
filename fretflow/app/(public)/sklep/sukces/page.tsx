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
 * Success landing: fulfills entitlement from Stripe session even if the
 * browser session cookie was lost after Checkout (idempotent).
 */
export default async function SklepSukcesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const sessionId = params.session_id?.trim();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let message =
    "Dzięki za zakup. E-book jest przypisywany do konta, z którego rozpocząłeś płatność.";
  let fulfilledOk = false;

  if (sessionId && isStripeConfigured()) {
    try {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      const userId = session.metadata?.user_id;
      const productId = session.metadata?.product_id;

      if (session.payment_status === "paid" && userId && productId) {
        const result = await fulfillShopPurchase({
          userId,
          productId,
          checkoutSessionId: session.id,
          customerEmail:
            session.customer_details?.email ?? session.customer_email,
          amountTotalGrosze: session.amount_total,
        });
        fulfilledOk = result.ok;
        if (!result.ok) {
          message =
            "Płatność przyjęta, ale trwa przypisywanie dostępu. Zaloguj się za chwilę albo napisz przez kontakt.";
        } else {
          message =
            "Gotowe — e-book jest na koncie używanym przy zakupie. Zaloguj się tym samym e-mailem, żeby pobrać PDF.";
        }
      } else if (session.payment_status !== "paid") {
        message = "Płatność nie jest jeszcze potwierdzona. Odśwież za chwilę.";
      }
    } catch {
      message =
        "Płatność powinna przejść. Zaloguj się na konto użyte przy zakupie i sprawdź sekcję Zakupy.";
    }
  }

  const loginHref = `/moje-kursy/login?next=${encodeURIComponent("/moje-kursy#zakupy")}`;

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
      {!user ? (
        <p className="mt-3 text-sm leading-relaxed text-slate-700">
          Nie jesteś zalogowany w tej przeglądarce — zaloguj się na konto, z
          którego kupowałeś.
        </p>
      ) : null}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        {user ? (
          <Button asChild>
            <Link href="/moje-kursy#zakupy">Zobacz kupiony produkt</Link>
          </Button>
        ) : (
          <Button asChild>
            <Link href={loginHref}>Zaloguj się i pobierz</Link>
          </Button>
        )}
        <Button asChild variant="secondary">
          <Link href={user ? "/moje-kursy" : loginHref}>Moje konto</Link>
        </Button>
      </div>
      {fulfilledOk &&
      (process.env.RESEND_FROM_EMAIL ?? "").includes("resend.dev") ? (
        <p className="mt-6 text-xs leading-relaxed text-muted">
          Mail z PDF: nadal używany jest{" "}
          <code className="font-mono">onboarding@resend.dev</code> — działa
          tylko na zweryfikowany e-mail w Resend. Do klientów ustaw własną
          domenę nadawcy (np. kontakt@grygielgitara.pl).
        </p>
      ) : null}
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
