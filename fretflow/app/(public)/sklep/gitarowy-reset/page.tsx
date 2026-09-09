import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { LeadMagnetForm } from "@/components/lead-magnet-form";
import { ShopEbookCover } from "@/components/shop-ebook-cover";
import { ShopSyncedSidebar } from "@/components/shop-synced-sidebar";
import { Button } from "@/components/ui/button";
import {
  FREE_GUIDE_HREF,
  FREE_GUIDE_SLUG,
  isFreeGuideOpen,
} from "@/lib/free-guide";
import {
  FREE_GUIDE_BLURB,
  FREE_GUIDE_CHAPTERS,
  FREE_GUIDE_CLOSING,
  FREE_GUIDE_COMING_SOON_CTA,
  FREE_GUIDE_INTRO,
  FREE_GUIDE_SHORT_TITLE,
  FREE_GUIDE_TITLE,
  FREE_GUIDE_VS_PAID,
} from "@/lib/free-guide-copy";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: `${FREE_GUIDE_SHORT_TITLE} — darmowy PDF do pobrania`,
  description: `Pobierz darmowy PDF „${FREE_GUIDE_SHORT_TITLE}”. ${FREE_GUIDE_BLURB}`,
  path: FREE_GUIDE_HREF,
});

export default function GitarowyResetPage() {
  const open = isFreeGuideOpen();

  return (
    <div className="bg-surface">
      <article className="mx-auto w-full max-w-6xl px-4 pb-10 pt-4 sm:px-6 sm:pb-14 sm:pt-5">
        <Link
          href="/sklep"
          className="inline-flex items-center gap-2 text-sm font-medium text-sky-700 transition-colors hover:text-sky-900"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Wróć do sklepu
        </Link>

        <div className="mt-3 grid gap-10 sm:mt-4 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start lg:gap-14">
          <ShopSyncedSidebar>
            <ShopEbookCover
              slug={FREE_GUIDE_SLUG}
              title={FREE_GUIDE_SHORT_TITLE}
              badge="PDF gratis"
              size="detail"
            />

            <div className="hidden rounded-2xl border border-orange-200 bg-white p-5 lg:block">
              <p className="text-base font-bold tabular-nums text-orange-900">
                0,00 zł
              </p>
              <p className="mt-1 text-sm font-semibold text-orange-800">
                Dostępny do pobrania
              </p>
              <div className="mt-4">
                {open ? <LeadMagnetForm /> : <ComingSoonBlock />}
              </div>
            </div>
          </ShopSyncedSidebar>

          <div className="space-y-8">
            <header className="space-y-3">
              <p className="text-sm font-bold uppercase tracking-wide text-orange-700">
                Oferta darmowa
              </p>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                {FREE_GUIDE_TITLE}
              </h1>
              <p className="max-w-2xl text-[0.975rem] leading-relaxed text-muted sm:text-base">
                {FREE_GUIDE_BLURB}
              </p>
              <div className="space-y-1 lg:hidden">
                <p className="text-base font-bold tabular-nums text-orange-900">
                  0,00 zł
                </p>
                <p className="text-sm font-semibold text-orange-800">
                  Dostępny do pobrania
                </p>
              </div>
              <div className="rounded-2xl border border-orange-200 bg-white p-5 lg:hidden">
                {open ? <LeadMagnetForm /> : <ComingSoonBlock />}
              </div>
            </header>

            <section className="space-y-4">
              {FREE_GUIDE_INTRO.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 48)}
                  className="text-base leading-[1.65] text-slate-700"
                >
                  {paragraph}
                </p>
              ))}
            </section>

            <section className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                  Co dokładnie znajdziesz w środku?
                </h2>
                <p className="text-sm text-slate-600 sm:text-base">
                  Spis treści bez owijania w bawełnę:
                </p>
              </div>

              <div className="space-y-8">
                {FREE_GUIDE_CHAPTERS.map((chapter) => (
                  <div key={chapter.title} className="space-y-3">
                    <h3 className="text-base font-bold text-slate-900 sm:text-lg">
                      {chapter.title}
                    </h3>
                    <ul className="space-y-3">
                      {chapter.topics.map((topic) => (
                        <li key={topic.title} className="space-y-1">
                          <p className="text-sm font-semibold text-slate-900 sm:text-base">
                            {topic.title}
                          </p>
                          <p className="text-sm leading-relaxed text-slate-700 sm:text-base sm:leading-[1.65]">
                            {topic.body}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                Zacznij grać mądrze i bez spiny
              </h2>
              {FREE_GUIDE_CLOSING.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 48)}
                  className="text-base leading-[1.65] text-slate-700"
                >
                  {paragraph}
                </p>
              ))}
            </section>

            <p className="text-base leading-[1.65] text-slate-700">
              {FREE_GUIDE_VS_PAID}{" "}
              <Link
                href="/sklep/start-z-gitara-bez-stresu"
                className="font-medium text-sky-700 underline-offset-2 hover:underline"
              >
                Start z gitarą bez stresu
              </Link>
              .
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}

function ComingSoonBlock() {
  return (
    <div className="space-y-4">
      <p className="text-lg font-semibold text-slate-900">
        {FREE_GUIDE_COMING_SOON_CTA}
      </p>
      <p className="text-base leading-[1.65] text-slate-700">
        Formularz pobierania jest chwilowo wyłączony. Wróć tu za chwilę albo
        umów lekcję próbną.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild>
          <Link href="/rezerwacja">Umów lekcję próbną</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/sklep">Zobacz e-booki</Link>
        </Button>
      </div>
    </div>
  );
}
