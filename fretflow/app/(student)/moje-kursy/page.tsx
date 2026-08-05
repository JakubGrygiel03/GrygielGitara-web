import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { StudentPortal } from "@/components/student-portal";
import { loadStudentPortalData } from "@/lib/student-portal";

export const metadata: Metadata = {
  title: "Strefa ucznia",
  description:
    "Materiały, najbliższa lekcja i historia zajęć — panel ucznia GrygielGitara.",
  robots: { index: false, follow: false },
};

export default async function MojeKursyPage() {
  const result = await loadStudentPortalData();

  if (!result.ok) {
    if (result.reason === "unauthenticated") {
      return (
        <section className="mx-auto max-w-lg px-4 py-16 text-center">
          <p className="text-sm text-muted">Przekierowanie do logowania…</p>
          <Button asChild className="mt-4">
            <Link href="/moje-kursy/login">Zaloguj się</Link>
          </Button>
        </section>
      );
    }

    return (
      <section className="mx-auto max-w-lg space-y-4 px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Brak dostępu</h1>
        <p className="text-sm leading-relaxed text-muted">{result.message}</p>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/kontakt">Napisz do nauczyciela</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/moje-kursy/login">Inny e-mail</Link>
          </Button>
        </div>
      </section>
    );
  }

  return <StudentPortal data={result.data} />;
}
