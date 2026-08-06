import Image from "next/image";

import { Reveal } from "@/components/reveal";

const pillars = [
  {
    title: "Pedagog z powołania (ponad 7 lat doświadczenia)",
    body: "Prowadziłem lekcje w szkołach prywatnych, ośrodkach kultury oraz z setkami uczniów indywidualnych. Wypracowałem dzięki temu ogromną cierpliwość i umiejętność prostego tłumaczenia ułożeń dłoni oraz technik.",
  },
  {
    title: "Certyfikowany rzemieślnik i technik instrumentów",
    body: "Ukończyłem Szkołę Muzyczną II st. w Kaliszu oraz Technikum Budowy i Strojenia Fortepianów. Dbam o to, aby Twoja gitara była idealnie wyregulowana – miękka w grze i wygodna, co eliminuje ból palców na początku.",
  },
  {
    title: "Aktywny muzyk sceniczny",
    body: "Jestem czynnym artystą współtworzącym zespół The Medievals. Przekazuję Ci praktyczny warsztat i sposoby na opanowanie tremy, zamiast czystej teorii z podręczników.",
  },
] as const;

export function AboutSection() {
  return (
    <section id="o-mnie" className="scroll-mt-24">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        <div className="grid items-start gap-8 md:grid-cols-2 md:gap-10 lg:gap-16">
          <Reveal variant="blur" className="space-y-4 sm:space-y-5">
            <p className="text-base font-bold uppercase tracking-wide text-sky-600 sm:text-lg">
              O mnie
            </p>
            <h2 className="text-[1.375rem] font-bold leading-snug tracking-[-0.015em] text-slate-900 sm:text-3xl lg:text-4xl">
              Autorska marka i osobiste zaangażowanie
            </h2>
            <div className="space-y-4 text-[0.9375rem] leading-relaxed text-muted sm:text-base lg:text-lg">
              <p>
                Wierzę, że muzyka powinna dawać wolność, wyraz emocjom i czystą
                radość z gry – a nie kojarzyć się ze szkolnym rygorem, stresem
                czy nudną teorią.
              </p>
              <p className="text-slate-800">
                Dlatego świadomie odrzuciłem sztywne szablony masowych szkół
                muzycznych i rozwijam w pełni niezależną markę GrygielGitara pod
                własnym nazwiskiem. Nie realizuję narzuconych od góry procedur
                ani norm godzinowych. W przeciwieństwie do dużych szkół, u mnie
                otrzymujesz moje 100% wsparcie. Pracuję na własną reputację,
                dlatego na Twoim sukcesie, wygodzie i realnym progresie zależy
                mi bezpośrednio.
              </p>
            </div>

            <div className="space-y-4 pt-1">
              <p className="text-sm font-bold uppercase tracking-wide text-sky-600 sm:text-base">
                Trzy filary mojego przygotowania
              </p>
              <ul className="space-y-4">
                {pillars.map((pillar) => (
                  <li key={pillar.title} className="space-y-1.5">
                    <p className="text-[0.9375rem] font-semibold text-slate-900 sm:text-base">
                      {pillar.title}
                    </p>
                    <p className="text-sm leading-relaxed text-muted sm:text-[0.9375rem]">
                      {pillar.body}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal variant="blur" delay={120}>
            <figure className="relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-2xl bg-sky-50 md:sticky md:top-28 md:max-w-none md:justify-self-end">
              <Image
                src="/images/medievals-portrait.png"
                alt="Jakub Grygiel z instrumentem historycznym, The Medievals"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/70 to-transparent px-4 py-4 text-sm text-white">
                The Medievals, muzyka dawna na scenie
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
