import type { Metadata } from "next";
import Link from "next/link";

import { LeadMagnetForm } from "@/components/lead-magnet-form";
import { Button } from "@/components/ui/button";
import { isFreeGuideOpen } from "@/lib/free-guide";

export const metadata: Metadata = {
  title: "Darmowy poradnik PDF",
  description:
    "Darmowy poradnik o strojeniu gitary — GrygielGitara. Wkrótce dostępny do pobrania.",
};

export default function PobierzPoradnikPage() {
  if (!isFreeGuideOpen()) {
    return (
      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-xl space-y-5 text-center sm:space-y-6">
          <p className="text-base font-bold uppercase tracking-wide text-sky-600 sm:text-lg">
            Poradnik PDF
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            Już wkrótce
          </h1>
          <p className="text-[0.9375rem] leading-relaxed text-muted sm:text-base">
            Przygotowuję darmowy poradnik o strojeniu i przygotowaniu gitary.
            Pojawi się tu, gdy będzie gotowy.
          </p>
          <div className="flex flex-col items-stretch justify-center gap-3 pt-2 sm:flex-row sm:items-center">
            <Button asChild>
              <Link href="/rezerwacja">Umów lekcję próbną</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/kontakt">Napisz wiadomość</Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
      <div className="max-w-2xl">
        <p className="text-base font-bold uppercase tracking-wide text-sky-600 sm:text-lg">
          Darmowy poradnik
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
          Jak bezstresowo nastroić i przygotować gitarę do gry w 3 minuty
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base lg:text-lg">
          Najszybsza ścieżka: napisz przez kontakt i ten sam poradnik PDF
          dostajesz automatycznie jako bonus za wiadomość. Możesz też zostawić
          sam e-mail poniżej.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row">
        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link href="/kontakt">Napisz i odbierz bonus PDF</Link>
        </Button>
      </div>

      <div className="mt-10 max-w-md space-y-3">
        <p className="text-sm font-medium text-slate-800">
          Albo tylko e-mail (bez wiadomości):
        </p>
        <LeadMagnetForm />
      </div>
    </section>
  );
}
