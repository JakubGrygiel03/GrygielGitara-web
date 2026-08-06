import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "@/components/reveal";
import {
  SECTION_BAND_B,
  SECTION_BODY,
  SECTION_EYEBROW,
  SECTION_LEAD,
  SECTION_PAD,
  SECTION_TITLE,
} from "@/lib/section";
import { cn } from "@/lib/utils";

type FaqItem = {
  q: string;
  a: string;
};

const lessonFaqs: FaqItem[] = [
  {
    q: "Czy muszę mieć własną gitarę na start?",
    a: "Najlepiej tak, aby móc swobodnie ćwiczyć w domu między naszymi lekcjami. Jeśli jednak dopiero planujesz zakup, nie kupuj niczego w ciemno. W cenie zajęć pomogę Ci bezpłatnie wybrać odpowiedni instrument (klasyczny lub akustyczny). Dzięki mojemu wykształceniu technicznemu uchronię Cię przed zakupem gitary wadliwej lub zbyt twardej, na której gra byłaby męczarnią.",
  },
  {
    q: "Co jeśli będą mnie boleć palce?",
    a: "To najczęstszy powód, dla którego ludzie porzucają gitarę, ale u mnie ten problem niemal nie występuje. Po pierwsze, naukę zaczynamy od prostych, jednogłosowych melodii na tabulaturze, a nie od trudnych, wielopalcowych akordów. Dzięki temu Twoje palce bezboleśnie i stopniowo oswajają się z gryfem. Po drugie, od pierwszej lekcji dbamy o prawidłową ergonomię i rozluźnienie dłoni. Po trzecie, bezpłatnie wyreguluję wysokość strun w Twojej gitarze, aby grało się na niej maksymalnie lekko i przyjemnie.",
  },
  {
    q: "Jak działa gwarancja pierwszej lekcji?",
    a: "Bardzo prosto i kumpelsko: całe ryzyko startu biorę na siebie. Jeśli po naszych pierwszych zajęciach uznasz, że gitara to jednak nie Twój świat lub po prostu nie złapiemy wspólnego języka, nie płacisz za to spotkanie ani złotówki. Zależy mi wyłącznie na Twoim komforcie i autentycznej radości z muzyki.",
  },
  {
    q: "Czy na lekcjach muszę uczyć się nudnej teorii i czytania z nut?",
    a: "Absolutnie nie. Moje podejście opiera się na czystej praktyce i omijaniu suchej teorii na starcie. Pierwsze melodie zaczynamy grać już na samym początku Twojej drogi. Do teorii muzyki przechodzimy dopiero wtedy, gdy opanujesz już podstawy techniczne i sam poczujesz potrzebę jej poznania. Co ciekawe, ta teoria jest wspólna dla wszystkich instrumentów, więc jeśli w przyszłości zechcesz przesiąść się na pianino, nauka pójdzie Ci o połowę szybciej.",
  },
  {
    q: "Jak wyglądają lekcje online i czy są tak samo skuteczne?",
    a: "Lekcje online prowadzę z użyciem profesjonalnego zaplecza technicznego. Łączymy się za pośrednictwem aplikacji Telegram, ponieważ jako jedyna na rynku nie tłumi ona i nie zniekształca naturalnego rejestru brzmienia instrumentu. Podczas lekcji udostępniam na żywo ekran mojego tabletu, na którym na bieżąco widzisz nuty, tabulatury oraz moje wskazówki, co daje podobny komfort jak nauka przy jednej tablicy. Online nie zastąpi jednak w pełni zajęć twarzą w twarz: nie poprawię Ci fizycznie ułożenia ręki, mogę jedynie opisać i pokazać, jak to zrobić. Dlatego przy starcie od zera najczęściej polecam lekcje stacjonarne albo z dojazdem.",
  },
  {
    q: "Dlaczego warto wybrać naukę u Ciebie, a nie w tradycyjnej szkole muzycznej?",
    a: "Większość masowych szkół muzycznych działa według sztywnych, korporacyjnych szablonów i traktuje uczniów taśmowo. Ja buduję własną, autorską markę GrygielGitara, co oznacza moją pełną, osobistą odpowiedzialność za Twój progres. Łączę ponad 7 lat doświadczenia pedagogicznego z rzemieślniczym wykształceniem Technikum Budowy i Strojenia Fortepianów oraz aktywną praktyką estradową na prestiżowych scenach (koncertuję m.in. z zespołem The Medievals). Dodatkowo moi stali uczniowie otrzymują podstawowy serwis i regulację gitary w cenie lekcji, a także stałe wsparcie telefoniczne między zajęciami.",
  },
  {
    q: "Co jeśli po powrocie do domu zapomnę, jak zagrać ćwiczenie z lekcji?",
    a: "U mnie ten problem nie istnieje, ponieważ nie zostajesz sam z materiałem między zajęciami. Po każdej lekcji przygotowuję dla Ciebie dedykowany, krótki materiał wideo. Gdy ćwiczysz w domu i masz wątpliwość, po prostu włączasz filmik i od razu widzisz, jak prawidłowo ułożyć dłonie. Dodatkowo, jeśli napotkasz trudność, jesteśmy w stałym kontakcie telefonicznym – możesz śmiało napisać do mnie w ciągu tygodnia.",
  },
  {
    q: "Czy nie jestem za stary na naukę gry od zera?",
    a: "Na naukę gry na instrumencie nigdy nie jest za późno. Moje ponad 7-letnie doświadczenie obejmuje pracę zarówno z dziećmi, jak i z osobami dorosłymi, które po raz pierwszy w życiu wzięły gitarę do rąk. Dostosowuję tempo pracy w pełni pod Twoje możliwości i codzienne obowiązki, bez szkolnej presji i niepotrzebnego oceniania.",
  },
  {
    q: "Czy muszę mieć „talent” lub idealny słuch muzyczny, żeby zacząć?",
    a: "Absolutnie nie. Słuch muzyczny to nie jest wrodzony, mistyczny dar, ale umiejętność (jak mięsień), którą wspólnie rozwijamy od pierwszych zajęć. Moja autorska metoda sprawia, że Twój słuch muzyczny rozwija się naturalnie podczas grania prostych melodii, co szybko daje Ci swobodę i ułatwia samodzielne łapanie ulubionych piosenek w przyszłości.",
  },
  {
    q: "Chcę zagrać moją ulubioną piosenkę, ale słyszałem, że jest za trudna. Co wtedy?",
    a: "Dla mnie nie ma zbyt trudnych utworów. Moje podejście zakłada, że każdy, nawet najbardziej skomplikowany numer, można odpowiednio uprościć i dostosować do Twoich aktualnych umiejętności. Zaczniemy od jego podstawowej, łatwej wersji, a wraz z Twoim postępem będziemy dodawać kolejne elementy. Dodatkowo nauczę Cię, jak samodzielnie szukać materiałów w sieci i rozpisywać piosenki na własne tabulatury.",
  },
  {
    q: "Mam w domu starą gitarę, ale ciężko się na niej gra. Czy muszę kupić nową?",
    a: "Zanim wydasz pieniądze na nowy instrument, przynieś go na nasze pierwsze zajęcia. Bardzo często powodem ciężkiej gry nie jest zła gitara, ale zbyt wysoka akcja strun lub stare, twarde struny. Jako technik rzemieślnik bezpłatnie pomogę Ci zakonserwować instrument, wyczyszczę podstrunnicę i pomogę przy wymianie strun na miękkie. Dobrze ustawiony instrument sprawi, że progres przyjdzie znacznie szybciej.",
  },
  {
    q: "Dlaczego do teorii muzyki przechodzimy dopiero w drugim etapie?",
    a: "Uważam, że wrzucanie skomplikowanej teorii na pierwszej lekcji to największy błąd, który zabija radość z muzyki. Najpierw uczysz się fizycznej obsługi instrumentu, czystego wydobywania dźwięków i czerpania z tego frajdy. Do teorii przechodzimy bezstresowo dopiero wtedy, gdy sam poczujesz potrzebę zrozumienia zasad rządzących muzyką. Co ważne, wiedza ta będzie dla Ciebie uniwersalnym fundamentem, jeśli w przyszłości zechcesz nauczyć się grać na pianinie czy innym instrumencie.",
  },
];

