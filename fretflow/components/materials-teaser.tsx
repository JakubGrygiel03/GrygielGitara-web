import Link from "next/link";

import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { isFreeGuideOpen } from "@/lib/free-guide";
import {
  FREE_GUIDE_COMING_SOON_CTA,
  FREE_GUIDE_SHORT_TITLE,
} from "@/lib/free-guide-copy";
import {
  SECTION_BAND_A,
  SECTION_BODY,
  SECTION_EYEBROW,
  SECTION_PAD,
  SECTION_TITLE,
} from "@/lib/section";
import { cn } from "@/lib/utils";

/**
 * Homepage materials: free PDF + paid e-book + shop link.
 */
export function MaterialsTeaser() {
  const freeGuideOpen = isFreeGuideOpen();

  return (
    <section id="materialy" className={SECTION_BAND_A}>
      <div className={cn("mx-auto max-w-6xl", SECTION_PAD)}>
        <Reveal variant="up" className="max-w-2xl space-y-2 sm:space-y-3">
          <p className={cn(SECTION_EYEBROW, "text-sky-700")}>Materiały</p>
          <h2 className={SECTION_TITLE}>Materiały do samodzielnej pracy</h2>
          <p className="text-base font-medium leading-[1.65] text-slate-800 sm:text-[1.0625rem] sm:leading-relaxed">
            Niezależnie od tego, czy uczysz się pod moim okiem, czy wolisz zacząć
            w domu — przygotowałem konkretne pomoce. Wybierz to, czego teraz
            potrzebujesz.
          </p>
        </Reveal>

        <div className="mt-6 grid gap-5 md:mt-8 md:grid-cols-2 md:gap-6">
          <Reveal delay={40} variant="up">
            <article className="flex h-full flex-col gap-4 rounded-2xl border border-emerald-300 bg-emerald-100/80 px-5 py-6 sm:px-6">
              <div className="space-y-2">
                <p className="text-sm font-extrabold uppercase tracking-wide text-emerald-800 sm:text-base">
                  Opcja 1 · 100% za darmo
                </p>
                <h3 className="text-lg font-semibold text-slate-900 sm:text-xl">
                  {FREE_GUIDE_SHORT_TITLE}
                </h3>
                <p className={SECTION_BODY}>
                  Prezent na start. Tłumaczę, dlaczego łapanie chwytów (jak
                  F-dur) na początku boli i zniechęca — oraz jak tego uniknąć.
                  Bez haczyków.
                </p>
              </div>
              <div className="mt-auto pt-1">
                {freeGuideOpen ? (
                  <Button
                    asChild
                    className="w-full border-2 border-emerald-700 bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-md hover:shadow-emerald-600/25 sm:w-auto"
                  >
                    <Link href="/pobierz-poradnik">Pobierz darmowy PDF</Link>
                  </Button>
                ) : (
                  <Button
                    asChild
                    variant="secondary"
                    className="w-full border-2 border-emerald-600 bg-white text-emerald-900 hover:bg-emerald-50 sm:w-auto"
                  >
                    <Link href="/pobierz-poradnik">
                      {FREE_GUIDE_COMING_SOON_CTA}
                    </Link>
                  </Button>
                )}
              </div>
            </article>
          </Reveal>

          <Reveal delay={120} variant="up">
            <article className="flex h-full flex-col gap-4 rounded-2xl border border-sky-300 bg-sky-100/80 px-5 py-6 sm:px-6">
              <div className="space-y-2">
                <p className="text-sm font-extrabold uppercase tracking-wide text-sky-800 sm:text-base">
                  Opcja 2 · E-book · 59 zł
                </p>
                <h3 className="text-lg font-semibold text-slate-900 sm:text-xl">
                  Start z gitarą bez stresu
                </h3>
                <p className={SECTION_BODY}>
                  Kompletny, ok. 40-stronicowy plan na pierwsze tygodnie.
                  Wsparcie wideo do ćwiczeń i trening 15 minut dziennie — dla
                  osób, które chcą uczyć się w swoim tempie.
                </p>
              </div>
              <div className="mt-auto pt-1">
                <Button asChild className="w-full sm:w-auto">
                  <Link href="/sklep/start-z-gitara-bez-stresu">
                    Zobacz e-booka · wkrótce
                  </Link>
                </Button>
              </div>
            </article>
          </Reveal>
        </div>

        <Reveal delay={160} variant="up" className="mt-6 max-w-2xl space-y-3 sm:mt-8">
          <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
            Szukasz czegoś innego?
          </h3>
          <p className="text-base font-medium leading-[1.65] text-slate-800">
            Tabulatury, nuty albo inne autorskie poradniki — w sklepie jest pełna
            lista materiałów, które ułatwiają bezstresową grę.
          </p>
          <Button
            asChild
            variant="secondary"
            size="lg"
            className="w-full border-2 border-sky-600 bg-white font-semibold text-sky-900 hover:bg-sky-50 sm:w-auto"
          >
            <Link href="/sklep">Zajrzyj do sklepu</Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
