import Image from "next/image";
import { BookMarked } from "lucide-react";

import { cn } from "@/lib/utils";

type CoverTheme = {
  stage: string;
  cover: string;
  accent: string;
  muted: string;
};

/** Real cover art shown as the book face — stage background stays themed. */
const COVER_IMAGES: Record<string, string> = {
  "gitarowy-reset": "/images/shop/ebook-gitarowy-reset-cover.png",
  "gitarowy-falstart": "/images/shop/ebook-gitarowy-reset-cover.png",
};

const THEMES: Record<string, CoverTheme> = {
  "start-z-gitara-bez-stresu": {
    stage: "from-sky-800 via-sky-900 to-slate-950",
    cover: "from-sky-500 via-sky-600 to-slate-900",
    accent: "text-sky-100",
    muted: "text-sky-200/85",
  },
  "setup-gitary-w-domu": {
    stage: "from-emerald-700 via-emerald-900 to-slate-950",
    cover: "from-lime-500 via-emerald-600 to-slate-900",
    accent: "text-lime-100",
    muted: "text-emerald-100/90",
  },
  /** Warm charcoal — pairs with orange accent + navy line art on the cover. */
  "gitarowy-reset": {
    stage: "from-stone-800 via-[#1c1816] to-stone-950",
    cover: "from-orange-500 via-stone-700 to-stone-900",
    accent: "text-orange-200",
    muted: "text-stone-300/90",
  },
  /** Legacy slug — keep theme if old links hit cover before redirect. */
  "gitarowy-falstart": {
    stage: "from-stone-800 via-[#1c1816] to-stone-950",
    cover: "from-orange-500 via-stone-700 to-stone-900",
    accent: "text-orange-200",
    muted: "text-stone-300/90",
  },
  "start-bez-stresu-feedback-vip": {
    stage: "from-[#2a1038] via-[#120818] to-black",
    cover: "from-[#6b21a8] via-[#3b0764] to-[#0c0414]",
    accent: "text-amber-200",
    muted: "text-violet-200/80",
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
  const coverImage = COVER_IMAGES[slug];
  const [line1, line2] = splitTitle(title);
  const isDetail = size === "detail";

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden border-b border-slate-800 bg-gradient-to-b",
        theme.stage,
        isDetail
          ? coverImage
            ? "aspect-[5/6] min-h-[22rem] rounded-2xl border px-8 py-10 shadow-[0_1px_0_rgba(15,23,42,0.04),0_12px_32px_-16px_rgba(120,80,40,0.35)] sm:min-h-[26rem] sm:px-10 sm:py-12"
            : "aspect-[4/5] min-h-[22rem] rounded-2xl border px-5 py-6 shadow-[0_1px_0_rgba(15,23,42,0.04),0_12px_32px_-16px_rgba(14,165,233,0.35)] sm:min-h-[26rem] sm:px-6 sm:py-8"
          : coverImage
            ? "aspect-[5/4] px-8 py-9 sm:px-10 sm:py-10"
            : "aspect-[5/4] px-5 py-6 sm:px-7 sm:py-7",
        className,
      )}
      role="img"
      aria-label={`Okładka e-booka ${title}`}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 opacity-40",
          coverImage
            ? "bg-[radial-gradient(ellipse_at_40%_30%,rgba(249,115,22,0.18),transparent_55%)]"
            : "bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.16),transparent_55%)]",
        )}
      />

      <div
        className={cn(
          "relative overflow-hidden rounded-sm shadow-[0_18px_40px_-10px_rgba(0,0,0,0.65)] ring-1 ring-white/25 transition-transform duration-300 ease-out group-hover:rotate-0 group-hover:scale-[1.03]",
          coverImage ? "aspect-[2/3]" : "aspect-[3/4]",
          coverImage
            ? "w-[48%] max-w-[9.5rem] rotate-[-2deg] sm:max-w-[10.5rem]"
            : "w-[58%] max-w-[11rem] rotate-[-2deg] sm:max-w-[12.5rem]",
          isDetail &&
            (coverImage
              ? "w-[58%] max-w-[13rem] sm:max-w-[14.5rem]"
              : "w-[70%] max-w-[15rem] sm:max-w-[17.5rem]"),
          !coverImage && "flex flex-col justify-between bg-gradient-to-br",
          !coverImage && theme.cover,
        )}
      >
        {coverImage ? (
          <Image
            src={coverImage}
            alt={`Okładka e-booka ${title}`}
            fill
            className="object-cover object-center"
            sizes={
              isDetail
                ? "(max-width: 1024px) 40vw, 18rem"
                : "(max-width: 640px) 45vw, 13rem"
            }
            priority={isDetail}
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.14)_0%,transparent_42%)]" />
            <div
              className={cn(
                "relative flex flex-1 flex-col px-2.5 pb-2.5 pt-3 sm:px-3 sm:pt-3.5",
                isDetail && "px-3.5 pb-3.5 pt-4 sm:px-4 sm:pt-5",
              )}
            >
              <p
                className={cn(
                  "text-[0.55rem] font-bold uppercase tracking-[0.14em] sm:text-[0.6rem]",
                  isDetail && "text-[0.65rem] sm:text-[0.7rem]",
                  theme.muted,
                )}
              >
                {badge}
              </p>
              <div className="mt-2 space-y-0.5">
                <p
                  className={cn(
                    "font-serif text-[0.8rem] font-bold leading-tight tracking-tight text-white sm:text-[0.9rem]",
                    isDetail && "text-[1rem] sm:text-[1.15rem]",
                  )}
                >
                  {line1}
                </p>
                {line2 ? (
                  <p
                    className={cn(
                      "font-serif text-[0.8rem] font-bold leading-tight tracking-tight text-white/95 sm:text-[0.9rem]",
                      isDetail && "text-[1rem] sm:text-[1.15rem]",
                    )}
                  >
                    {line2}
                  </p>
                ) : null}
              </div>
              <div className="mt-auto flex items-end justify-between gap-1 pt-3">
                <p
                  className={cn(
                    "text-[0.55rem] font-semibold tracking-wide sm:text-[0.6rem]",
                    isDetail && "text-[0.65rem] sm:text-[0.7rem]",
                    theme.muted,
                  )}
                >
                  GrygielGitara
                </p>
                <BookMarked
                  className={cn(
                    "size-4 shrink-0 opacity-90 sm:size-5",
                    isDetail && "size-5 sm:size-6",
                    theme.accent,
                  )}
                  aria-hidden
                />
              </div>
            </div>
          </>
        )}
      </div>

      <span className="absolute left-3 top-3 z-10 rounded-md bg-slate-900/90 px-2 py-1 text-[0.65rem] font-bold uppercase tracking-[0.08em] text-white">
        {badge}
      </span>
    </div>
  );
}
