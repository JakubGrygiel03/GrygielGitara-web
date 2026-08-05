import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-sky-100 bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-10">
        <div>
          <p className="text-xs font-medium text-muted">Jakub Grygiel</p>
          <p className="text-base font-bold text-slate-900">
            Grygiel<span className="text-sky-500">Gitara</span>
          </p>
          <p className="mt-1 text-sm text-muted">
            Lekcje · serwis gitary · materiały · Gdańsk
          </p>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium text-slate-700">
          <Link
            href="/#oferta"
            className="inline-flex min-h-11 items-center hover:text-sky-600"
          >
            Oferta
          </Link>
          <Link
            href="/#cennik"
            className="inline-flex min-h-11 items-center hover:text-sky-600"
          >
            Cennik
          </Link>
          <Link
            href="/pobierz-poradnik"
            className="inline-flex min-h-11 items-center hover:text-sky-600"
          >
            Poradnik PDF
          </Link>
          <Link
            href="/rezerwacja"
            className="inline-flex min-h-11 items-center hover:text-sky-600"
          >
            Rezerwacja
          </Link>
          <Link
            href="/kontakt"
            className="inline-flex min-h-11 items-center hover:text-sky-600"
          >
            Kontakt
          </Link>
        </div>
      </div>
    </footer>
  );
}
