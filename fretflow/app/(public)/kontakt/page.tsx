import type { Metadata } from "next";
import Link from "next/link";

import { ContactForm } from "@/components/contact-form";
import { SitePhoneCard } from "@/components/site-phone-card";
import { isFreeGuideOpen } from "@/lib/free-guide";
import {
  shopInterestPrefillMessage,
  shopProducts,
} from "@/lib/shop-products";
import { contactTopics, type ContactFormValues } from "@/lib/validations/contact";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Napisz w sprawie serwisu gitary, materiałów cyfrowych albo innego pytania. Odpiszę osobiście.",
};

type KontaktPageProps = {
  searchParams: Promise<{ temat?: string; produkt?: string; tytul?: string }>;
};

function resolveTopic(value?: string): ContactFormValues["topic"] {
  if (value && contactTopics.includes(value as ContactFormValues["topic"])) {
    return value as ContactFormValues["topic"];
  }
  return "other";
}

function resolveProductTitle(slug?: string, titleParam?: string): string | null {
  if (titleParam?.trim()) return titleParam.trim();
  if (!slug) return null;
  return shopProducts.find((p) => p.slug === slug)?.title ?? null;
}

export default async function KontaktPage({ searchParams }: KontaktPageProps) {
  const params = await searchParams;
  const defaultTopic = resolveTopic(params.temat);
  const freeGuideOpen = isFreeGuideOpen();
  const productTitle = resolveProductTitle(params.produkt, params.tytul);
  const defaultMessage =
    defaultTopic === "shop_support" && productTitle
      ? shopInterestPrefillMessage(productTitle)
      : "";

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
      <div className="max-w-2xl space-y-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
          Napisz wiadomość
        </h1>
        <p className="text-base leading-[1.65] text-slate-700 sm:text-[1.0625rem] sm:leading-relaxed">
          Serwis i regulacja gitary, materiały ze sklepu, lekcje online albo inne
          pytanie — napisz, czego potrzebujesz. Odpiszę osobiście.
        </p>

        <p className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm leading-relaxed text-slate-700 sm:text-base">
          Chcesz umówić lekcję próbną w Gdańsku?{" "}
          <Link
            href="/rezerwacja"
            className="font-medium text-sky-700 underline-offset-2 hover:underline"
          >
            Idź do rezerwacji
          </Link>{" "}
          — tam wybierasz wariant ceny i miejsce.
        </p>

        <SitePhoneCard hint="Albo zadzwoń — ogarniemy temat na żywo." />

        <p className="text-base leading-[1.65] text-slate-700">
          Darmowy PDF „Gitarowy Falstart”{" "}
          {freeGuideOpen ? (
            <>
              jest na stronie{" "}
              <Link
                href="/pobierz-poradnik"
                className="font-medium text-sky-700 underline-offset-2 hover:underline"
              >
                pobierz poradnik
              </Link>
            </>
          ) : (
            <>
              pojawi się wkrótce na stronie{" "}
              <Link
                href="/pobierz-poradnik"
                className="font-medium text-sky-700 underline-offset-2 hover:underline"
              >
                pobierz poradnik
              </Link>
            </>
          )}
          . E-book „Start z gitarą bez stresu” znajdziesz w{" "}
          <Link
            href="/sklep/start-z-gitara-bez-stresu"
            className="font-medium text-sky-700 underline-offset-2 hover:underline"
          >
            sklepie
          </Link>
          .
        </p>
      </div>

      <div className="mt-8 w-full max-w-xl sm:mt-10">
        <ContactForm
          defaultTopic={defaultTopic}
          defaultMessage={defaultMessage}
          defaultProductSlug={params.produkt?.trim() ?? ""}
          defaultProductTitle={productTitle ?? ""}
        />
      </div>
    </section>
  );
}
