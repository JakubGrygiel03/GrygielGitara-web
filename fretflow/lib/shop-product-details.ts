/**
 * Full product offer copy (O-F-E-R-T-A + Why / Blue Ocean).
 * Edit here when adding a new e-book / course / workshop page.
 */

import {
  digitalDeliveryGuaranteeBody,
  digitalDeliveryGuaranteeTitle,
} from "@/lib/shop-digital-terms";

export type ShopOfferModule = {
  title: string;
  fact: string;
  why: string;
};

export type ShopOfferBonus = {
  title: string;
  description: string;
};

export type ShopProductOffer = {
  slug: string;
  subtitle: string;
  /** WHY — problem + belief + method */
  whyHook: string;
  whyBody: string[];
  /** O — promise in customer language */
  promise: string;
  /** Precise audience (non-customers’ pains) */
  forWhom: string[];
  /** F — modules with Fact + Po co */
  modules: ShopOfferModule[];
  /** E — three floors of benefit */
  emotionFunctional: string;
  emotionImage: string;
  emotionFeeling: string;
  /** Honest limitation */
  notForYou: string;
  /** R — risk reversal */
  guaranteeTitle: string;
  guaranteeBody: string;
  /** T — bonuses */
  bonusesIntro: string;
  bonuses: ShopOfferBonus[];
  /** A — honest price reason (1st edition / feedback); live price from DB */
  priceStory: string;
  editionNote: string;
  ctaNote: string;
  /** Short tip in the post-purchase Resend e-mail */
  purchaseEmailTip: string;
};

