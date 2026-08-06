import Image from "next/image";

import { Reveal } from "@/components/reveal";
import {
  SECTION_BAND_A,
  SECTION_BODY,
  SECTION_EYEBROW,
  SECTION_LEAD,
  SECTION_PAD,
  SECTION_TITLE,
} from "@/lib/section";
import { cn } from "@/lib/utils";

const reasons = [
  {
    title: "Prawidłowa ergonomia",
    body: "Uczysz się grać luźno i świadomie. Widzisz, że Twoje palce nie bolą, dłoń nie drętwieje, a z gitary wydobywasz czysty, głęboki dźwięk.",
  },
  {
    title: "Bez szkolnych schematów",
    body: "Budujemy plan pod Twoje cele, tempo i ulubione utwory. Słyszysz muzykę, którą lubisz — nie ćwiczysz z przestarzałego podręcznika dla oceny.",
  },
  {
    title: "Szczera wada startu: nie od trudnych akordów",
    body: "Nie zaczynamy od F-dura ani pełnych chwytów, bo to niszczy zapał i boli. Startujesz od prostych melodii jednogłosowych — palce budują niezależność bez falstartu.",
  },
  {
    title: "Stały kontakt w tygodniu",
    body: "Nie zostajesz sam między lekcjami. Gdy ćwiczysz w domu i trafisz na trudny moment, piszesz na komunikatorze — pomagam rozwiązać problem.",
  },
  {
    title: "Sprawny instrument = lżejsza gra",
    body: "Regulacja wysokości strun i wymiana na nowe, miękkie struny pomagają grać lżej. Czujesz, że instrument współpracuje z Tobą, zamiast walczyć z twardą gitarą.",
  },
] as const;

function MethodImage({ className }: { className?: string }) {
  return (
    <figure
      className={cn(
        "relative aspect-[4/5] max-h-[28rem] w-full overflow-hidden rounded-2xl bg-sky-50 sm:max-h-none sm:aspect-[3/4]",
        className,
      )}
    >
      <Image
        src="/images/jakub-casual.png"
        alt="Jakub Grygiel, bezstresowe podejście do nauki gitary"
        fill
        sizes="(max-width: 1024px) 100vw, 40vw"
        className="object-cover object-top"
      />
      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/75 to-transparent px-4 py-4 text-sm text-white">
        Luz, praktyka i Twoje ulubione utwory od startu
      </figcaption>
    </figure>
  );
}

export function MethodSection() {
  return (
    <section id="metoda" className={SECTION_BAND_A}>
      <div className={cn("mx-auto max-w-6xl", SECTION_PAD)}>
        <div className="grid items-start gap-8 lg:grid-cols-2 lg:items-center lg:gap-16">
          <Reveal variant="right" className="space-y-5 sm:space-y-6">
            <div className="space-y-2 sm:space-y-3">
              <p className={SECTION_EYEBROW}>Emocje i efekty</p>
              <h2 className={SECTION_TITLE}>Dlaczego ta metoda działa?</h2>
              <p className={SECTION_LEAD}>
                Po około 4 lekcjach wielu uczniów gra już pierwsze melodie ze
                swojej listy ulubionych piosenek. Nie obiecuję cudów w tydzień,
                ale daję prosty przekaz, dobre narzędzia i utwory, które
                naprawdę chcesz grać.
              </p>
            </div>

            <MethodImage className="mx-auto max-w-sm lg:hidden" />

            <ul className="space-y-0 divide-y divide-sky-300 border-t border-sky-300">
              {reasons.map((reason) => (
                <li key={reason.title} className="py-3 sm:py-3.5">
                  <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
                    {reason.title}
                  </h3>
                  <p className={cn("mt-1", SECTION_BODY)}>{reason.body}</p>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal variant="right" delay={120}>
            <MethodImage className="mx-auto hidden max-w-md lg:mx-0 lg:block lg:max-w-none" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