const platformFaqs: FaqItem[] = [
  {
    q: "Czym różni się darmowy PDF od płatnego e-booka?",
    a: "Darmowy PDF „Gitarowy Falstart” to krótki tekst o tym, dlaczego start od akordów boli i jak zacząć od prostych melodii. E-book „Start z gitarą bez stresu” (49 zł) to pełniejszy plan na pierwsze tygodnie — ok. 40 stron i wsparcie wideo.",
  },
  {
    q: "Jak założyć konto i gdzie je znajdę?",
    a: "W górnym menu kliknij „Konto” (na telefonie: „Konto — zaloguj / załóż”). Na ekranie „Zaloguj się” wybierz „Załóż konto”, wpisz imię i nazwisko, e-mail oraz hasło (min. 8 znaków) i zatwierdź przyciskiem „Załóż konto”. Po zalogowaniu wchodzisz do panelu „Moje konto”, gdzie masz m.in. sekcję „Zakupy”, a jeśli uczysz się u mnie — także lekcje i materiały.",
  },
  {
    q: "Zapomniałem hasła. Co robić?",
    a: "Kliknij „Konto”, na ekranie „Zaloguj się” wybierz link „Zresetuj hasło”. Otworzy się strona „Zapomniałem hasła” — wpisz e-mail i kliknij „Wyślij link do resetu”. Szukaj maila od GrygielGitara (kontakt@grygielgitara.pl) także w spam / powiadomieniach, kliknij link i ustaw nowe hasło. Jak nic nie przychodzi, napisz przez „Kontakt” — pomogę odzyskać dostęp.",
  },
  {
    q: "Po rejestracji mam potwierdzić e-mail — skąd przyjdzie wiadomość?",
    a: "Po „Załóż konto” możesz dostać mail z linkiem aktywacyjnym. Nadawca to GrygielGitara (kontakt@grygielgitara.pl). To bezpieczny link — kliknij go, potem wróć i zaloguj się przez „Konto”. Sprawdź skrzynkę odbiorczą, kartę powiadomień w aplikacji poczty oraz spam / oferty. Bez kliknięcia linku logowanie czasem nie zadziała.",
  },
  {
    q: "Czy muszę mieć konto, żeby kupić materiał w sklepie?",
    a: "Tak. Przed płatnością sklep poprosi o logowanie (np. „Zaloguj się i kup”). Zakładając konto albo logując się przez „Konto”, wiążesz zakup z panelem „Moje konto”, żeby potem pobrać PDF w sekcji „Zakupy”.",
  },
  {
    q: "Gdzie znajdę kupiony e-book po płatności?",
    a: "Po udanym zakupie dostajesz e-mail z potwierdzeniem (często z PDF w załączniku). Na stronie: kliknij „Konto”, zaloguj się tym samym e-mailem co przy zakupie i w panelu „Moje konto” wejdź w sekcję „Zakupy” — stamtąd pobierasz PDF w każdej chwili.",
  },
  {
    q: "Zapłaciłem, a nie widzę materiału. Co sprawdzić?",
    a: "Zaloguj się przez „Konto” na ten sam e-mail, którym płaciłeś, i odśwież panel „Moje konto” → „Zakupy”. Sprawdź też skrzynkę (w tym spam). Jeśli nadal pusto, napisz przez „Kontakt” i wybierz temat „Materiały cyfrowe / lista oczekujących” — podaj e-mail z zakupu, a odblokuję dostęp ręcznie.",
  },
  {
    q: "Jakie formy płatności są w sklepie?",
    a: "Płatność idzie przez bezpieczną bramkę Stripe (karta i inne metody dostępne w Polsce). Po opłaceniu materiał pojawia się automatycznie w „Moje konto” → „Zakupy”.",
  },
  {
    q: "Czy mogę zwrócić kupiony e-book?",
    a: "Po dostarczeniu PDF nie masz ustawowego zwrotu „bez podania przyczyny”. Przed płatnością zaznaczasz osobny checkbox — że chcesz dostać treść cyfrową od razu i przyjmujesz do wiadomości utratę prawa odstąpienia — oraz osobno akceptujesz Regulamin sklepu. To samo potwierdzenie dostajesz w mailu po zakupie. Przy wadzie pliku (np. uszkodzony PDF, brak dostępu) nadal możesz zgłosić reklamację przez „Kontakt” (temat „Materiały cyfrowe / lista oczekujących”).",
  },
  {
    q: "Czy mogę udostępnić kupiony materiał innej osobie?",
    a: "Materiały są na Twoje konto i do Twojego użytku osobistego. Nie udostępniaj pliku ani logowania osobom trzecim. Jeśli ktoś bliski też chce się uczyć, niech kupi własny egzemplarz albo umówi lekcję — wtedy też dostaje uczciwe wsparcie.",
  },
  {
    q: "Czy muszę brać lekcje, żeby korzystać ze sklepu?",
    a: "Nie. Sklep jest dostępny także bez lekcji — wystarczy konto przez „Konto” i zakup w „Sklep”. Lekcje i e-booki się uzupełniają, ale nie musisz łączyć jednego z drugim.",
  },
];

