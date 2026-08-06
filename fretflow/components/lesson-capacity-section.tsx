import { CalendarClock } from "lucide-react";

import { Reveal } from "@/components/reveal";
import {
  SECTION_BODY,
  SECTION_EYEBROW,
  SECTION_LEAD,
  SECTION_TITLE,
} from "@/lib/section";

/**
 * Honest capacity: concerts + smaller roster — no waitlist form.
 * Own band (sky-50) so it doesn’t blend with Materials (surface) above.
 */
export function LessonCapacitySection() {
  return (
    <section
      id="miejsca"
      className="scroll-mt-24 border-t border-sky-200 bg-sky-50"
    >
      <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-8 lg:py-9">
        <Reveal
          variant="up"
          className="grid max-w-4xl gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start lg:gap-10"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <CalendarClock
                className="size-6 shrink-0 text-sky-600 sm:size-7"
                aria-hidden
              />
              <p className={SECTION_EYEBROW}>Czas i miejsca</p>
            </div>
            <h2 className={SECTION_TITLE}>
              Dlaczego liczba miejsc na naukę jest ograniczona?
            </h2>
          </div>
          <div className="space-y-3">
            <p className={SECTION_LEAD}>
              Muzyka dużo wnosi do mojego życia — poza nauczaniem jestem
              aktywnym muzykiem koncertowym. Próby, podróże i występy z zespołem
              The Medievals (zamki, muzea, sale takie jak Narodowe Forum Muzyki)
              sprawiają, że mój czas jest fizycznie ograniczony.
            </p>
            <p className={SECTION_BODY}>
              Świadomie odrzucam masowe podejście szkół sieciowych. Wolę
              pracować z mniejszą liczbą osób, ale dać każdemu uczniowi pełne
              zaangażowanie, rzemieślniczą opiekę nad instrumentem i materiały na
              wysokim poziomie.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
