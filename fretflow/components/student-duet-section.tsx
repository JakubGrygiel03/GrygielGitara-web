import Link from "next/link";

import { Reveal } from "@/components/reveal";
import {
  SECTION_BAND_B,
  SECTION_BODY,
  SECTION_CAPTION,
  SECTION_EYEBROW,
  SECTION_LEAD,
  SECTION_PAD,
  SECTION_TITLE,
} from "@/lib/section";
import { cn } from "@/lib/utils";

const VIDEO_ID = "GEOy1_ATFuc";
const VIDEO_URL = `https://www.youtube.com/watch?v=${VIDEO_ID}`;

/**
 * Method result: teacher–student duet (social proof of partnership).
 */
export function StudentDuetSection() {
  return (
    <section
      id="rezultat"
      aria-label="Rezultat lekcji — duet z uczennicą"
      className={SECTION_BAND_B}
    >
      <div className={cn("mx-auto max-w-6xl", SECTION_PAD)}>
        <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
          <Reveal variant="up" className="space-y-3 sm:space-y-4">
            <p className={SECTION_EYEBROW}>Rezultat</p>
            <h2 className={SECTION_TITLE}>
              Uczeń i nauczyciel w jednym zespole
            </h2>
            <p className={SECTION_LEAD}>
              Duet z Martą — „Canzonetta antica”. Marta prowadzi partię pierwszej
              gitary ze skupieniem, które nie bierze się ze szkolnej presji, tylko
              z satysfakcji i kontroli nad instrumentem.
            </p>
            <div className="space-y-1 border-t border-sky-300 pt-3 sm:pt-4">
              <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
                Partnerstwo na lekcjach
              </h3>
              <p className={SECTION_BODY}>
                Dbam o Twoją technikę po to, żebyś z czasem poczuł taką samą
                wolność i dumę, gdy wspólnie zagramy w duecie Twoje pierwsze
                pełne utwory.
              </p>
            </div>
          </Reveal>

          <Reveal variant="up" delay={80}>
            <figure className="space-y-2">
              <div className="relative aspect-video overflow-hidden rounded-2xl bg-slate-900 shadow-[0_12px_40px_-16px_rgba(15,23,42,0.45)]">
                <iframe
                  title="Duet z Martą — Canzonetta antica"
                  src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}`}
                  className="absolute inset-0 h-full w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
              <figcaption
                className={cn(
                  "flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1",
                  SECTION_CAPTION,
                )}
              >
                <span>Canzonetta antica · duet z Martą</span>
                <Link
                  href={VIDEO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-sky-700 underline-offset-2 hover:underline"
                >
                  Otwórz na YouTube
                </Link>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
