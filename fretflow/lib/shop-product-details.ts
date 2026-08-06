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
      "Sugerowana cena to 79 zł. Aktualnie 59 zł — za gotowy plan na pierwsze tygodnie zamiast godzin szukania po internecie. Nadal wyraźnie taniej niż jedna lekcja stacjonarna. Kupujesz raz, wracasz do PDF kiedy chcesz.",
    editionNote: "Cena 59 zł · sugerowana 79 zł",
    ctaNote:
      "Po płatności PDF znajdziesz zwykle na e-mailu oraz w „Konto” → „Zakupy”. Przed zakupem zaznaczysz zgodę na natychmiastowe dostarczenie — po udostępnieniu pliku ustawowy zwrot bez podania przyczyny nie przysługuje.",
    purchaseEmailTip:
      "Na start mam dla Ciebie jedną, małą wskazówkę: nie rzucaj się od razu na głęboką wodę i trudne akordy. Zacznij spokojnie od pierwszych rozdziałów o ergonomii dłoni i prostych, jednogłosowych melodiach. Pozwól swoim palcom bezstresowo oswoić się z gryfem, a efekty usłyszysz szybciej, niż się spodziewasz.",
  },

  "setup-gitary-w-domu": {
    slug: "setup-gitary-w-domu",
    subtitle:
      "Setup i dbanie o gitarę w domu — wymiana strun, czyszczenie i podstawowa regulacja bez warsztatu. Konkret lutniczy w cenie impulse buy.",
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
      "19 zł to kwota praktycznie niezauważalna — jak kawa na mieście. Kupujesz bez długiego namysłu, dostajesz konkret lutniczy, a ja buduję z Tobą zaufanie do mojej wiedzy o instrumencie.",
    editionNote: "Wejście impulsowe · 19 zł",
    ctaNote:
      "Po płatności PDF jest zwykle na e-mailu oraz w „Konto” → „Zakupy”. Przed zakupem zaznaczysz zgodę na natychmiastowe dostarczenie — po udostępnieniu pliku ustawowy zwrot bez podania przyczyny nie przysługuje.",
    purchaseEmailTip:
      "Na start: zanim cokolwiek „regulujesz na czuja”, zrób spokojnie checklistę z e-booka — najpierw struny i czystość, potem ocena, czy coś wymaga serwisu. Małe, bezpieczne kroki chronią instrument i Twój spokój.",
  },

  "start-bez-stresu-feedback-vip": {
    slug: "start-bez-stresu-feedback-vip",
    subtitle:
      "E-book „Start z gitarą bez stresu” plus moja osobista analiza wideo Twojej postawy i ułożenia dłoni — pakiet dla osób, które chcą uniknąć błędów na starcie.",
    whyHook:
      "Czy wiesz, że najdroższe błędy na gitarze to te, których nie widzisz — bo ćwiczysz je codziennie w domu?",
    whyBody: [
      "Samoucy często utrwalają złe ułożenie dłoni, spięte barki albo twardy nacisk na struny. Potem miesiące „walki z gitarą”, a problem siedzi w ergonomii, którą trudno ocenić z lustra albo losowego filmu.",
      "Wierzę, że na starcie warto mieć kogoś, kto spojrzy z zewnątrz — krótko, konkretnie, bez szkolnego stresu.",
      "Ten pakiet łączy handbook na pierwsze tygodnie z moim feedbackiem VIP: nagrywasz krótkie wideo, ja wskazuję co poprawić, zanim zły nawyk się utrwali.",
    ],
    promise:
      "Dostajesz plan na start w PDF i konkretną korektę techniki na podstawie Twojego wideo — spokojniej, czyściej, bez zgadywania.",
    forWhom: [
      "Dla samouków z całej Polski, którzy chcą mojego oka na technikę, nie tylko plik PDF.",
      "Dla osób, które boją się „wdrukować” błędy dłoni / postawy na pierwsze tygodnie.",
      "Dla tych, którzy czują, że sam e-book za 59 zł to mało wsparcia — i wolą dopłacić za bezpośrednią analizę.",
    ],
    modules: [
      {
        title: "E-book „Start z gitarą bez stresu”",
        fact: "Pełny handbook na pierwsze tygodnie: ergonomia, strojenie, melodie, plan 15 minut.",
        why: "Masz jasną ścieżkę w domu — nie skaczesz po losowych filmikach.",
      },
      {
        title: "Jak nagrać wideo do analizy",
        fact: "Krótka instrukcja: kąt, światło, co pokazać (dłonie, postawa, prosty fragment).",
        why: "Feedback jest trafny, bo widać to, co naprawdę trzeba poprawić.",
      },
      {
        title: "Analiza Feedback VIP",
        fact: "Oglądam Twoje nagranie i odpisuję konkretnie: co zostawić, co zmienić, na czym się skupić.",
        why: "Eliminujesz błędy zanim wejdą w nawyk — oszczędzasz tygodnie frustracji.",
      },
      {
        title: "Jeden spokojny plan na kolejne dni",
        fact: "Po feedbacku dostajesz 2–3 priorytety ćwiczeń, nie listę stu rzeczy.",
        why: "Wiesz, co robić jutro — bez chaosu i bez poczucia, że „wszystko jest źle”.",
      },
    ],
    emotionFunctional:
      "PDF + procedura nagrania + pisemna / wideo odpowiedź z korektą techniki (w zależności od ustaleń przy realizacji).",
    emotionImage:
      "Wyobraź sobie: ćwiczysz z e-booka, nagrywasz 60–90 sekund przy oknie, dostajesz ode mnie konkret „tu rozluźnij kciuk, tu obniż bark” — i nagle gra staje się lżejsza.",
    emotionFeeling:
      "Czujesz spokój: nie jesteś sam z lustrem. Masz eksperckie oko na starcie i pewność, że budujesz dobre nawyki.",
    notForYou:
      "To nie jest pakiet cotygodniowych lekcji online ani nieograniczony mentoring. Jest jeden cykl Feedback VIP powiązany ze startem. Jeśli chcesz stałą naukę — umów lekcje. Jeśli chcesz handbook + jedną konkretną korektę techniki — jesteś we właściwym miejscu.",
    guaranteeTitle: digitalDeliveryGuaranteeTitle,
    guaranteeBody: digitalDeliveryGuaranteeBody,
    bonusesIntro: "W pakiecie VIP dostajesz też to, co jest w bestsellerze:",
    bonuses: [
      {
        title: "Bonusy z e-booka „Start…”",
        description:
          "Poradnik zakupowy pierwszej gitary oraz kolekcja wideo na start — jak w wersji standard.",
      },
      {
        title: "Priorytetowa ścieżka Feedback VIP",
        description:
          "Po zakupie dostajesz jasną instrukcję, jak i gdzie wysłać wideo do analizy.",
      },
    ],
    priceStory:
      "119 zł za handbook + mój personalny komentarz do Twojego wideo — a środkowa karta za 59 zł zostaje oczywistym wyborem „na start samemu”. VIP jest dla osób, które chcą korekty techniki od razu.",
    editionNote: "Pakiet VIP · e-book + feedback · 119 zł",
    ctaNote:
      "Po płatności e-book trafia zwykle na e-mail i do „Konto” → „Zakupy”. Instrukcję Feedback VIP dostajesz w wiadomości — tam umawiamy nagranie / analizę. Przed zakupem zaznaczysz zgodę na natychmiastowe dostarczenie treści cyfrowej.",
    purchaseEmailTip:
      "Najpierw otwórz e-book i rozdział o ergonomii, potem nagraj krótkie wideo według instrukcji VIP. Im spokojniej pokażesz dłonie i postawę, tym celniejszy będzie feedback.",
  },
};

export function getShopProductOffer(slug: string): ShopProductOffer | null {
  return shopProductOffers[slug] ?? null;
}
