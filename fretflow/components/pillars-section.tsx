import Link from "next/link";

import { Button } from "@/components/ui/button";

const pillars = [
  {
    id: "lekcje",
    eyebrow: "Filar 1",
    title: "Bezstresowa nauka i Twoje utwory",
    body: "Praktyka zamiast suchej teorii – bez obietnic gruszek na wierzbie. Zaczynamy od prostych melodii z tabulatury, a po około czterech lekcjach bierzemy Twoje utwory w uproszczonej wersji, żeby grać to, co lubisz, bez zniechęcenia.",
    cta: { href: "/rezerwacja", label: "Umów lekcję" },
  },
  {
    id: "serwis",
    eyebrow: "Filar 2",
    title: "Wsparcie techniczne i serwis",
    body: "Absolwent Technikum Budowy i Strojenia Fortepianów. Pomagam w czyszczeniu, setupie i wymianie strun, a dla aktywnych uczniów podstawowy serwis jest w cenie zajęć.",
    cta: { href: "/kontakt?temat=setup_service", label: "Zapytaj o serwis" },
  },
  {
    id: "materialy",
    eyebrow: "Filar 3",
    title: "Pełna wolność i autorski program",
    body: "Bez szablonów korporacyjnych szkół. Pracuję na własną markę i biorę osobistą odpowiedzialność za Twój progres, komfort i radość z gry.",
    cta: { href: "/kontakt", label: "Poznaj podejście" },
  },
] as const;

export function PillarsSection() {
  return (
    <section id="oferta" className="scroll-mt-24 bg-surface">
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-12 sm:space-y-12 sm:px-6 sm:py-16 lg:py-20">
        <div className="max-w-2xl space-y-3 sm:space-y-4">
          <p className="text-sm font-semibold uppercase tracking-wider text-sky-600">
            Fundament oferty
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            Lekcje, rzemiosło i osobista odpowiedzialność
          </h2>
          <p className="text-sm leading-relaxed text-muted sm:text-base lg:text-lg">
            Stacjonarnie obok Galerii Forum, z dojazdem w Gdańsku albo online.
            Do tego realne wsparcie przy instrumencie, którego masowe szkoły
            zwykle nie dają.
          </p>
        </div>

        <div className="grid gap-8 sm:gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {pillars.map((pillar) => (
            <article
              key={pillar.id}
              id={pillar.id}
              className="scroll-mt-24 space-y-3 border-t border-sky-100 pt-6 sm:space-y-4 md:border-t-0 md:pt-0"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-sky-600">
                {pillar.eyebrow}
              </p>
              <h3 className="text-lg font-semibold text-slate-900 sm:text-xl">
                {pillar.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted sm:text-base">
                {pillar.body}
              </p>
              <Button asChild variant="secondary" className="w-full sm:w-auto">
                <Link href={pillar.cta.href}>{pillar.cta.label}</Link>
              </Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
