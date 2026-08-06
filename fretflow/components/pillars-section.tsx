import Link from "next/link";

import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";

const pillars = [
  {
    id: "lekcje",
    eyebrow: "Filar 1",
    title: "Lekcje gitary",
    body: "Indywidualne zajęcia w Gdańsku (studio przy Galerii Forum, dojazd) albo online. Bez stresu, z utworami, które naprawdę chcesz grać.",
    cta: { href: "/rezerwacja", label: "Umów lekcję" },
  },
  {
    id: "serwis",
    eyebrow: "Filar 2",
    title: "Serwis instrumentu",
    body: "Setup, struny i podstawowa opieka nad gitarą — żeby grało się lżej. Dla aktywnych uczniów podstawowy serwis jest w cenie zajęć.",
    cta: { href: "/kontakt?temat=setup_service", label: "Zapytaj o serwis" },
  },
  {
    id: "materialy",
    eyebrow: "Filar 3",
    title: "Autorskie podejście",
    body: "Jedna osoba, jeden program dopasowany do Ciebie — bez korporacyjnych szablonów i masówki. Materiały i wsparcie między lekcjami w pakiecie.",
    cta: { href: "/#o-mnie", label: "Poznaj filozofię" },
  },
] as const;

export function PillarsSection() {
  return (
    <section id="oferta" className="scroll-mt-24 bg-surface">
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-12 sm:space-y-12 sm:px-6 sm:py-16 lg:py-20">
        <Reveal variant="up" className="max-w-2xl space-y-3 sm:space-y-4">
          <p className="text-lg font-bold uppercase tracking-wide text-sky-600 sm:text-xl">
            Fundament oferty
          </p>
          <h2 className="text-[1.375rem] font-bold leading-snug tracking-[-0.015em] text-slate-900 sm:text-3xl lg:text-4xl">
            Co dostajesz w GrygielGitara
          </h2>
          <p className="text-[0.9375rem] leading-relaxed text-muted sm:text-base lg:text-lg">
            Lekcje, serwis instrumentu i autorskie podejście — w skrócie, zanim
            przejdziesz do metody i oferty.
          </p>
        </Reveal>

        <div className="grid gap-8 sm:gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {pillars.map((pillar, index) => (
            <Reveal key={pillar.id} delay={index * 90} variant="up">
              <article
                id={pillar.id}
                className="scroll-mt-24 space-y-3 border-t border-sky-100 pt-6 sm:space-y-4 md:border-t-0 md:pt-0"
              >
                <p className="text-lg font-bold uppercase tracking-wide text-sky-600 sm:text-xl">
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
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
