export type ShopProductOffer = {
  slug: string;
  lead: string;
  forWhom: string[];
  youGet: string[];
  topics: string[];
  formatNote: string;
};

/**
 * Full offer copy for product detail pages (keyed by slug).
 * DB keeps short_description / description; this is the marketing body.
 */
export const shopProductOffers: Record<string, ShopProductOffer> = {
  "start-z-gitara-bez-stresu": {
    slug: "start-z-gitara-bez-stresu",
    lead:
      "Praktyczny e-book na pierwsze tygodnie z gitarą — bez szkolnego stresu, z konkretnymi krokami które od razu słychać.",
    forWhom: [
      "Dla osób które dopiero zaczynają albo wracają do gitary po przerwie",
      "Dla tych, którzy boją się „źle grać” i odkładają ćwiczenia",
      "Dla uczniów, którzy chcą jasny plan na start poza lekcjami",
    ],
    youGet: [
      "PDF do pobrania od razu po zakupie (konto + e-mail)",
      "Kolejność ćwiczeń na pierwsze dni i tygodnie",
      "Proste melodie i nawyki, które budują pewność",
      "Wskazówki jak ćwiczyć krótko, ale skutecznie",
    ],
    topics: [
      "Wygodna postawa i trzymanie instrumentu",
      "Strojenie bez paniki",
      "Pierwsze dźwięki i proste melodie",
      "Jak ćwiczyć 10–15 minut dziennie i widzieć postęp",
      "Czego unikać na starcie (najczęstsze pułapki)",
    ],
    formatNote:
      "Format: PDF · język polski · dostęp natychmiast po płatności Stripe.",
  },
  "setup-gitary-w-domu": {
    slug: "setup-gitary-w-domu",
    lead:
      "Krótki, konkretny przewodnik po opiece nad gitarą w domu — bez warsztatu i bez przepłacania za proste rzeczy.",
    forWhom: [
      "Dla gitarzystów, którzy chcą sami wymienić struny i zadbać o instrument",
      "Dla osób, którym gitara „źle gra” przez zaniedbany setup",
      "Dla uczniów przed serwisem — żeby wiedzieć, co warto zrobić samemu",
    ],
    youGet: [
      "PDF z checklistą i kolejnością kroków",
      "Bezpieczna wymiana strun krok po kroku",
      "Czyszczenie gryfu, korpusu i osprzętu",
      "Podstawowa regulacja — co możesz, a czego lepiej nie ruszać",
    ],
    topics: [
      "Kiedy wymieniać struny i jak dobrać grubość",
      "Czyszczenie bez ryzyka dla lakieru",
      "Wysokość strun, menzura — podstawy zrozumienia",
      "Objawy, przy których warto iść do lutnika / serwisu",
      "Proste nawyki, które przedłużają życie instrumentu",
    ],
    formatNote:
      "Format: PDF · język polski · dostęp natychmiast po płatności Stripe.",
  },
  "rytm-i-timing-na-start": {
    slug: "rytm-i-timing-na-start",
    lead:
      "Ćwiczenia rytmiczne, które naprawdę słychać — metronom bez frustracji, timing bez „sztywnego” grania.",
    forWhom: [
      "Dla początkujących, którym „ucieka” rytm",
      "Dla osób ćwiczących z metronomem, ale bez efektu",
      "Dla uczniów, którzy chcą grać równo do podkładów i z innymi",
    ],
    youGet: [
      "PDF z progresją ćwiczeń od bardzo prostych",
      "Sposób pracy z metronomem bez spięcia",
      "Ćwiczenia, które przenosisz od razu na utwory",
      "Checklista „czy już gram równo?”",
    ],
    topics: [
      "Puls, podział i liczenie — po ludzku",
      "Metronom: jak zacząć wolno i nie zrezygnować",
      "Proste rytmy na start (prawej / lewej ręki)",
      "Gry z podkładem i utrzymanie tempa",
      "Najczęstsze błędy timingowe i jak je łapać",
    ],
    formatNote:
      "Format: PDF · język polski · dostęp natychmiast po płatności Stripe.",
  },
};

export function getShopProductOffer(slug: string): ShopProductOffer | null {
  return shopProductOffers[slug] ?? null;
}
