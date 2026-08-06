import { BookMarked } from "lucide-react";

import { cn } from "@/lib/utils";

type CoverTheme = {
  stage: string;
  cover: string;
  accent: string;
  muted: string;
};

const THEMES: Record<string, CoverTheme> = {
  "start-z-gitara-bez-stresu": {
    stage: "from-sky-800 via-sky-900 to-slate-950",
    cover: "from-sky-500 via-sky-600 to-slate-900",
    accent: "text-sky-100",
    muted: "text-sky-200/85",
  },
  "setup-gitary-w-domu": {
    stage: "from-emerald-800 via-teal-900 to-slate-950",
    cover: "from-emerald-500 via-teal-700 to-slate-900",
    accent: "text-emerald-100",
    muted: "text-emerald-100/85",
  },
  "rytm-i-timing-na-start": {
    stage: "from-indigo-900 via-slate-900 to-slate-950",
    cover: "from-sky-600 via-indigo-800 to-slate-950",
    accent: "text-sky-100",
    muted: "text-slate-200/85",
  },
};

const DEFAULT_THEME: CoverTheme = {
  stage: "from-slate-700 via-slate-800 to-slate-950",
  cover: "from-slate-500 via-slate-700 to-slate-950",
  accent: "text-slate-100",
  muted: "text-slate-200/85",
};

function splitTitle(title: string): [string, string?] {
  const parts = title.trim().split(/\s+/);
  if (parts.length <= 2) return [title];
  const mid = Math.ceil(parts.length / 2);
  return [parts.slice(0, mid).join(" "), parts.slice(mid).join(" ")];
}

type ShopEbookCoverProps = {
  slug: string;
  title: string;
  badge?: string;
  className?: string;
  /** Larger stage for product detail page */
  size?: "card" | "detail";
};

export function ShopEbookCover({
  slug,
  title,
  badge = "E-book",
  className,
  size = "card",
}: ShopEbookCoverProps) {
  const theme = THEMES[slug] ?? DEFAULT_THEME;
  const [line1, line2] = splitTitle(title);
  const isDetail = size === "detail";

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden border-b border-slate-800 bg-gradient-to-b",
        theme.stage,
        isDetail
          ? "aspect-[5/4] rounded-2xl border px-8 py-10 shadow-[0_1px_0_rgba(15,23,42,0.04),0_12px_32px_-16px_rgba(14,165,233,0.35)]"
          : "aspect-[5/4] px-6 py-7 sm:px-8 sm:py-8",
        className,
      )}
      role="img"
      aria-label={`Okładka e-booka ${title}`}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 opacity-40",
          "bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.16),transparent_55%)]",
        )}
      />

      <div
        className={cn(
          "relative flex aspect-[3/4] flex-col justify-between overflow-hidden rounded-sm shadow-[0_18px_40px_-10px_rgba(0,0,0,0.65)] ring-1 ring-white/25 transition-transform duration-300 ease-out group-hover:rotate-0 group-hover:scale-[1.03]",
          "w-[42%] max-w-[7.5rem] rotate-[-2deg] bg-gradient-to-br sm:max-w-[8.25rem]",
          isDetail && "w-[48%] max-w-[11rem]",
          theme.cover,
        )}
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.14)_0%,transparent_42%)]" />
        <div className="relative flex flex-1 flex-col px-2.5 pb-2.5 pt-3 sm:px-3 sm:pt-3.5">
          <p
            className={cn(
              "text-[0.55rem] font-bold uppercase tracking-[0.14em] sm:text-[0.6rem]",
              theme.muted,
            )}
          >
            {badge}
          </p>
          <div className="mt-2 space-y-0.5">
            <p
              className={cn(
                "font-serif text-[0.7rem] font-bold leading-tight tracking-tight text-white sm:text-[0.8rem]",
                isDetail && "sm:text-[0.95rem]",
              )}
            >
              {line1}
            </p>
            {line2 ? (
              <p
                className={cn(
                  "font-serif text-[0.7rem] font-bold leading-tight tracking-tight text-white/95 sm:text-[0.8rem]",
                  isDetail && "sm:text-[0.95rem]",
                )}
              >
                {line2}
              </p>
            ) : null}
          </div>
          <div className="mt-auto flex items-end justify-between gap-1 pt-3">
            <p
              className={cn(
                "text-[0.5rem] font-semibold tracking-wide sm:text-[0.55rem]",
                theme.muted,
              )}
            >
              GrygielGitara
            </p>
            <BookMarked
              className={cn("size-4 shrink-0 opacity-90 sm:size-5", theme.accent)}
              aria-hidden
            />
          </div>
        </div>
      </div>

      <span className="absolute left-3 top-3 rounded-md bg-slate-900/90 px-2 py-1 text-[0.65rem] font-bold uppercase tracking-[0.08em] text-white">
        {badge}
      </span>
    </div>
  );
}
