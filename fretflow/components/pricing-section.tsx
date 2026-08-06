import Image from "next/image";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { lessonPackages } from "@/lib/lesson-packages";
import {
  SECTION_BAND_B,
  SECTION_BODY,
  SECTION_EYEBROW,
  SECTION_LEAD,
  SECTION_PAD,
  SECTION_TITLE,
} from "@/lib/section";
import { cn } from "@/lib/utils";

export function PricingSection() {
  return (
    <section id="cennik" className={SECTION_BAND_B}>
      <div className={cn("mx-auto max-w-6xl space-y-7 sm:space-y-8", SECTION_PAD)}>
        <div className="space-y-6 sm:space-y-7">
          <div className="grid items-center gap-6 md:grid-cols-2 md:gap-8 lg:gap-10">
            <Reveal
              variant="scale"
              className="flex max-w-xl flex-col gap-4 sm:gap-5 md:max-w-none"
            >
              <div className="space-y-3">
                <p className={SECTION_EYEBROW}>Cennik i bezpieczny start</p>
                <h2 className={cn("text-balance", SECTION_TITLE)}>
                  Inwestujesz w lekcję, materiały i spokojny początek
                </h2>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-slate-900 sm:text-xl">
                  Indywidualna lekcja i jasny plan
                </h3>
                <p className={cn("text-pretty", SECTION_LEAD)}>
                  Otrzymujesz mój pełny czas i 100% skupienia. Bez nudnych
                  ćwiczeń z przestarzałych podręczników i bez zbędnej teorii na
                  starcie.
                </p>
                <p className={cn("text-pretty", SECTION_LEAD)}>
                  Na pierwszej lekcji nie rozpracujemy jeszcze całego trudnego
                  utworu z radia — najpierw zdrowe podstawy i ułożenie dłoni.
                  Zaczynamy od prostych melodii, które krok po kroku prowadzą do
                  Twoich ulubionych piosenek.
                </p>
              </div>

              <p className={cn("text-pretty", SECTION_LEAD)}>
                Przy pierwszej wymianie strun pomagam też wyczyścić gitarę i
                ogarnąć podstawy opieki nad instrumentem. Online łączymy się na
                Telegramie — lepsza barwa dźwięku, a materiały pokazuję na
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
            <div className="rounded-xl border border-sky-200 bg-sky-50/90 px-4 py-4 sm:px-5 sm:py-5">
              <div className="flex gap-3 sm:gap-3.5">
                <ShieldCheck
                  className="mt-0.5 size-5 shrink-0 text-sky-600 sm:size-6"
                  aria-hidden
                />
                <div className="min-w-0 space-y-1.5">
                  <h3 className="text-base font-semibold text-slate-900">
                    Gwarancja bezpiecznego startu
                  </h3>
                  <p className={SECTION_BODY}>
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
                <p className={cn("mt-3", SECTION_BODY)}>{plan.details}</p>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal
          variant="scale"
          delay={100}
          className="mx-auto flex max-w-lg flex-col items-center gap-4 text-center"
        >
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/rezerwacja">Umów lekcję próbną</Link>
          </Button>
          <p className={SECTION_BODY}>
            W formularzu wybierasz wariant i cenę. Pierwsza lekcja z gwarancją —
            płacisz tylko, jeśli chcesz kontynuować.
          </p>
          <p className={SECTION_BODY}>
            Online przez Telegram · miejsca ograniczone kalendarzem koncertowym
          </p>
        </Reveal>
      </div>
    </section>
  );
}
