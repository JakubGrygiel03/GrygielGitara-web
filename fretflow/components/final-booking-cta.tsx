import Link from "next/link";

import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import {
  SECTION_EYEBROW,
  SECTION_LEAD,
  SECTION_PAD,
  SECTION_TITLE,
} from "@/lib/section";
import { cn } from "@/lib/utils";

/** Final homepage CTA → reservation form (step 10 of page flow). */
export function FinalBookingCta() {
  return (
    <section
      id="rezerwacja-cta"
      className="scroll-mt-24 border-t border-sky-200 bg-sky-50"
    >
      <div className={cn("mx-auto max-w-6xl", SECTION_PAD)}>
        <Reveal
          variant="up"
          className="mx-auto flex max-w-xl flex-col items-center space-y-4 text-center"
        >
          <p className={SECTION_EYEBROW}>Następny krok</p>
          <h2 className={SECTION_TITLE}>Umów lekcję próbną</h2>
          <p className={SECTION_LEAD}>
            Wypełnij krótki formularz — wybierzesz wariant ceny i miejsce.
            Pierwsza lekcja z gwarancją: jeśli nie złapiemy wspólnego języka, nie
            płacisz za te zajęcia.
          </p>
          <div className="flex w-full flex-col items-center gap-3 sm:w-auto">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/rezerwacja">Przejdź do rezerwacji</Link>
            </Button>
            <Link
              href="/#materialy"
              className="text-sm font-medium text-sky-700 underline-offset-4 transition hover:text-sky-800 hover:underline"
            >
              Albo zajrzyj, jakie materiały mogę Ci zaproponować
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
