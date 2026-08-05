import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="hero-glow pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_#e0f2fe_0%,_transparent_50%)] lg:w-[60%]"
      />

      <div className="relative lg:grid lg:min-h-[calc(100vh-var(--header-height))] lg:grid-cols-[minmax(0,1fr)_minmax(20rem,42%)] xl:grid-cols-[minmax(0,1fr)_minmax(22rem,44%)]">
        <div className="flex flex-col justify-center px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16 xl:px-14 2xl:px-20">
          <div className="mx-auto w-full max-w-xl space-y-4 sm:space-y-6 lg:mx-0 lg:max-w-none lg:space-y-7">
            <p
              className="hero-animate-item text-[1.75rem] font-extrabold leading-[1.12] tracking-[-0.02em] text-slate-900 sm:text-6xl sm:leading-none md:text-7xl lg:text-[4.5rem] lg:leading-[1.05] xl:text-[4.75rem]"
              style={{ animationDelay: "40ms" }}
            >
              Grygiel<span className="text-sky-500">Gitara</span>
            </p>

            <p
              className="hero-animate-item text-[0.9375rem] font-medium leading-relaxed text-sky-800 sm:text-lg md:text-xl"
              style={{ animationDelay: "120ms" }}
            >
              Muzyka ma dawać wolność, ujście dla emocji i czystą radość. Nie
              stres, nudną teorię ani szkolny rygor.
            </p>

            <h1
              className="hero-animate-item text-[1.375rem] font-semibold leading-snug tracking-[-0.015em] text-slate-900 sm:text-4xl sm:leading-tight md:text-[2.75rem]"
              style={{ animationDelay: "200ms" }}
            >
              Zagraj swoje ulubione utwory bez nudnej teorii i szkolnego stresu
            </h1>

            <p
              className="hero-animate-item text-[0.9375rem] leading-relaxed text-muted sm:text-lg md:text-xl"
              style={{ animationDelay: "280ms" }}
            >
              Lekcje z dojazdem w Gdańsku, stacjonarnie obok Galerii Forum oraz
              online. Profesjonalny serwis instrumentu od technika w cenie zajęć.
            </p>

            <div
              className="hero-animate-item flex w-full flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3"
              style={{ animationDelay: "360ms" }}
            >
              <Button
                asChild
                size="lg"
                className="w-full px-5 text-[0.9375rem] leading-snug sm:w-auto sm:text-base"
              >
                <Link href="/rezerwacja">Umów bezpłatną lekcję próbną</Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="w-full px-5 text-[0.9375rem] leading-snug sm:w-auto sm:text-base"
              >
                <Link href="/pobierz-poradnik">Pobierz darmowy poradnik</Link>
              </Button>
            </div>

            <p
              className="hero-animate-item text-[0.8125rem] leading-relaxed text-slate-600 sm:text-base"
              style={{ animationDelay: "440ms" }}
            >
              Gwarancja pierwszej lekcji. Jeśli nie złapiemy wspólnego języka,
              nie płacisz za te zajęcia.
            </p>
          </div>

          <div
            className="hero-animate-item relative mx-auto mt-8 aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl sm:mt-10 sm:max-w-md lg:hidden"
            style={{ animationDelay: "500ms" }}
          >
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

        <div
          className="hero-animate-item relative hidden min-h-full lg:block"
          style={{ animationDelay: "220ms" }}
        >
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
