import Image from "next/image";

import { Reveal } from "@/components/reveal";

const practices = [
  {
    title: "Osobista odpowiedzialność",
    body: "Nie ukrywam się za logiem znanej firmy. Moje nazwisko firmuje każdą minutę naszych zajęć, jakość przygotowanych dla Ciebie materiałów oraz stan Twojego instrumentu po moim serwisie. Jeśli coś robimy, robimy to dobrze albo wcale.",
  },
  {
    title: "Partnerskie, kumpelskie relacje",
    body: "Całkowicie odrzucam szkolny rygor, ocenianie i wytykanie błędów. Na moich lekcjach jesteśmy partnerami. Wspólnie cieszymy się z każdego czystego dźwięku i wspólnie, bez pośpiechu, pokonujemy techniczne trudności.",
  },
  {
    title: "Dzielenie się żywą pasją",
    body: "Muzyka towarzyszy mi każdego dnia – na estradzie, przy warsztatowym stole rzemieślniczym i podczas pracy z uczniami. Nie uczę z obowiązku, ale z autentycznej chęci przekazania Ci narzędzi do tego, by instrument stał się Twoim najlepszym sposobem na wyrażenie siebie i odpoczynek po ciężkim dniu.",
  },
] as const;

export function AboutSection() {
  return (
    <section id="o-mnie" className="scroll-mt-24">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        <div className="grid items-start gap-8 md:grid-cols-2 md:gap-10 lg:gap-16">
          <Reveal variant="blur" className="space-y-4 sm:space-y-5">
            <p className="text-base font-bold uppercase tracking-wide text-sky-600 sm:text-lg">
              Autorska marka
            </p>
            <h2 className="text-[1.375rem] font-bold leading-snug tracking-[-0.015em] text-slate-900 sm:text-3xl lg:text-4xl">
              Moja filozofia: Muzyka to rzemiosło, nie wyścig
            </h2>
            <div className="space-y-4 text-[0.9375rem] leading-relaxed text-muted sm:text-base lg:text-lg">
              <p>
                Za marką GrygielGitara nie stoi bezosobowa korporacja, sieć szkół
                muzycznych ani managerowie goniący za kolejnym arkuszem w
                Excelu. Stoję za nią ja. Kiedy decydujesz się na naukę ze mną,
                nie kupujesz po prostu „godziny z nauczycielem”. Wchodzisz do
                mojej pracowni, w której do muzyki podchodzimy z szacunkiem,
                spokojem i rzemieślniczą precyzją.
              </p>
              <p className="text-slate-800">
                Świadomie buduję swoją markę niezależnie, ponieważ głęboko
                wierzę, że masowe podejście zabija w ludziach pasję. W
                tradycyjnych szkołach często brakuje miejsca na indywidualność,
                a uczeń musi dopasować się do sztywnego, odgórnego programu. U
                mnie jest dokładnie na odwrót. To ja dopasowuję swoje narzędzia,
                cierpliwość i tempo do Twoich dłoni oraz Twojego samopoczucia
                danego dnia.
              </p>
            </div>

            <div className="space-y-4 pt-1">
              <p className="text-sm font-bold uppercase tracking-wide text-sky-600 sm:text-base">
                Co to oznacza dla Ciebie w praktyce?
              </p>
              <ul className="space-y-4">
                {practices.map((item) => (
                  <li key={item.title} className="space-y-1.5">
                    <p className="text-[0.9375rem] font-semibold text-slate-900 sm:text-base">
                      {item.title}
                    </p>
                    <p className="text-sm leading-relaxed text-muted sm:text-[0.9375rem]">
                      {item.body}
                    </p>
                  </li>
                ))}
              </ul>
              <p className="text-[0.9375rem] leading-relaxed text-slate-800 sm:text-base">
                Uczę na własnych warunkach, bo tylko wtedy mogę dać Ci jakość i
                zaangażowanie, pod którymi podpisuję się obiema rękami.
              </p>
            </div>
          </Reveal>

          <Reveal variant="blur" delay={120}>
            <figure className="relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-2xl bg-sky-50 md:sticky md:top-28 md:max-w-none md:justify-self-end">
              <Image
                src="/images/jakub-portrait.png"
                alt="Jakub Grygiel — osobiste podejście do nauki gitary"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover object-[center_18%]"
              />
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
