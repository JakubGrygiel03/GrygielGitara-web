import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Strefa studenta",
  description: "Panel kursów i materiałów dla uczniów GrygielGitara — wkrótce.",
};

export default function MojeKursyPage() {
  return (
    <section className="mx-auto flex min-h-[50vh] w-full max-w-6xl flex-col justify-center px-4 py-10 sm:min-h-[60vh] sm:px-6 sm:py-16">
      <p className="text-sm font-semibold uppercase tracking-wider text-sky-600">
        Strefa studenta
      </p>
      <h1 className="mt-2 max-w-xl text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
        Moje kursy — w przygotowaniu
      </h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted sm:text-base lg:text-lg">
        Tu pojawią się zakupione e-booki, kursy wideo i postęp lekcji. Na razie
        umów lekcję lub zapisz się po darmowy poradnik.
      </p>
      <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row">
        <Button asChild className="w-full sm:w-auto">
          <Link href="/rezerwacja">Zarezerwuj lekcję próbną</Link>
        </Button>
        <Button asChild variant="secondary" className="w-full sm:w-auto">
          <Link href="/pobierz-poradnik">Pobierz poradnik PDF</Link>
        </Button>
      </div>
    </section>
  );
}
