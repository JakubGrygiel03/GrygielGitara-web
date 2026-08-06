import Image from "next/image";

import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";

const reasons = [
  {
    title: "Ergonomia dłoni zamiast „pułapki akordów”",
    body: "Na start uczymy się grać luźno i świadomie — bez wpychania w twarde, frustrujące chwyty za wcześnie. Mniej bólu palców, więcej czystego dźwięku.",
  },
  {
    title: "Ulubione utwory we właściwym momencie",
    body: "Po około 4 lekcjach wielu uczniów gra już pierwsze melodie ze swojej listy — w uproszczonej, grywalnej wersji. Frajda pojawia się szybko, bez obietnic cudów w tydzień.",
  },
  {
    title: "Telegram + tablet na lekcjach online",
    body: "Online łączymy się na Telegramie — nie zabiera rejestru dźwięku jak typowe wideokonferencje. Materiały i przykłady pokazuję na tablecie, żebyś widział dokładnie to, co ja.",
  },
  {
    title: "Sprawny instrument przyspiesza progres",
    body: "Setup, struny i podstawowa regulacja sprawiają, że nie walczysz z twardą gitarą. Jako absolwent Technikum Budowy i Strojenia Fortepianów dbam o to, by instrument pomagał — nie przeszkadzał.",
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
        alt="Jakub Grygiel — praktyczna metoda nauki gitary"
        fill
        sizes="(max-width: 1024px) 100vw, 40vw"
        className="object-cover object-top"
      />
      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/75 to-transparent px-4 py-4 text-sm text-white">
        Jak to działa na lekcji — krok po kroku
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
                Metoda
              </p>
              <h2 className="text-[1.375rem] font-bold leading-snug tracking-[-0.015em] text-slate-900 sm:text-3xl lg:text-4xl">
                Dlaczego ta metoda działa?
              </h2>
              <p className="text-[0.9375rem] leading-relaxed text-muted sm:text-base lg:text-lg">
                Komfort dłoni, repertuar we właściwym momencie, jasne narzędzia
                online i sprawny instrument — to cztery rzeczy, które realnie
                przyspieszają start.
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
