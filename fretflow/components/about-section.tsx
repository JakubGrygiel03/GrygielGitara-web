import Image from "next/image";

import { Reveal } from "@/components/reveal";

export function AboutSection() {
  return (
    <section id="o-mnie" className="scroll-mt-24">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-10 lg:gap-16">
          <Reveal variant="blur" className="space-y-3 sm:space-y-4">
            <p className="text-base font-bold uppercase tracking-wide text-sky-600 sm:text-lg">
              Autorska marka
            </p>
            <h2 className="text-[1.375rem] font-bold leading-snug tracking-[-0.015em] text-slate-900 sm:text-3xl lg:text-4xl">
              Pedagog, technik instrumentów i muzyk sceniczny
            </h2>
            <div className="space-y-4 text-[0.9375rem] leading-relaxed text-muted sm:text-base lg:text-lg">
              <p>
                Ponad 7 lat nauczania, PSM II stopnia w Kaliszu oraz Technikum
                Budowy i Strojenia Fortepianów. Na scenie gram z The Medievals.
              </p>
              <p className="text-slate-800">
                Buduję własną markę GrygielGitara, bez masówki i korporacyjnych
                schematów. Odpowiadam osobiście za Twój komfort, progres i radość
                z muzyki.
              </p>
            </div>
          </Reveal>

          <Reveal variant="blur" delay={120}>
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
