import Image from "next/image";
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

const VIDEO_ID = "nIUcs-GJ-5E";
const VIDEO_URL = `https://www.youtube.com/watch?v=${VIDEO_ID}`;

/**
 * Social proof: concerts + band video in one compact block.
 */
export function ForumMusicumBand() {
  return (
    <section
      id="ciekawostka"
      aria-label="Ciekawostka koncertowa"
      className={SECTION_BAND_B}
    >
      <div className={cn("mx-auto max-w-6xl space-y-6", SECTION_PAD)}>
        <Reveal variant="up" className="max-w-2xl space-y-3 sm:space-y-4">
          <p className={SECTION_EYEBROW}>Ze sceny</p>
          <h2 className={SECTION_TITLE}>
            Nie uczysz się od kogoś, kto zna gitarę tylko z podręcznika
          </h2>
          <p className={SECTION_LEAD}>
            Jestem w składzie The Medievals. Gramy muzykę dawną — w pałacach,
            zamkach, muzeach i na salach takich jak Narodowe Forum Muzyki.
          </p>
          <div className="space-y-1 border-t border-sky-300 pt-3 sm:pt-4">
            <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
              To samo na lekcjach
            </h3>
            <p className={SECTION_BODY}>
              Dostajesz to, czego używam sam: spokojną technikę, słuch i radość
              z grania — bez szkolnego stresu i bez „odhaczonej” teorii.
            </p>
          </div>
        </Reveal>

        <div className="grid items-stretch gap-4 md:grid-cols-2 md:gap-5">
          <Reveal variant="up" delay={40}>
            <figure className="space-y-2">
              <div className="relative aspect-video overflow-hidden rounded-2xl bg-sky-50">
                <Image
                  src="/images/forum-musicum.png"
                  alt="The Medievals — Forum Musicum, Narodowe Forum Muzyki"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-[center_30%]"
                />
              </div>
              <figcaption className={SECTION_CAPTION}>
                Z zespołem na Forum Musicum · NFM
              </figcaption>
            </figure>
          </Reveal>

          <Reveal variant="up" delay={100}>
            <figure className="space-y-2">
              <div className="relative aspect-video overflow-hidden rounded-2xl bg-slate-900">
                <iframe
                  title="The Medievals — Aj vis lo lop"
                  src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}`}
                  className="absolute inset-0 h-full w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
              <figcaption className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-sm leading-relaxed text-slate-600">
                <span>Teledysk „Aj vis lo lop”</span>
                <Link
                  href={VIDEO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-sky-700 underline-offset-2 hover:underline"
                >
                  Obejrzyj na YouTube
                </Link>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
