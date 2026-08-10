/**
 * Free PDF gift — Gitarowy Reset (canonical offer under /sklep/gitarowy-reset).
 */

export const FREE_GUIDE_SHORT_TITLE = "Gitarowy Reset";

export const FREE_GUIDE_TITLE =
  "Gitarowy Reset — jak zacząć grać bez bólu dłoni, frustracji i rzucania instrumentu w kąt";

/** Short blurb for cards / meta. */
export const FREE_GUIDE_BLURB =
  "Praktyczny, darmowy PDF: jak ominąć „ścianę akordów”, odciążyć dłonie i zacząć grać z satysfakcją od pierwszych minut — bez nudnej teorii.";

export const FREE_GUIDE_INTRO: string[] = [
  "Statystyki są brutalne: aż 90% osób, które kupują swoją pierwszą gitarę, porzuca marzenia o graniu w ciągu pierwszego roku, najczęściej już po pierwszych trzech miesiącach. Patrzysz potem na instrument stojący w kącie pokoju, na którym powoli osiada kurz, i wmawiasz sobie brak talentu, za grube palce czy brak słuchu.",
  "Prawda jest jednak zupełnie inna. Najczęściej po prostu zderzasz się ze „ścianą akordów” (na czele z bolesnym chwytem F-dur) albo Twoja gitara jest tak twarda, że walka z nią fizycznie rani dłonie i wywołuje ból.",
  "Mój e-book „Gitarowy Reset” to nie kolejna książka z nudną teorią. To praktyczny, rzemieślniczy przewodnik oparty na fizjologii dłoni i biomechanice. Pokazuję w nim, jak oszukać układ nerwowy, ułatwić sobie grę i czerpać z niej czystą satysfakcję od pierwszych minut.",
];

export type FreeGuideTopic = {
  title: string;
  body: string;
};

export type FreeGuideChapter = {
  title: string;
  topics: FreeGuideTopic[];
};