export const shopProductOffers: Record<string, ShopProductOffer> = {
  "start-z-gitara-bez-stresu": {
    slug: "start-z-gitara-bez-stresu",
    subtitle:
      "Kompletny handbook na pierwsze tygodnie z gitarą (ok. 40 stron + wsparcie wideo): ergonomia, strojenie, proste melodie i spokojny plan dnia.",
    whyHook:
      "Czy wiesz, dlaczego aż osiemdziesiąt procent osób porzuca gitarę w ciągu pierwszych trzech tygodni?",
    whyBody: [
      "Większość samouków popełnia ten sam błąd: odpalają internet, próbują od razu łapać trudne, wielopalcowe akordy i walczyć z twardymi strunami. Efekt? Potworny ból palców, frustracja i poczucie braku talentu.",
      "Wierzę, że muzyka od pierwszego dnia powinna dawać wolność i czystą radość, a nie kojarzyć się z bólem i zniechęceniem. Dlatego powstał ten e-book — jako pełny program na start.",
      "Kluczem nie są skomplikowane chwyty, tylko metoda małych kroków i proste melodie jednogłosowe. Dłonie oswajają się z gryfem bez bólu, a Ty słyszysz muzykę od razu.",
    ],
    promise:
      "Zagraj swoje pierwsze, czyste melodie już w tym tygodniu — bez bólu palców, bez frustracji i bez wkuwania nudnej teorii.",
    forWhom: [
      "Dla początkujących, którzy chcą postawić pierwsze kroki bezpiecznie, lekko i z uśmiechem na twarzy.",
      "Dla osób wracających do gry po przerwie, które kiedyś zniechęciły się przez ból dłoni lub zbyt trudne ćwiczenia.",
      "Dla każdego, kto szuka prostego, kumpelskiego i jasnego planu działania, który można wdrożyć w piętnaście minut dziennie.",
    ],
    modules: [
      {
        title: "Instrukcja ułożenia rąk i ergonomii gry",
        fact: "Anatomia dłoni na gryfie i rozluźnianie napięć.",
        why: "Gra staje się lekka, struny przestają boleśnie wrzynać się w palce, a każdy dźwięk zaczyna brzmieć czysto.",
      },
      {
        title: "Strojenie instrumentu bez paniki",
        fact: "Prosty, 3-minutowy algorytm strojenia z darmową aplikacją.",
        why: "Twoja gitara zawsze brzmi doskonale, a Ty nie boisz się, że przy kręceniu kluczami zerwiesz strunę.",
      },
      {
        title: "Baza pierwszych, prostych melodii na tabulaturze",
        fact: "Specjalnie przygotowane, uproszczone zapisy znanych motywów.",
        why: "Od razu grasz piosenki, które znasz i lubisz, budując pewność siebie przed przejściem do akordów.",
      },
      {
        title: "Trening 15 minut dziennie",
        fact: "Gotowy harmonogram krótkich ćwiczeń na każdy dzień tygodnia.",
        why: "Widzisz stały postęp bez konieczności rezygnowania z innych obowiązków i bez poczucia winy.",
      },
    ],
    emotionFunctional:
      "Otrzymujesz czytelny plik PDF z ćwiczeniami i schematami technicznymi — do otwarcia na telefonie, tablecie albo komputerze.",
    emotionImage:
      "Wyobraź sobie, że wieczorem bierzesz do ręki gitarę. Otwierasz e-booka, poświęcasz zaledwie piętnaście minut, a Twoje palce bez wysiłku trafiają na właściwe struny. Słyszysz czysty, głęboki dźwięk.",
    emotionFeeling:
      "Czujesz tę niesamowitą, dziecięcą radość, gdy z Twojego pokoju zamiast głuchego brzęczenia płynie piękna, rozpoznawalna melodia. Masz poczucie, że w końcu to kontrolujesz — a muzyka staje się Twoim najlepszym sposobem na relaks po ciężkim dniu.",
    notForYou:
      "To nie jest podręcznik akademicki. Nie ma tu nauki czytania nut, historii muzyki ani przygotowania do egzaminów w szkole muzycznej. E-book jest dla kogoś, kto chce spokojny, prowadzony start w domu — krok po kroku, bez szkolnego rygoru.",
    guaranteeTitle: digitalDeliveryGuaranteeTitle,
    guaranteeBody: digitalDeliveryGuaranteeBody,
    bonusesIntro:
      "Kupując e-booka dzisiaj, otrzymujesz dwa darmowe dodatki, które rozwiążą Twoje kolejne problemy:",
    bonuses: [
      {
        title: 'Bonus 1 — lutniczy poradnik zakupowy: „Jak kupić swoją pierwszą tanią gitarę i nie dać się naciągnąć”',
        description:
          "Przygotowany okiem absolwenta Technikum Budowy Fortepianów. Dowiesz się, na co zwrócić uwagę w sklepie, by nie kupić wadliwego i twardego instrumentu.",
      },
      {
        title: "Bonus 2 — kolekcja wideo na start",
        description:
          "Krótkie nagrania z prawidłowym ułożeniem dłoni do ćwiczeń z książki, abyś ćwicząc w domu zawsze miał pewność, że robisz to dobrze.",
      },
    ],
    priceStory:
      "To pierwsza wersja tego e-booka. Ustawiam cenę świadomie niżej, bo zależy mi na szczerych opiniach i poprawkach od pierwszych czytelników — nie na sztucznej „promocji do północy”. Kupujesz gotowy materiał PDF z bonusami; w kolejnych wydaniach cena może wzrosnąć, gdy treść będzie dopracowana na podstawie feedbacku.",
    editionNote: "1. wersja e-booka · cena za feedback i rozwój materiału",
    ctaNote:
      "Po płatności PDF znajdziesz zwykle na e-mailu oraz w „Konto” → „Zakupy”. Przed zakupem zaznaczysz zgodę na natychmiastowe dostarczenie — po udostępnieniu pliku ustawowy zwrot bez podania przyczyny nie przysługuje.",
    purchaseEmailTip:
      "Na start mam dla Ciebie jedną, małą wskazówkę: nie rzucaj się od razu na głęboką wodę i trudne akordy. Zacznij spokojnie od pierwszych rozdziałów o ergonomii dłoni i prostych, jednogłosowych melodiach. Pozwól swoim palcom bezstresowo oswoić się z gryfem, a efekty usłyszysz szybciej, niż się spodziewasz.",
  },

  "setup-gitary-w-domu": {
    slug: "setup-gitary-w-domu",
    subtitle:
      "Domowa opieka nad gitarą bez warsztatu — wymiana strun, czyszczenie i podstawowa regulacja, które słychać w brzmieniu.",
    whyHook:
      "Czy wiesz, dlaczego tyle tanich gitar „źle gra”, zanim jeszcze zdążysz się ich nauczyć?",
    whyBody: [
      "Ludzie kupują instrument, odkładają go na bok albo walczą z twardymi strunami i brzęczeniem — a problem często nie leży w talencie, tylko w zaniedbanym setupie i złych nawykach przy wymianie strun.",
      "Wierzę, że każda gitara zasługuje na podstawową troskę, a Ty — na wiedzę, która chroni Cię przed przepłacaniem za proste rzeczy w serwisie.",
      "Dlatego ten e-book prowadzi Cię metodą małych, bezpiecznych kroków: co możesz zrobić sam w domu, a kiedy naprawdę warto oddać instrument w ręce fachowca.",
    ],
    promise:
      "Zadbaj o swoją gitarę w domu tak, by grała lżej, czyściej i dłużej — bez strachu, że „coś popsujesz”, i bez niepotrzebnych wizyt w warsztacie.",
    forWhom: [
      "Dla osób, które chcą same wymienić struny i nie bać się, że zerwą klucz albo porysują gryf.",
      "Dla gitarzystów, którym instrument „brzęczy”, jest twardy albo brudny — i czują, że coś jest nie tak, ale nie wiedzą od czego zacząć.",
      "Dla uczniów przed serwisem: żeby świadomie wiedzieć, co warto zrobić samemu, a za co naprawdę warto zapłacić.",
    ],
    modules: [
      {
        title: "Wymiana strun krok po kroku",
        fact: "Kolejność, kierunek nawijania i bezpieczne napięcie — checklista bez zgadywania.",
        why: "Struny trzymają strojenie dłużej, a Ty nie ryzykujesz uszkodzenia kluczy ani gryfu.",
      },
      {
        title: "Czyszczenie gryfu, korpusu i osprzętu",
        fact: "Co używać, czego unikać i jak nie zniszczyć lakieru.",
        why: "Instrument wygląda i brzmi świeżo, a brud nie „zjada” strun ani komfortu gry.",
      },
      {
        title: "Podstawowa regulacja — język lutnika po ludzku",
        fact: "Wysokość strun, menzura, proste objawy problemów — bez akademickiego żargonu.",
        why: "Rozumiesz, co słyszysz i czujesz pod palcami, zamiast zgadywać „czy to ja, czy gitara”.",
      },
      {
        title: "Kiedy iść do serwisu",
        fact: "Lista sygnałów, przy których domowa robótka to za mało.",
        why: "Oszczędzasz pieniądze na tym, co możesz zrobić sam — i nie marnujesz ich, gdy naprawdę potrzebujesz fachowca.",
      },
    ],
    emotionFunctional:
      "Dostajesz zwięzły PDF z checklistami i kolejnością działań — do otwarcia przy gitarze na stole.",
    emotionImage:
      "Wyobraź sobie sobotnie przedpołudnie: kładziesz gitarę na ręczniku, wymieniasz struny według e-booka, przecierasz gryf. Po kwadransie instrument znów „oddycha”.",
    emotionFeeling:
      "Czujesz spokój i kontrolę — nie jesteś już zależny od przypadkowych filmików na YouTube. Twoja gitara jest zadbana, a Ty masz pewność, że robisz to dobrze.",
    notForYou:
      "To nie jest kurs profesjonalnego lutnictwa ani zamiennik pełnego setupu w warsztacie. Nie znajdziesz tu frezowania siodełka, prostowania gryfu ani zaawansowanej elektroniki. Jeśli chcesz zostać technikiem — idź w warsztat. Ten poradnik jest dla gracza, który chce bezpiecznie zadbać o instrument w domu.",
    guaranteeTitle: digitalDeliveryGuaranteeTitle,
    guaranteeBody: digitalDeliveryGuaranteeBody,
    bonusesIntro: "Do e-booka dorzucam dodatki, które rozbrajają typowe wymówki:",
    bonuses: [
      {
        title: "Bonus 1 — mini-checklista „przed wyjściem z domu / przed lekcją”",
        description:
          "Szybki przegląd: struny, strojenie, luzy, brud — żeby nie grać na „chorej” gitarze.",
      },
      {
        title: "Bonus 2 — lista zakupowa domowego zestawu",
        description:
          "Co naprawdę warto mieć w szufladzie (i czego nie kupować „na zapas”).",
      },
    ],
    priceStory:
      "To pierwsze wydanie poradnika. Cena jest niższa celowo: zbieram uwagi od osób, które realnie użyją checklisty przy własnej gitarze. Nie ma tu odliczania „było drożej, jest taniej” — jest uczciwa stawka za 1. wersję, z myślą o ulepszeniach w następnych edycjach.",
    editionNote: "1. wersja poradnika · niższa cena za feedback praktyczny",
    ctaNote:
      "Po płatności PDF jest zwykle na e-mailu oraz w „Konto” → „Zakupy”. Przed zakupem zaznaczysz zgodę na natychmiastowe dostarczenie — po udostępnieniu pliku ustawowy zwrot bez podania przyczyny nie przysługuje.",
    purchaseEmailTip:
      "Na start: zanim cokolwiek „regulujesz na czuja”, zrób spokojnie checklistę z e-booka — najpierw struny i czystość, potem ocena, czy coś wymaga serwisu. Małe, bezpieczne kroki chronią instrument i Twój spokój.",
  },

  "rytm-i-timing-na-start": {
    slug: "rytm-i-timing-na-start",
    subtitle:
      "Ćwiczenia rytmiczne, które słychać — metronom bez frustracji i timing bez sztywnego, „robotycznego” grania.",
    whyHook:
      "Czy wiesz, dlaczego tyle osób ćwiczy z metronomem… i i tak „ucieka” z rytmu?",
    whyBody: [
      "Samoucy często włączają klik na zbyt szybkie tempo, walczą z utworem i kończą z poczuciem, że „nie mają poczucia rytmu”. To nie brak talentu — to zły start.",
      "Wierzę, że timing to umiejętność, którą da się zbudować małymi, przyjemnymi krokami — tak, żeby muzyka znów sprawiała radość, a nie stres.",
      "Ten e-book prowadzi Cię od pulsu i prostych podziałów do grania z podkładem — bez sztywności i bez rezygnacji po trzech dniach.",
    ],
    promise:
      "Zagraj równo i pewniej — z metronomem, który pomaga, zamiast frustruje — i przenieś to od razu na proste utwory.",
    forWhom: [
      "Dla początkujących, którym „ucieka” rytm przy najprostszych figurach.",
      "Dla osób ćwiczących z metronomem, ale bez efektu — bo zaczynają za szybko albo bez planu.",
      "Dla uczniów, którzy chcą grać równo do podkładów i z innymi, bez spięcia w barkach.",
    ],
    modules: [
      {
        title: "Puls i podział — po ludzku",
        fact: "Jak liczyć i czuć rytm bez szkolnego żargonu.",
        why: "Przestajesz zgadywać „gdzie jest jedynka” i wiesz, co właściwie ćwiczysz.",
      },
      {
        title: "Metronom bez frustracji",
        fact: "Protokół startu: wolne tempo, krótkie serie, jasne kryterium sukcesu.",
        why: "Klik przestaje być wrogiem — staje się lustrem, które pomaga, zamiast karać.",
      },
      {
        title: "Proste rytmy na start",
        fact: "Figury na prawą / lewą rękę, które od razu słychać w grze.",
        why: "Budujesz pewność małymi wygranymi, zanim wejdziesz w trudniejsze utwory.",
      },
      {
        title: "Gra z podkładem",
        fact: "Jak utrzymać tempo przy znanym motywie i nie „płynąć”.",
        why: "Muzyka zaczyna brzmieć jak zespół — a Ty czujesz, że trzymasz kontrolę.",
      },
    ],
    emotionFunctional:
      "PDF z progresją ćwiczeń i checklistą „czy już gram równo?” — do pracy przy gitarze 10–15 minut dziennie.",
    emotionImage:
      "Wyobraź sobie: włączasz metronom, robisz trzy krótkie serie z e-booka, potem ten sam rytm do prostego podkładu. Palce i ucho w końcu „idą razem”.",
    emotionFeeling:
      "Zamiast wstydu i spięcia pojawia się spokój: wiesz, że timing da się trenować. Muzyka znów jest zabawą, a nie egzaminem.",
    notForYou:
      "To nie jest podręcznik akademickiej rytmiki ani kurs na dyplom w szkole muzycznej. Nie ma tu skomplikowanych polirytmii ani teorii na egzamin. Jeśli szukasz rozrywki i praktycznego timingowego startu w domu — jesteś we właściwym miejscu.",
    guaranteeTitle: digitalDeliveryGuaranteeTitle,
    guaranteeBody: digitalDeliveryGuaranteeBody,
    bonusesIntro: "Dorzucam turbo-dodatki, które rozbrajają typowe wymówki:",
    bonuses: [
      {
        title: "Bonus 1 — 7-dniowy mini-plan rytmiczny",
        description:
          "Gotowy tydzień krótkich sesji, żeby nie myśleć „co dziś ćwiczyć”.",
      },
      {
        title: "Bonus 2 — lista podkładów na start (wolne tempa)",
        description:
          "Propozycje utworów / stylów, przy których łatwiej usłyszeć postęp.",
      },
    ],
    priceStory:
      "To pierwsza wersja materiału o rytmie. Cenę trzymam niżej, żeby więcej osób mogło przetestować ćwiczenia i powiedzieć, co działa w domu — a co warto dopisać. Bez sztucznych przecen: płacisz za 1. wydanie, a ja inwestuję Twój feedback w kolejne poprawki.",
    editionNote: "1. wersja e-booka · cena za feedback i rozwój ćwiczeń",
    ctaNote:
      "Po płatności materiał jest zwykle na e-mailu oraz w „Konto” → „Zakupy”. Przed zakupem zaznaczysz zgodę na natychmiastowe dostarczenie — po udostępnieniu pliku ustawowy zwrot bez podania przyczyny nie przysługuje.",
    purchaseEmailTip:
      "Na start: włącz metronom wolniej, niż Ci się wydaje „wygodnie”, i zrób krótką serię z pierwszych ćwiczeń. Timing buduje się małymi wygranymi — nie walką z tempem.",
  },
};

export function getShopProductOffer(slug: string): ShopProductOffer | null {
  return shopProductOffers[slug] ?? null;
}
