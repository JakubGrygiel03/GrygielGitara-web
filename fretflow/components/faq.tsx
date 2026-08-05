import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Czy muszę mieć własną gitarę na start?",
    a: "Najlepiej tak, żeby ćwiczyć w domu między lekcjami. Jeśli dopiero kupujesz instrument, pomogę w wyborze klasycznej lub akustycznej bez dodatkowej opłaty za doradztwo.",
  },
  {
    q: "Co jeśli będą mnie boleć palce?",
    a: "Lekki dyskomfort bywa naturalny na początku. Silny ból często wynika ze złej techniki albo twardej, źle wyregulowanej gitary. Ergonomia i podstawowy serwis mocno to ograniczają.",
  },
  {
    q: "Jak działa gwarancja pierwszej lekcji?",
    a: "Umówimy pierwszą lekcję próbną. Jeśli po niej uznasz, że nie ma chemii albo gitara to nie Twoja bajka, nie płacisz za te zajęcia.",
  },
  {
    q: "Jak wygląda pomoc w doborze gitary?",
    a: "Pomagam wybrać pierwszą gitarę klasyczną lub akustyczną pod dłonie, budżet i cele. Doradzam też przy strunach i podstawowej opiece nad instrumentem.",
  },
  {
    q: "Czy dojeżdżasz poza Gdańsk?",
    a: "Dojazd obejmuje teren Gdańska. Okolice omawiamy indywidualnie. Zawsze możesz też wybrać lekcję stacjonarną obok Galerii Forum albo online (80 zł) przez Telegram — nie zabiera rejestru dźwięku, a materiały pokazuję na tablecie.",
  },
] as const;

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-24">
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-12 sm:space-y-12 sm:px-6 sm:py-16 lg:py-20">
        <div className="max-w-2xl space-y-3 sm:space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-600 sm:text-sm sm:tracking-wider">
            FAQ
          </p>
          <h2 className="text-[1.375rem] font-bold leading-snug tracking-[-0.015em] text-slate-900 sm:text-3xl lg:text-4xl">
            Odpowiedzi zanim umówisz pierwszą lekcję
          </h2>
          <p className="text-[0.9375rem] leading-relaxed text-muted sm:text-base lg:text-lg">
            Najczęstsze obawy dotyczą bólu, braku talentu i ryzyka. Tu masz jasne
            odpowiedzi bez szkolnego nadęcia.
          </p>
        </div>

        <div className="max-w-3xl">
          <Accordion type="single" collapsible defaultValue="item-0">
            {faqs.map((item, index) => (
              <AccordionItem key={item.q} value={`item-${index}`}>
                <AccordionTrigger className="text-[0.9375rem] leading-snug sm:text-base">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm sm:text-base">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
