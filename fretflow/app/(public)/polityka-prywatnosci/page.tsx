import type { Metadata } from "next";
import Link from "next/link";

import { pageMetadata } from "@/lib/seo";
import { SITE_EMAIL } from "@/lib/site-contact";

export const metadata: Metadata = pageMetadata({
  title: "Polityka prywatności",
  description:
    "Jak GrygielGitara przetwarza dane osobowe: darmowy PDF, lista mailingowa, sklep, lekcje i Twoje prawa (RODO).",
  path: "/polityka-prywatnosci",
});

export default function PolitykaPrywatnosciPage() {
  const contactEmail = SITE_EMAIL;

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <div className="space-y-8 text-[0.9375rem] leading-relaxed text-slate-700 sm:text-base">
        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-600">
            RODO
          </p>
          <h1 className="text-[1.5rem] font-bold tracking-[-0.015em] text-slate-900 sm:text-3xl">
            Polityka prywatności GrygielGitara
          </h1>
          <p className="text-sm text-muted">
            Informacja o przetwarzaniu danych osobowych zgodnie z RODO (art. 13)
            oraz ustawą o świadczeniu usług drogą elektroniczną.
          </p>
        </header>

        <div className="space-y-6">
          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">
              1. Administrator
            </h2>
            <p>
              Administratorem Twoich danych jest <strong>Jakub Grygiel</strong>{" "}
              (marka <strong>GrygielGitara</strong>), Gdańsk. Kontakt:{" "}
              <a
                href={`mailto:${contactEmail}`}
                className="font-medium text-sky-700 hover:underline"
              >
                {contactEmail}
              </a>{" "}
              albo przez stronę{" "}
              <Link
                href="/kontakt"
                className="font-medium text-sky-700 hover:underline"
              >
                Kontakt
              </Link>
              .
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">
              2. Jakie dane zbieram
            </h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                z formularza darmowego PDF: adres e-mail oraz treść i datę
                zaznaczonych zgód;
              </li>
              <li>
                z rezerwacji i kontaktu: imię, e-mail, telefon i treść
                zgłoszenia — w zakresie, który sam podajesz;
              </li>
              <li>
                ze sklepu: dane potrzebne do konta, płatności (Stripe) i
                dostarczenia e-booka.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">
              3. Cele i podstawy prawne
            </h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>Wysłanie darmowego PDF „Gitarowy Reset”</strong> — art.
                6 ust. 1 lit. b RODO (działania zmierzające do zawarcia / wykonanie
                umowy o nieodpłatne udostępnienie pliku).
              </li>
              <li>
                <strong>Lista mailingowa i oferty</strong> (lekcje, e-booki,
                promocje) na e-mail — art. 6 ust. 1 lit. a RODO (zgoda) oraz art.
                10 ustawy o świadczeniu usług drogą elektroniczną. Zgoda jest
                dobrowolna, ale bez niej darmowy PDF nie jest udostępniany,
                ponieważ e-book jest świadczeniem w zamian za zapis na listę.
                Zgodę możesz wycofać w każdej chwili (link „Wypisz się z listy”
                w stopce maila albo strona{" "}
                <Link
                  href="/wypisz-sie"
                  className="font-medium text-sky-700 hover:underline"
                >
                  Wypisz się z listy
                </Link>
                ); wycofanie nie wpływa na zgodność z prawem przetwarzania przed
                jej wycofaniem.
              </li>
              <li>
                <strong>Lekcje, serwis, sklep</strong> — art. 6 ust. 1 lit. b
                RODO (umowa) oraz art. 6 ust. 1 lit. c (obowiązki rachunkowe i
                podatkowe, gdy powstają).
              </li>
              <li>
                <strong>Obrona roszczeń i bezpieczeństwo strony</strong> — art. 6
                ust. 1 lit. f RODO (prawnie uzasadniony interes administratora).
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">
              4. Odbiorcy danych
            </h2>
            <p>
              Dane mogą trafić do dostawców, którzy obsługują stronę w moim
              imieniu: hosting i baza (Supabase), poczta transakcyjna (Resend),
              lista mailingowa (Brevo), płatności sklepu (Stripe). Każdy z nich
              przetwarza dane tylko w zakresie zleconej usługi.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">
              5. Jak długo trzymam dane
            </h2>
            <p>
              E-mail z listy mailingowej — do wycofania zgody albo skutecznego
              sprzeciwu, potem do czasu przedawnienia ewentualnych roszczeń, jeśli
              jest to potrzebne. Dane zakupów i lekcji — przez okres wymagany
              przepisami i do wykonania umowy. Logi techniczne — zwyczajowo
              krótko, o ile dostawca hostingu ich nie ograniczy.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">
              6. Twoje prawa
            </h2>
            <p>
              Masz prawo do: dostępu do danych, sprostowania, usunięcia,
              ograniczenia przetwarzania, przenoszenia danych, sprzeciwu oraz
              wycofania zgody. Skargę możesz złożyć do Prezesa Urzędu Ochrony
              Danych Osobowych (UODO). Żeby skorzystać z praw, napisz na{" "}
              {contactEmail}.
            </p>
            <p>
              Podanie e-maila w formularzu PDF jest dobrowolne, ale niezbędne,
              żeby dostać plik i dołączyć do listy. Nie stosuję zautomatyzowanego
              podejmowania decyzji, które wywołuje skutki prawne.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">
              7. Pliki cookies
            </h2>
            <p>
              Strona może używać niezbędnych cookies do działania (sesja, konto)
              oraz narzędzi analitycznych / reklamowych, jeśli są włączone (np.
              Google Ads). Szczegóły tagów zależą od aktualnej konfiguracji
              strony.
            </p>
          </section>
        </div>

        <p className="flex flex-wrap gap-x-4 gap-y-2">
          <Link
            href="/regulamin-sklepu"
            className="font-semibold text-sky-700 underline-offset-2 hover:underline"
          >
            Regulamin sklepu
          </Link>
          <Link
            href="/sklep/gitarowy-reset"
            className="font-semibold text-sky-700 underline-offset-2 hover:underline"
          >
            Darmowy PDF
          </Link>
        </p>
      </div>
    </section>
  );
}
