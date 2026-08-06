import type { Metadata } from "next";
import Link from "next/link";

import { SITE_EMAIL } from "@/lib/site-contact";

export const metadata: Metadata = {
  title: "Regulamin sklepu",
  description:
    "Regulamin sklepu GrygielGitara — jak kupujesz e-booki, jak dostajesz PDF i jakie masz prawa.",
};

export default function RegulaminSklepuPage() {
  const contactEmail = SITE_EMAIL;

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <div className="space-y-8 text-[0.9375rem] leading-relaxed text-slate-700 sm:text-base">
        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-600">
            Sklep
          </p>
          <h1 className="text-[1.5rem] font-bold tracking-[-0.015em] text-slate-900 sm:text-3xl">
            Regulamin sklepu internetowego GrygielGitara
          </h1>
          <p className="text-sm text-muted">
            Ten regulamin obowiązuje, gdy kupujesz e-booki i inne treści cyfrowe
            w sklepie na stronie grygielgitara.pl (oraz domenach powiązanych).
          </p>
        </header>

        <div className="space-y-6">
          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">
              1. Sprzedawca
            </h2>
            <p>
              Sklep prowadzi <strong>Jakub Grygiel</strong> (marka{" "}
              <strong>GrygielGitara</strong>). W sprawach zakupu napisz na:{" "}
              <a
                href={`mailto:${contactEmail}`}
                className="font-medium text-sky-700 hover:underline"
              >
                {contactEmail}
              </a>
              {" "}
              albo przez stronę{" "}
              <Link
                href="/kontakt"
                className="font-medium text-sky-700 hover:underline"
              >
                Kontakt
              </Link>
              . Sprzedaż online, działalność związana z Gdańskiem.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">
              2. Co kupujesz
            </h2>
            <p>
              W sklepie kupujesz treści cyfrowe niedostarczane na nośniku
              materialnym — przede wszystkim e-booki w formacie PDF — oraz
              ewentualne dodatki opisane na stronie danego produktu.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">
              3. Konto i zawarcie umowy
            </h2>
            <p>
              Żeby kupić produkt, zakładasz lub logujesz się na konto przez
              przycisk „Konto” w menu strony. Umowa sprzedaży na odległość
              zostaje zawarta w chwili skutecznej płatności (przez Stripe).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">
              4. Ceny i płatności
            </h2>
            <p>
              Ceny przy produktach to ceny brutto w złotych polskich (PLN), o ile
              nie wskazano inaczej. Płacisz przez bezpieczną bramkę Stripe —
              kartą lub innymi metodami, które Stripe udostępnia.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">
              5. Jak dostajesz e-booka
            </h2>
            <p>Po opłaceniu zamówienia materiał jest udostępniany od razu:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                zwykle na Twój e-mail (potwierdzenie zakupu + ewentualny
                załącznik PDF),
              </li>
              <li>
                oraz w panelu po zalogowaniu: „Konto” → sekcja „Zakupy”, skąd
                możesz pobrać PDF w każdej chwili.
              </li>
            </ul>
          </section>

          <section className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
            <h2 className="text-lg font-semibold text-slate-900">
              6. Prawo odstąpienia od umowy przy treściach cyfrowych
            </h2>
            <p>
              Zgodnie z art. 38 ust. 1 pkt 13 ustawy o prawach konsumenta, prawo
              odstąpienia od umowy zawartej poza lokalem przedsiębiorstwa lub na
              odległość <strong>nie przysługuje</strong> konsumentowi w
              odniesieniu do umów o dostarczanie treści cyfrowych niedostarczanych
              na nośniku materialnym, za które konsument jest zobowiązany do
              zapłaty ceny, jeżeli przedsiębiorca rozpoczął świadczenie za
              wyraźną i uprzednią zgodą konsumenta, który został poinformowany
              przed rozpoczęciem świadczenia, że po spełnieniu świadczenia przez
              przedsiębiorcę utraci prawo odstąpienia od umowy, i przyjął to do
              wiadomości, a przedsiębiorca przekazał konsumentowi potwierdzenie
              zawarcia umowy.
            </p>
            <p>
              W praktyce oznacza to dla Ciebie: przed płatnością zaznaczasz{" "}
              <strong>osobny checkbox</strong> — że chcesz dostać treść cyfrową
              od razu i przyjmujesz do wiadomości utratę prawa odstąpienia od
              umowy. Ta zgoda nie jest „ukryta” w samym fakcie akceptacji
              regulaminu. Po udostępnieniu pliku PDF ustawowy zwrot bez podania
              przyczyny <strong>nie przysługuje</strong>. Potwierdzenie tej
              zgody dostajesz też w mailu po zakupie.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">
              7. Reklamacje
            </h2>
            <p>
              Brak prawa do zwrotu „bez podania przyczyny” nie odbiera Ci prawa
              do reklamacji, gdy treść cyfrowa jest niezgodna z umową — np. plik
              jest uszkodzony, nie otwiera się albo treść istotnie odbiega od
              opisu oferty. Napisz wtedy przez{" "}
              <Link
                href="/kontakt?temat=shop_support"
                className="font-medium text-sky-700 hover:underline"
              >
                Kontakt
              </Link>{" "}
              (temat „Materiały cyfrowe / lista oczekujących”) albo odpisz na
              mail z zakupem. Najpierw naprawiamy dostęp lub plik; przy istotnej
              wadzie możesz odstąpić od umowy i żądać zwrotu ceny.
              Odpowiedzialność za wady treści cyfrowej trwa dwa lata od
              dostarczenia.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">
              8. Licencja i udostępnianie
            </h2>
            <p>
              Kupiony materiał jest na Twój użytek osobisty. Nie rozpowszechniaj
              go dalej, nie odsprzedawaj, nie publikuj w sieci i nie udostępniaj
              logowania do konta osobom trzecim.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">
              9. Postanowienia końcowe
            </h2>
            <p>
              W sprawach nieuregulowanych w tym regulaminie stosuje się prawo
              polskie, w szczególności ustawę o prawach konsumenta oraz
              przepisy Kodeksu cywilnego. Regulamin może być aktualizowany — do
              Twojego zakupu stosuje się wersja obowiązująca w chwili płatności.
            </p>
          </section>
        </div>

        <p>
          <Link
            href="/sklep"
            className="font-semibold text-sky-700 underline-offset-2 hover:underline"
          >
            ← Wróć do sklepu
          </Link>
        </p>
      </div>
    </section>
  );
}
