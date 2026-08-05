import type { Metadata } from "next";
import Link from "next/link";

import { LeadMagnetForm } from "@/components/lead-magnet-form";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Darmowy poradnik PDF",
  description:
    "Zapisz się po poradnik o strojeniu gitary albo napisz przez kontakt i dostaniesz ten sam bonus automatycznie.",
};

export default function PobierzPoradnikPage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
      <div className="max-w-2xl">
        <p className="text-base font-bold uppercase tracking-wide text-sky-600 sm:text-lg">
          Lead magnet
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
