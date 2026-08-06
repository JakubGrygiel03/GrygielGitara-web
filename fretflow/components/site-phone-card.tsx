import { Phone } from "lucide-react";

import {
  SITE_PHONE_DISPLAY,
  SITE_PHONE_HREF,
} from "@/lib/site-contact";

type SitePhoneCardProps = {
  hint?: string;
};

export function SitePhoneCard({
  hint = "Kliknij, żeby zadzwonić",
}: SitePhoneCardProps) {
  return (
    <a
      href={SITE_PHONE_HREF}
      className="flex items-center gap-3 rounded-2xl border-2 border-sky-300 bg-white px-4 py-4 transition-colors hover:border-sky-400 hover:bg-sky-50/80 sm:px-5"
    >
      <Phone className="size-5 shrink-0 text-sky-600" aria-hidden />
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-sky-600">
          Telefon
        </p>
        <p className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
          {SITE_PHONE_DISPLAY}
        </p>
        <p className="text-sm leading-relaxed text-slate-700">{hint}</p>
      </div>
    </a>
  );
}