export const FREE_GUIDE_CHAPTERS: FreeGuideChapter[] = [
  {
    title: "Rozdział 1: Ściana akordów vs. Dopaminowy Hak",
    topics: [
      {
        title: "Metoda Jednogłosowa (Dopaminowy Hak)",
        body: "Zapomnij na start o skomplikowanych chwytach. Pokazuję, jak za pomocą tylko jednego palca i jednej struny zagrać kultowy, rozpoznawalny motyw (np. Smoke on the Water) w pierwsze 60 sekund. Twój mózg od razu dostaje nagrodę dźwiękową i uwalnia dopaminę, dając Ci motywację do dalszych ćwiczeń.",
      },
      {
        title: "Dźwięki Podstawowe (Root Notes)",
        body: "Prosty sposób na to, by zacząć grać do ulubionych utworów ze Spotify czy YouTube, używając jedynie pojedynczych dźwięków basowych na strunach E i A, zamiast uczyć się kilkunastu trudnych chwytów.",
      },
    ],
  },
  {
    title: "Rozdział 2: Biomechaniczny Reset – Koniec walki z własnym ciałem",
    topics: [
      {
        title: "Test 5% Siły (Zasada Minimalnego Nacisku)",
        body: "Proste ćwiczenie, które pokazuje, jak lekko dociskać strunę, by dźwięk był idealnie czysty. Koniec z bolesnym, kurczowym „wściekłym uściskiem” (Death Grip), który rani palce, spina przedramię i kark.",
      },
      {
        title: "Gitarowa Termoterapia",
        body: "Szybki, fizjoterapeutyczny trik z ciepłą wodą przed grą, który błyskawicznie uelastycznia mięśnie i chroni przed mikrourazami.",
      },
      {
        title: "Pułapka „Latających Palców” i odrywanie wzroku",
        body: "Jak oduczyć się obsesyjnego wpatrywania się w gryf i trzymać nieużywane palce tuż nad strunami, co automatycznie przyspiesza grę i zdejmuje napięcie z karku.",
      },
    ],
  },
  {
    title: "Rozdział 3: Trzy gitary, trzy różne pułapki (Zderzenie ze sprzętem)",
    topics: [
      {
        title: "Obalenie mitu „zacznij od klasyka”",
        body: "Wyjaśniam, dlaczego szeroki gryf (aż 52 mm!) i nylonowe struny w gitarze klasycznej to często katorga dla drobniejszych dłoni, a nie ułatwienie.",
      },
      {
        title: "Wysoka akcja strun na akustyku",
        body: "Dowiesz się, jak zbyt wysoko zawieszone struny (często 5–6 mm nad progiem) celowo utrudniają Ci naukę i dlaczego regulacja u lutnika za kilkadziesiąt złotych potrafi uratować Twój zapał.",
      },
      {
        title: "Pułapki elektryka",
        body: "Jak nie przepalić całego budżetu na samo wiosło (podział 60/40 ze wzmacniaczem), dlaczego na start kategorycznie unikać mostka Floyd Rose oraz jak humbuckery chronią Cię przed irytującym szumem.",
      },
    ],
  },
  {
    title: "Rozdział 4: Architektura Codziennego Rytmu – Hakowanie nawyków",
    topics: [
      {
        title: "Syndrom „gitary w szafie”",
        body: "Wyjaśniam psychologiczne pojęcie tarcia (friction). Jeśli instrument leży schowany w pokrowcu głęboko w szafie, Twój mózg zawsze wybierze telefon. Postaw gitarę na widoku na stojaku, a nawyk zbuduje się sam.",
      },
      {
        title: "Reguła 10 minut vs. weekendowy maraton",
        body: "Dlaczego codzienne 10 minut każdego dnia da Ci o 300% lepsze rezultaty i mniej bólu niż 2 godziny katowania się w sobotę.",
      },
      {
        title: "Pętla 4 Perfekcyjnych Powtórzeń",
        body: "Koniec z popełnianiem błędu i zaczynaniem piosenki od początku. Pokazuję, jak izolować trudne przejścia i uczyć palce wyłącznie bezbłędnych ruchów.",
      },
      {
        title: "Zasada Parcia do Przodu (Keep Going)",
        body: "Jak nauczyć mózg płynięcia z muzyką i utrzymania stałego pulsu rytmicznego bez zatrzymywania się przy każdym potknięciu.",
      },
    ],
  },
  {
    title: "Rozdział 5: BHP Psychologiczne – Ochrona przed toksycznym środowiskiem",
    topics: [
      {
        title: "Ofiary „amnezji eksperckiej”",
        body: "Jak rozpoznać toksycznego nauczyciela (który zapomniał, jak to jest nie potrafić grać) i gotowy Arkusz Przesłuchania Mentora z 3 kluczowymi pytaniami przed pierwszą lekcją.",
      },
      {
        title: "Patent na Cichy Trening",
        body: "Mój ulubiony, darmowy trik ze złożoną skarpetką lub gąbką kuchenną pod strunami przy mostku, który wycisza gitarę o 80%, pozwalając Ci bezstresowo ćwiczyć o każdej porze, bez strachu przed sąsiadami czy oceną domowników.",
      },
      {
        title: "Ucieczka od samotności",
        body: "Jak zacząć od razu grać z darmowymi podkładami (Backing Tracks) z internetu, co zamienia nudne brzdąkanie w tworzenie muzyki w pełnym zespole.",
      },
    ],
  },
  {
    title: "Rozdział 6: Mit doskonałości i Test Sprawności Bojowej",
    topics: [
      {
        title: "Krzywa postępu i płaskowyż (plateau)",
        body: "Dlaczego nauka gry nie jest liniowa, regres to normalna neurobiologia i jak nie poddać się tuż przed kolejnym skokiem umiejętności.",
      },
      {
        title: "Koncepcja brakującego stopnia",
        body: "Jak mały, zlekceważony błąd (np. chwyt szafiarski czy zła pozycja kciuka) blokuje rozwój i jak go zdiagnozować.",
      },
      {
        title: "Szybki Test Sprawności Bojowej",
        body: "Trzyetapowy sprawdzian (w tym słynny Test Monety 5 zł na wysokość strun), który wykonasz w 3 minuty bez grania ani jednego dźwięku, by sprawdzić, czy Twój instrument nie próbuje Cię po cichu sabotować.",
      },
    ],
  },
];

/** Chapter titles for short lists / cards. */
export const FREE_GUIDE_POINTS = FREE_GUIDE_CHAPTERS.map((c) => c.title);

export const FREE_GUIDE_CLOSING: string[] = [
  "Nie obiecuję cudów w weekend. Ten e-book nie ćwiczy za Ciebie, ale daje Ci rzetelną, popartą biomechaniką wiedzę, dzięki której Twój start będzie miękki, bezpieczny dla dłoni i po prostu przyjemny.",
  "Zasługujesz na to, by usłyszeć czystą muzykę płynącą spod Twoich własnych palców.",
];

export const FREE_GUIDE_FORM_INTRO =
  "Zostaw e-mail — PDF trafi na skrzynkę, żeby mieć go zawsze pod ręką. Bez nachalnych maili.";

export const FREE_GUIDE_CTA_LABEL = "Chcę darmowy PDF";

/** Shown in place of download while FREE_GUIDE_OPEN is false. */
export const FREE_GUIDE_COMING_SOON_CTA = "Już wkrótce dostępny";

export const FREE_GUIDE_SUCCESS =
  "Dzięki. PDF wyślę na podany e-mail — warto zajrzeć też do spamu.";

export const FREE_GUIDE_VS_PAID =
  "Szukasz pełniejszego planu na pierwsze tygodnie gry (ok. 40 stron + wsparcie wideo)? W sklepie jest e-book";