const faqGroups = [
  {
    id: "lekcje",
    title: "Nauka gry i lekcje",
    description:
      "Gitara, ergonomia, metoda, gwarancja pierwszej lekcji i to, jak wygląda współpraca.",
    items: lessonFaqs,
    defaultOpen: true,
  },
  {
    id: "platforma",
    title: "Konto, sklep i strona",
    description:
      "Rejestracja, hasło, zakupy e-booków, płatności i gdzie znaleźć kupione materiały.",
    items: platformFaqs,
    defaultOpen: false,
  },
] as const;

function FaqGroup({
  id,
  title,
  description,
  items,
  defaultOpen,
  delay,
}: {
  id: string;
  title: string;
  description: string;
  items: readonly FaqItem[];
  defaultOpen: boolean;
  delay: number;
}) {
  return (
    <Reveal variant="fade" delay={delay} className="max-w-3xl space-y-3">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-slate-900 sm:text-xl">
          {title}
        </h3>
        <p className={SECTION_BODY}>{description}</p>
      </div>
      <Accordion
        type="single"
        collapsible
        defaultValue={defaultOpen ? `${id}-0` : undefined}
      >
        {items.map((item, index) => (
          <AccordionItem key={item.q} value={`${id}-${index}`}>
            <AccordionTrigger className="text-base leading-snug text-slate-900 sm:text-[1.0625rem]">
              {item.q}
            </AccordionTrigger>
            <AccordionContent>{item.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Reveal>
  );
}

export function Faq() {
  return (
    <section id="faq" className={SECTION_BAND_B}>
      <div className={cn("mx-auto max-w-6xl space-y-6 sm:space-y-8", SECTION_PAD)}>
        <Reveal variant="fade" className="max-w-2xl space-y-3 sm:space-y-4">
          <p className={SECTION_EYEBROW}>FAQ</p>
          <h2 className={SECTION_TITLE}>
            Odpowiedzi zanim umówisz pierwszą lekcję
          </h2>
          <p className={SECTION_LEAD}>
            Pytania podzieliłem na dwie grupy: naukę gry oraz obsługę konta,
            sklepu i strony.
          </p>
        </Reveal>

        <div className="space-y-8 sm:space-y-10">
          {faqGroups.map((group, index) => (
            <FaqGroup
              key={group.id}
              id={group.id}
              title={group.title}
              description={group.description}
              items={group.items}
              defaultOpen={group.defaultOpen}
              delay={80 + index * 60}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
