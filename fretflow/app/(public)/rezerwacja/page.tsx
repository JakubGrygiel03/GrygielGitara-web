import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";

import { BookingForm } from "@/components/booking-form";
import { Button } from "@/components/ui/button";
import { SitePhoneCard } from "@/components/site-phone-card";
import { getAdminSettings } from "@/lib/admin-settings";

export const metadata: Metadata = {
  title: "Rezerwacja lekcji próbnej",
  description:
    "Zarezerwuj lekcję próbną gitary w Gdańsku lub online. Gwarancja pierwszej lekcji — nie płacisz, jeśli nie pasuje.",
};

export default async function RezerwacjaPage() {
  const settings = await getAdminSettings();

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
      <div className="max-w-2xl space-y-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
          Zarezerwuj lekcję próbną
        </h1>
        <p className="text-base leading-[1.65] text-slate-700 sm:text-[1.0625rem] sm:leading-relaxed">
          Wybierz wariant ceny i miejsce — odpiszę z propozycją terminu. Lekcje
          obok Galerii Forum, z dojazdem w Gdańsku albo online. Liczba miejsc
          jest ograniczona kalendarzem koncertowym.
        </p>

        <SitePhoneCard hint="Wolisz umówić się od razu? Zadzwoń." />

        <div className="flex gap-3 rounded-2xl border border-sky-200 bg-sky-50/90 px-4 py-4 sm:px-5">
          <ShieldCheck
            className="mt-0.5 size-5 shrink-0 text-sky-600"
            aria-hidden
          />
          <p className="text-sm leading-relaxed text-slate-700 sm:text-base">
            <span className="font-semibold text-slate-900">
              Gwarancja pierwszej lekcji:
            </span>{" "}
            po spotkaniu decydujesz Ty. Jeśli uznasz, że gitara albo nasza
            współpraca to nie to, nie płacisz za te zajęcia.
          </p>
        </div>
      </div>

      <div className="mt-8 w-full max-w-xl sm:mt-10">
        {settings.bookingPaused ? (
          <div className="space-y-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-5 text-amber-950 sm:px-5">
            <p className="font-semibold">Brak wolnych okienek na nowe starty</p>
            <p className="text-base leading-[1.65]">
              {settings.bookingPausedMessage}
            </p>
            <p className="text-base leading-[1.65]">
              Napisz przez kontakt z tematem listy oczekujących — odezwę się,
              gdy zwolni się stała godzina.
            </p>
            <Button asChild>
              <Link href="/kontakt?temat=lesson_waitlist">
                Napisz przez kontakt
              </Link>
            </Button>
          </div>
        ) : (
          <BookingForm />
        )}
      </div>

      <p className="mt-8 max-w-xl text-base leading-[1.65] text-slate-700">
        Pytanie o serwis, sklep albo coś innego niż lekcja?{" "}
        <Link
          href="/kontakt"
          className="font-medium text-sky-700 underline-offset-2 hover:underline"
        >
          Napisz przez kontakt
        </Link>
        .
      </p>
    </section>
  );
}
