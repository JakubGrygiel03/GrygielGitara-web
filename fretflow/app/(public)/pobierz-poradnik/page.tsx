import type { Metadata } from "next";
import Link from "next/link";

import { LeadMagnetForm } from "@/components/lead-magnet-form";
import { Button } from "@/components/ui/button";
import { isFreeGuideOpen } from "@/lib/free-guide";
import {
  FREE_GUIDE_BLURB,
  FREE_GUIDE_COMING_SOON_CTA,
  FREE_GUIDE_POINTS,
  FREE_GUIDE_SHORT_TITLE,
  FREE_GUIDE_TITLE,
  FREE_GUIDE_VS_PAID,
} from "@/lib/free-guide-copy";

export const metadata: Metadata = {
  title: `${FREE_GUIDE_SHORT_TITLE} — darmowy PDF`,
  description: FREE_GUIDE_BLURB,
};

export default function PobierzPoradnikPage() {
  const open = isFreeGuideOpen();

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
      <div className="max-w-2xl space-y-5">
        <p className="text-base font-bold uppercase tracking-wide text-sky-600 sm:text-lg">
          100% za darmo
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
          {FREE_GUIDE_TITLE}
        </h1>
        <p className="text-base leading-[1.65] text-slate-700 sm:text-[1.0625rem] sm:leading-relaxed">
          {FREE_GUIDE_BLURB}
        </p>
        <ul className="space-y-2 text-base leading-[1.65] text-slate-700">
          {FREE_GUIDE_POINTS.map((point) => (
            <li key={point} className="flex gap-2">
              <span
                className="mt-2 size-1.5 shrink-0 rounded-full bg-sky-500"
                aria-hidden
              />
              <span>{point}</span>
            </li>
          ))}
        </ul>
        <p className="text-base leading-[1.65] text-slate-700">
          {FREE_GUIDE_VS_PAID}{" "}
          <Link
            href="/sklep/start-z-gitara-bez-stresu"
            className="font-medium text-sky-700 underline-offset-2 hover:underline"
          >
            Start z gitarą bez stresu
          </Link>
          .
        </p>
      </div>

      <div className="mt-8 max-w-md rounded-2xl border border-sky-200 bg-white px-5 py-6 sm:mt-10 sm:px-6">
        {open ? (
          <LeadMagnetForm />
        ) : (
          <div className="space-y-4">
            <p className="text-lg font-semibold text-slate-900">
              {FREE_GUIDE_COMING_SOON_CTA}
            </p>
            <p className="text-base leading-[1.65] text-slate-700">
              Przygotowuję plik PDF. Jak tylko będzie gotowy, pobierzesz go
              stąd — bez haczyków.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild>
                <Link href="/rezerwacja">Umów lekcję próbną</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/sklep">Zobacz e-booki</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
