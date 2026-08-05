import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_#e0f2fe_0%,_transparent_50%)] lg:w-[60%]"
      />

      <div className="relative lg:grid lg:min-h-[calc(100vh-var(--header-height))] lg:grid-cols-[minmax(0,1fr)_minmax(20rem,42%)] xl:grid-cols-[minmax(0,1fr)_minmax(22rem,44%)]">
        <div className="flex flex-col justify-center px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16 xl:px-14 2xl:px-20">
          <div className="mx-auto w-full max-w-xl space-y-5 sm:space-y-6 lg:mx-0 lg:max-w-none lg:space-y-7">
            <p className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl md:text-7xl lg:text-[4.5rem] lg:leading-[1.05] xl:text-[4.75rem]">
              Grygiel<span className="text-sky-500">Gitara</span>
            </p>

            <p className="text-base font-medium leading-relaxed text-sky-800 sm:text-lg md:text-xl">
              Muzyka ma dawać wolność, ujście dla emocji i czystą radość. Nie
              stres, nudną teorię ani szkolny rygor.
            </p>

            <h1 className="text-2xl font-semibold leading-snug tracking-tight text-slate-900 sm:text-4xl md:text-[2.75rem] md:leading-tight">
              Zagraj swoje ulubione utwory bez nudnej teorii i szkolnego stresu
            </h1>

            <p className="text-base leading-relaxed text-muted sm:text-lg md:text-xl">
              Lekcje z dojazdem w Gdańsku, stacjonarnie obok Galerii Forum oraz
              online. Profesjonalny serwis instrumentu od technika w cenie zajęć.
            </p>

            <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/rezerwacja">Umów bezpłatną lekcję próbną</Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
              >
                <Link href="/pobierz-poradnik">Pobierz darmowy poradnik</Link>
              </Button>
            </div>

            <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
              Gwarancja pierwszej lekcji. Jeśli nie złapiemy wspólnego języka,
              nie płacisz za te zajęcia.
            </p>
          </div>

          <div className="relative mx-auto mt-8 aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl sm:mt-10 sm:max-w-md lg:hidden">
            <Image
              src="/images/jakub-portrait.png"
              alt="Jakub Grygiel, nauczyciel gitary w Gdańsku"
              fill
              priority
              sizes="(max-width: 640px) 100vw, 28rem"
              className="object-cover object-[center_18%]"
            />
          </div>
        </div>

        <div className="relative hidden min-h-full lg:block">
          <Image
            src="/images/jakub-portrait.png"
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 44vw, 0px"
            className="object-cover object-[center_16%]"
            aria-hidden
          />
          <div
            aria-hidden
            className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent xl:w-24"
          />
        </div>
      </div>
    </section>
  );
}
