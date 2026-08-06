import Link from "next/link";
import { Guitar, HandHeart, Music2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import {
  SECTION_BAND_A,
  SECTION_BODY,
  SECTION_EYEBROW,
  SECTION_LEAD,
  SECTION_PAD,
  SECTION_TITLE,
} from "@/lib/section";
import { cn } from "@/lib/utils";

const pillars: {
  id: string;
  number: string;
  title: string;
  points: string[];
  cta: { href: string; label: string };
  icon: LucideIcon;
}[] = [
  {
    id: "lekcje",
    number: "01",
    title: "Bezstresowa nauka i Twoje utwory",
    points: [
      "Praktyka zamiast suchej teorii – bez obietnic gruszek na wierzbie",
      "Start od prostych melodii z tabulatury",
      "Po około czterech lekcjach — Twoje utwory w uproszczonej wersji, bez zniechęcenia",
    ],
    cta: { href: "/rezerwacja", label: "Umów lekcję" },
    icon: Music2,
  },
  {
    id: "serwis",
    number: "02",
    title: "Wsparcie techniczne i serwis",
    points: [
      "Czyszczenie, regulacja wysokości strun i wymiana na nowe, miękkie struny",
      "Dla stałych uczniów podstawowy serwis i opieka nad instrumentem w cenie zajęć",
    ],
    cta: { href: "/kontakt?temat=setup_service", label: "Zapytaj o serwis" },
    icon: Guitar,
  },
  {
    id: "program",
    number: "03",
    title: "Pełna wolność i autorski program",
    points: [
      "Bez szablonów korporacyjnych szkół",
      "Pracuję na własną markę",
      "Osobista odpowiedzialność za Twój progres, komfort i radość z gry",
    ],
    cta: { href: "/#materialy", label: "Darmowy PDF i e-booki" },
    icon: HandHeart,
  },
];

export function PillarsSection() {
  return (
    <section id="oferta" className={SECTION_BAND_A}>
      <div className={cn("mx-auto max-w-6xl", SECTION_PAD)}>
        <Reveal variant="up" className="max-w-2xl space-y-3">
          <p className={SECTION_EYEBROW}>Fundament oferty</p>
          <h2 className={SECTION_TITLE}>
            Lekcje, rzemiosło i osobista odpowiedzialność
          </h2>
          <p className={SECTION_LEAD}>
            Stacjonarnie obok Galerii Forum, z dojazdem w Gdańsku albo online.
            Do tego realne wsparcie przy instrumencie, którego masowe szkoły
            zwykle nie dają.
          </p>
        </Reveal>

        <div className="mt-7 grid gap-4 sm:mt-9 sm:gap-5 lg:grid-cols-3">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <Reveal key={pillar.id} delay={index * 80} variant="up">
                <article
                  id={pillar.id}
                  className="scroll-mt-24 flex h-full flex-col gap-4 rounded-2xl border border-sky-100 bg-white px-5 py-6 shadow-[0_1px_0_rgba(15,23,42,0.04)] sm:px-6 sm:py-7"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className="flex size-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600"
                      aria-hidden
                    >
                      <Icon className="size-5" strokeWidth={1.75} />
                    </span>
                    <span className="text-5xl font-extrabold leading-none tabular-nums tracking-tight text-sky-500 sm:text-6xl">
                      {pillar.number}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold leading-snug text-slate-900 sm:text-xl">
                      {pillar.title}
                    </h3>
                    <ul className="space-y-2">
                      {pillar.points.map((point) => (
                        <li
                          key={point}
                          className={cn(
                            "relative pl-4 before:absolute before:left-0 before:top-[0.65em] before:size-1.5 before:rounded-full before:bg-sky-500",
                            SECTION_BODY,
                          )}
                        >
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-auto pt-2">
                    <Button asChild className="w-full">
                      <Link href={pillar.cta.href}>{pillar.cta.label}</Link>
                    </Button>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
