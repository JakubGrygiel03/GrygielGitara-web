import Image from "next/image";

import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";

const reasons = [
  {
    title: "Prawidłowa ergonomia",
    body: "Uczysz się grać luźno i świadomie. Mniej bólu palców, mniej napięć, więcej czystego dźwięku już na początku drogi.",
  },
  {
    title: "Indywidualny program",
    body: "Bez nudnych schematów szkolnych. Budujemy plan pod Twoje cele, tempo i ulubione utwory, żeby frajda pojawiała się szybko.",
  },
  {
    title: "Stały kontakt w tygodniu",
    body: "Między lekcjami nie zostajesz sam. Masz wsparcie przy technice i ćwiczeniach, zamiast czekać tydzień z nierozwiązanym problemem.",
  },
  {
    title: "Sprawny instrument oznacza szybszy progres",
    body: "Setup, struny i podstawowa regulacja pomagają grać lżej. Nie walczysz z twardą gitarą, tylko rozwijasz umiejętność.",
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
    <section id="metoda" className="scroll-mt-24">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        <div className="grid items-start gap-8 lg:grid-cols-2 lg:items-center lg:gap-16">
          <Reveal variant="right" className="space-y-5 sm:space-y-6">
            <div className="space-y-2 sm:space-y-3">
              <p className="text-base font-bold uppercase tracking-wide text-sky-600 sm:text-lg">
                Emocje i efekty
              </p>
              <h2 className="text-[1.375rem] font-bold leading-snug tracking-[-0.015em] text-slate-900 sm:text-3xl lg:text-4xl">
                Dlaczego ta metoda działa?
              </h2>
              <p className="text-[0.9375rem] leading-relaxed text-muted sm:text-base lg:text-lg">
                Po około 4 lekcjach wielu uczniów gra już pierwsze melodie ze
                swojej listy ulubionych piosenek. Nie obiecuję cudów w tydzień,
                ale daję prosty przekaz, dobre narzędzia i utwory, które
                naprawdę chcesz grać.
              </p>
            </div>

            <MethodImage className="mx-auto max-w-sm lg:hidden" />

            <ul className="space-y-0 divide-y divide-sky-100 border-t border-sky-100">
              {reasons.map((reason) => (
                <li key={reason.title} className="py-3 sm:py-3.5">
                  <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
                    {reason.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted sm:text-base">
                    {reason.body}
                  </p>
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
