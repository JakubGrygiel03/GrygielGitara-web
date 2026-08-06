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

const practicePoints = [
  {
    title: "Osobista odpowiedzialność za jakość",
    points: [
      "Nie ukrywam się za logiem korporacji — stoi za tym moje nazwisko",
      "Odpowiadam za materiały, tłumaczenie każdego ruchu i stan Twojego instrumentu",
      "Jeśli coś robimy, robimy to rzetelnie albo wcale",
    ],
  },
  {
    title: "Partnerskie, kumpelskie relacje",
    points: [
      "Bez szkolnego rygoru, stresującego oceniania i wytykania błędów",
      "Na lekcjach jesteśmy partnerami",
      "Cieszymy się z każdego czystego dźwięku i bez pośpiechu pokonujemy trudności",
    ],
  },
  {
    title: "Dzielenie się żywą pasją",
    points: [
      "Muzyka towarzyszy mi codziennie — na estradzie, przy warsztacie i na lekcjach",
      "Nie uczę z obowiązku",
      "Daję proste, bezpieczne narzędzia, by instrument stał się Twoim sposobem na wyrażenie siebie i relaks",
    ],
  },
] as const;

export function AboutSection() {
  return (
    <section id="o-mnie" className={SECTION_BAND_A}>
      <div className={cn("mx-auto max-w-6xl", SECTION_PAD)}>
        <div className="grid items-start gap-8 md:grid-cols-2 md:gap-10 lg:gap-16">
          <Reveal variant="blur" className="space-y-4 sm:space-y-5">
            <p className={SECTION_EYEBROW}>Autorska marka</p>
            <h2 className={cn("text-balance", SECTION_TITLE)}>
              Moja filozofia: muzyka to rzemiosło, nie wyścig
            </h2>

            <div className="space-y-3">
              <p className={SECTION_LEAD}>
                Za marką GrygielGitara nie stoi bezosobowa sieć szkół — stoi za
                nią moje nazwisko i osobista reputacja.
              </p>
              <p className={SECTION_BODY}>
                Buduję markę niezależnie, bo masowe podejście zabija pasję. W
                tradycyjnych szkołach uczeń dopasowuje się do programu. U mnie
                jest na odwrót: to ja dopasowuję metody, cierpliwość i tempo do
                Twoich dłoni i samopoczucia.
              </p>
            </div>

            <div className="space-y-3 pt-1">
              <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
                Co to oznacza dla Ciebie w praktyce?
              </h3>

              <ul className="divide-y divide-sky-300 border-y border-sky-300">
                {practicePoints.map((point) => (
                  <li key={point.title} className="space-y-2 py-3.5 sm:py-4">
                    <p className="font-semibold text-slate-900">{point.title}</p>
                    <ul className="space-y-1.5">
                      {point.points.map((item) => (
                        <li
                          key={item}
                          className={cn(
                            "relative pl-4 before:absolute before:left-0 before:top-[0.65em] before:size-1.5 before:rounded-full before:bg-sky-500",
                            SECTION_BODY,
                          )}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-base font-medium leading-[1.65] text-slate-800">
              Uczę na własnych warunkach, bo tylko wtedy mogę podpisać się
              obiema rękami pod Twoim komfortem i radością z gry.
            </p>
          </Reveal>

          <Reveal variant="blur" delay={120} className="md:sticky md:top-28">
            <figure className="relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-2xl bg-sky-50 md:max-w-none md:justify-self-end">
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
