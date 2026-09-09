/**
 * Free PDF gift — Gitarowy Reset (canonical offer under /sklep/gitarowy-reset).
 */

export const FREE_GUIDE_SHORT_TITLE = "Gitarowy Reset";

export const FREE_GUIDE_TITLE =
  "Gitarowy Reset — jak zacząć grać bez bólu dłoni, frustracji i rzucania instrumentu w kąt";

export const FREE_GUIDE_PAGE_COUNT = 101;
export const FREE_GUIDE_FILE_SIZE = "ok. 37 MB";

/** Short blurb for cards / meta. */
export const FREE_GUIDE_BLURB =
  "Praktyczny, darmowy PDF: jak ominąć „ścianę akordów”, odciążyć dłonie i zacząć grać z satysfakcją od pierwszych minut — bez nudnej teorii.";

export const FREE_GUIDE_INTRO: string[] = [
  "Statystyki są brutalne: aż 90% osób, które kupują swoją pierwszą gitarę, porzuca marzenia o graniu w ciągu pierwszego roku, najczęściej już po pierwszych trzech miesiącach. Patrzysz potem na instrument stojący w kącie pokoju, na którym powoli osiada kurz, i wmawiasz sobie brak talentu, za grube palce czy brak słuchu.",
  "Prawda jest jednak zupełnie inna. Najczęściej po prostu zderzasz się ze „ścianą akordów” (na czele z bolesnym chwytem F-dur) albo Twoja gitara jest tak twarda, że walka z nią fizycznie rani dłonie i wywołuje ból.",
  "Mój e-book „Gitarowy Reset” (101 stron) to nie kolejna książka z nudną teorią. To praktyczny, rzemieślniczy przewodnik oparty na fizjologii dłoni i biomechanice. Pokazuję w nim, jak oszukać układ nerwowy, ułatwić sobie grę i czerpać z niej czystą satysfakcję od pierwszych minut.",
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
    title: "Wstęp: Jak przełamać trudny start?",
    topics: [
      {
        title: "Dlaczego 90% początkujących porzuca gitarę?",
        body: "Nie chodzi o brak talentu. Pokazuję, co naprawdę odcina zapał w pierwszych tygodniach — i jak nie wylądować w tej statystyce.",
      },
      {
        title: "Najczęstsze błędy uczniów i wady tradycyjnej metodyki",
        body: "Dlaczego „najpierw wszystkie chwyty, potem frajda” tak często kończy się gitarą w kącie.",
      },
      {
        title: "Jak określić swój cel i utrzymać motywację do ćwiczeń?",
        body: "Prosty sposób, by wiedzieć po co ćwiczysz i nie gasić się po pierwszym trudniejszym dniu.",
      },
      {
        title: "Struktura poradnika — jak z niego efektywnie korzystać?",
        body: "Kolejność kroków, żeby nie skakać po książce na oślep i od razu czuć postęp.",
      },
    ],
  },
  {
    title: "Rozdział 1: Dlaczego tradycyjna nauka akordów zniechęca na starcie?",
    topics: [
      {
        title: "Pułapka trudnych chwytów — dlaczego nie warto zaczynać od akordów?",
        body: "Ściana F-dur i innych „pełnych” chwytów na starcie to najszybsza droga do bolących palców i rezygnacji.",
      },
      {
        title: "Stara szkoła kontra sprytne podejście",
        body: "Co zostawić z tradycyjnej metodyki, a co odłożyć, dopóki dźwięk i frajda nie wejdą w krew.",
      },
      {
        title: "Twój nowy model nauki",
        body: "Jak uczyć się tak, żeby mózg dostawał nagrodę dźwiękową od pierwszych minut, a nie po miesiącach walki.",
      },
      {
        title: "Krok 1: Dopaminowy Hak — pojedyncze dźwięki (Single-Note)",
        body: "Zapomnij na start o skomplikowanych chwytach. Pokazuję, jak za pomocą tylko jednego palca i jednej struny zagrać kultowy, rozpoznawalny motyw (np. Smoke on the Water) w pierwsze 60 sekund.",
      },
      {
        title: "Krok 2: Dźwięki podstawowe (Root Notes) i granie z utworami",
        body: "Prosty sposób, by zacząć grać do ulubionych utworów ze Spotify czy YouTube, używając pojedynczych dźwięków basowych na strunach E i A.",
      },
    ],
  },
  {
    title: "Rozdział 2: Ulga dla dłoni — jak grać lekko i bez bólu?",
    topics: [
      {
        title: "Dlaczego gitara stawia opór i męczy Twoje ręce?",
        body: "Skąd bierze się ból, spięcie przedramienia i „wściekły uścisk” — zanim obwinisz swoje palce.",
      },
      {
        title: "Pigułka 1: Test 5% Siły (minimalny docisk strun)",
        body: "Proste ćwiczenie, które pokazuje, jak lekko dociskać strunę, by dźwięk był czysty. Koniec z kurczowym Death Grip, który rani palce i kark.",
      },
      {
        title: "Pigułka 2: Szybka rozgrzewka dłoni (Gitarowa termoterapia)",
        body: "Fizjoterapeutyczny trik z ciepłą wodą przed grą, który uelastycznia mięśnie i chroni przed mikrourazami.",
      },
      {
        title: "Pigułka 3: Wygodna postawa i swobodny oddech",
        body: "Jak usiąść, trzymać instrument i oddychać, żeby dłonie nie walczyły z całym ciałem.",
      },
      {
        title: "Pigułka 4: Co zrobić, gdy palce „uciekają” od gryfu?",
        body: "Jak oduczyć się obsesyjnego wpatrywania w gryf i trzymać nieużywane palce tuż nad strunami — szybciej, luźniej, bez spinania karku.",
      },
    ],
  },
  {
    title: "Rozdział 3: Wybór i ocena sprzętu — jak uniknąć wad fabrycznych?",
    topics: [
      {
        title: "Gitara klasyczna i pułapka szerokiego gryfu",
        body: "Dlaczego szeroki gryf (często ok. 52 mm) i nylon to dla wielu dłoni katorga na start, a nie ułatwienie.",
      },
      {
        title: "Gitara akustyczna i pułapka twardych strun",
        body: "Zbyt twarde struny i wysoka akcja (często 5–6 mm) celowo utrudniają naukę — zanim stwierdzisz, że „nie masz predyspozycji”.",
      },
      {
        title: "Gitara elektryczna i pułapka złych wydatków",
        body: "Jak nie przepalić budżetu na samo wiosło (podział 60/40 ze wzmacniaczem), dlaczego na start unikać Floyd Rose i jak humbuckery chronią przed szumem.",
      },
      {
        title: "Jak uratować każdy instrument? (regulacja u lutnika)",
        body: "Kilkadziesiąt złotych za ustawienie akcji i strun potrafi odzyskać zapał szybciej niż nowa gitara.",
      },
    ],
  },
  {
    title: "Rozdział 4: Organizacja treningu — jak ćwiczyć regularnie i widzieć postępy?",
    topics: [
      {
        title: "Syndrom „gitary w szafie”",
        body: "Jeśli instrument leży w pokrowcu głęboko w szafie, mózg zawsze wybierze telefon. Postaw gitarę na widoku — nawyk zbuduje się sam.",
      },
      {
        title: "Reguła 10 minut zamiast męczących maratonów",
        body: "Codzienne 10 minut da Ci znacznie lepsze rezultaty i mniej bólu niż dwie godziny katowania się w sobotę.",
      },
      {
        title: "Pułapka wiecznego zaczynania od zera (Pętla Frustracji)",
        body: "Koniec z błędem i odpalaniem piosenki od nowa. Izolujesz trudne przejścia i uczysz palce wyłącznie bezbłędnych ruchów.",
      },
      {
        title: "Jak rozpracować trudne fragmenty i nie tracić płynności",
        body: "Jak utrzymać puls i płynąć z muzyką, zamiast zatrzymywać się przy każdym potknięciu.",
      },
    ],
  },
  {
    title: "Rozdział 5: BHP psychologiczne — ochrona zapału przed otoczeniem",
    topics: [
      {
        title: "Zły nauczyciel — kto zapomniał, jak to jest być początkującym",
        body: "Jak rozpoznać toksycznego mentora z „amnezją ekspercką”, zanim odbierze Ci radość z gry.",
      },
      {
        title: "Prosty test na sprawdzenie mentora",
        body: "Gotowe pytania przed pierwszą lekcją — żebyś wiedział, czy ktoś umie prowadzić początkującego.",
      },
      {
        title: "Patenty na cichy trening w mieszkaniu",
        body: "Darmowy trik ze skarpetką lub gąbką pod strunami przy mostku: gitara ciszej o ok. 80%, bez strachu przed sąsiadami.",
      },
      {
        title: "Jak przełamać wstyd przed graniem przy innych",
        body: "Od sypialnianej samotności do grania z podkładami — tak, żeby ćwiczenie znów było muzyką, nie ukrywaniem się.",
      },
    ],
  },
  {
    title: "Rozdział 6: Zastój w nauce — dlaczego nagle idzie gorzej i jak to przetrwać?",
    topics: [
      {
        title: "Zderzenie ze ścianą (plateau) i jak je pokonać",
        body: "Nauka nie jest liniowa. Regres to normalna neurobiologia — pokazuję, jak nie poddać się tuż przed kolejnym skokiem.",
      },
      {
        title: "Co się dzieje z palcami po przerwie? („Rdzewienie palców”)",
        body: "Dlaczego po urlopie wszystko „siada” i jak wrócić bez paniki i bez katowania dłoni.",
      },
      {
        title: "Jak samemu wyłapać ukryte błędy (Brakujący Stopień)",
        body: "Mały, zlekceważony nawyk (chwyt szafiarski, zła pozycja kciuka) potrafi zablokować rozwój — tu jest, jak go znaleźć.",
      },
    ],
  },
  {
    title: "Zakończenie: Co dalej?",
    topics: [
      {
        title: "Szybki test sprawności Twojej gitary",
        body: "Trzyetapowy sprawdzian (w tym Test Monety 5 zł na wysokość strun) w kilka minut, bez grania ani jednego dźwięku.",
      },
      {
        title: "Jak mądrze uczyć się z filmów w internecie?",
        body: "Żeby YouTube pomagał, a nie dokładał chaosu i złych nawyków.",
      },
      {
        title: "Dlaczego te metody działają?",
        body: "Krótko: praktyka pedagogiczna i biomechanika, nie motywacyjne hasła.",
      },
      {
        title: "Plan na kolejne tygodnie (7-dniowa checklista)",
        body: "Konkretne „co robić jutro”, żeby reset nie skończył się na samym przeczytaniu PDF.",
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

export const FREE_GUIDE_FORM_INTRO = [
  "Podaj swój e-mail, aby od razu pobrać e-book (101 stron).",
  "Po wysłaniu formularza plik zacznie się pobierać automatycznie, a kopię wyślę też na Twoją skrzynkę. Z wiadomości możesz zrezygnować w każdej chwili jednym kliknięciem.",
] as const;

export const FREE_GUIDE_CTA_LABEL = "Pobierz darmowy e-book";

export const FREE_GUIDE_DOWNLOAD_LABEL = `Pobierz PDF (${FREE_GUIDE_PAGE_COUNT} stron, ${FREE_GUIDE_FILE_SIZE})`;

/** Shown in place of download while FREE_GUIDE_OPEN is false. */
export const FREE_GUIDE_COMING_SOON_CTA = "Już wkrótce dostępny";

export const FREE_GUIDE_SUCCESS =
  "Pobieranie powinno zacząć się od razu. Jeśli nic się nie dzieje — użyj przycisku poniżej. Kopia jest też na skrzynce (sprawdź spam).";

export const FREE_GUIDE_VS_PAID =
  "Szukasz pełniejszego planu na pierwsze tygodnie gry (ok. 40 stron + wsparcie wideo)? W sklepie jest e-book";
