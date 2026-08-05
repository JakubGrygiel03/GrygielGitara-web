import Image from "next/image";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { lessonPackages } from "@/lib/lesson-packages";

export function PricingSection() {
  return (
    <section id="cennik" className="scroll-mt-24 bg-surface">
      <div className="mx-auto max-w-6xl space-y-5 px-4 py-12 sm:space-y-6 sm:px-6 sm:py-16 lg:py-20">
        <div className="space-y-4 sm:space-y-5">
          <div className="grid items-center gap-4 md:grid-cols-2 md:gap-6 lg:gap-8">
            <Reveal
              variant="scale"
              className="flex max-w-xl flex-col space-y-2 sm:space-y-3 md:max-w-none"
            >
              <p className="text-base font-bold uppercase tracking-wide text-sky-600 sm:text-lg">
                Cennik i bezpieczny start
              </p>
              <h2 className="text-balance text-[1.375rem] font-bold leading-snug tracking-[-0.015em] text-slate-900 sm:text-3xl lg:text-[2rem] lg:leading-snug">
                Inwestujesz w lekcję, materiały i spokojny początek
              </h2>

              <div className="space-y-1.5 sm:space-y-2">
                <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
                  Indywidualna lekcja i jasny plan
                </h3>
                <p className="text-pretty text-[0.9375rem] leading-relaxed text-muted sm:text-base">
                  Otrzymujesz mój pełny czas i 100% skupienia. Zapomnij o nudnych
                  ćwiczeniach z przestarzałych podręczników. Choć na pierwszym
                  spotkaniu nie rozpracujemy jeszcze całego, trudnego utworu z
                  radia (bo zdrowe podstawy wymagają odrobiny cierpliwości i
                  prawidłowego ułożenia dłoni), gwarantuję, że nie stracimy ani
                  minuty na zbędną teorię. Zaczynamy od prostych, przyjemnych
                  melodii, które krok po kroku przygotują Cię do grania Twoich
                  ulubionych piosenek już po kilku pierwszych lekcjach.
                </p>
              </div>

              <p className="text-pretty text-[0.9375rem] leading-relaxed text-muted sm:text-base">
                Przy pierwszej wymianie strun pomagam też wyczyścić gitarę i
                ogarnąć podstawy opieki nad instrumentem, żeby grało się lżej od
                startu. Online łączymy się na Telegramie — nie psuje barwy
                dźwięku jak typowe wideokonferencje, a materiały pokazuję na
                tablecie.
              </p>
            </Reveal>

            <Reveal variant="scale" delay={100}>
              <div className="relative mx-auto aspect-[4/3] w-full max-w-md overflow-hidden rounded-2xl bg-sky-100 md:mx-0 md:max-w-none">
                <Image
                  src="/images/concert-classical.png"
                  alt="Jakub Grygiel na scenie z gitarą klasyczną"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-[center_22%]"
                />
              </div>
            </Reveal>
          </div>

          <Reveal variant="scale" delay={80}>
            <div className="rounded-xl border border-sky-200 bg-sky-50/90 px-3 py-3 sm:px-4 sm:py-4">
              <div className="flex gap-2.5 sm:gap-3">
                <ShieldCheck
                  className="mt-0.5 size-5 shrink-0 text-sky-600 sm:size-6"
                  aria-hidden
                />
                <div className="min-w-0 space-y-1">
                  <h3 className="text-sm font-semibold text-slate-900 sm:text-base">
                    Gwarancja bezpiecznego startu
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-700">
                    Po pierwszej lekcji decydujesz Ty. Jeśli uznasz, że gitara
                    albo nasza współpraca to nie to, nie płacisz za te zajęcia.
                    Całe ryzyko biorę na siebie.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <ul className="grid gap-3 sm:gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {lessonPackages.map((plan, index) => (
            <li key={plan.id}>
              <Reveal
                delay={index * 70}
                variant="scale"
                className={
                  plan.highlight
                    ? "h-full rounded-2xl border-2 border-sky-400 bg-white px-5 py-6 transition-shadow duration-300 hover:shadow-md sm:px-6 sm:py-7"
                    : "h-full rounded-2xl border border-sky-100 bg-white/80 px-5 py-6 transition-shadow duration-300 hover:shadow-md sm:px-6 sm:py-7"
                }
              >
                <div className="flex flex-wrap items-center gap-2">
                  {plan.highlight ? (
                    <span className="rounded-full bg-sky-500 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                      Pakiet promocyjny
                    </span>
                  ) : null}
                  <span
                    className={
                      plan.locationType === "online"
                        ? "rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800"
                        : plan.locationType === "student_home"
                          ? "rounded-full bg-sky-100 px-2.5 py-1 text-xs font-semibold text-sky-800"
                          : "rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700"
                    }
                  >
                    {plan.location}
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-semibold text-slate-900 sm:text-xl">
                  {plan.name}
                </h3>
                <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  {plan.priceLabel}
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {plan.perLesson}
                </p>
                <p className="mt-2 text-sm font-medium text-sky-700">
                  {plan.note}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {plan.details}
                </p>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal
          variant="scale"
          delay={100}
          className="mx-auto flex max-w-xl flex-col items-center space-y-3 text-center"
        >
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/rezerwacja">Umów lekcję próbną</Link>
          </Button>
          <p className="text-sm leading-relaxed text-muted">
            W formularzu wybierasz wariant i cenę jak wyżej. Pierwsza lekcja z
            gwarancją — płacisz tylko, jeśli uznasz, że warto kontynuować. Online
            przez Telegram.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
