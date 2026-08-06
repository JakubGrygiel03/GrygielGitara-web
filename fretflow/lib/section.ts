/** Shared vertical rhythm for homepage / public sections. */
export const SECTION_PAD =
  "px-4 py-12 sm:px-6 sm:py-14 lg:py-16" as const;

/** Blue section eyebrows — larger so they read as a clear label. */
export const SECTION_EYEBROW =
  "text-xl font-extrabold uppercase tracking-wide text-sky-600 sm:text-2xl" as const;

/** Shared readable type — same contrast as „Emocje i efekty”. */
export const SECTION_TITLE =
  "text-[1.5rem] font-bold leading-snug tracking-[-0.015em] text-slate-900 sm:text-3xl lg:text-4xl" as const;

export const SECTION_LEAD =
  "text-base leading-[1.65] text-slate-700 sm:text-[1.0625rem] sm:leading-relaxed" as const;

export const SECTION_BODY =
  "text-base leading-[1.65] text-slate-700" as const;

export const SECTION_CAPTION =
  "text-sm leading-relaxed text-slate-600" as const;

/** Alternating bands — clearer break than flat white throughout. */
export const SECTION_BAND_A =
  "scroll-mt-24 border-t border-sky-100/90 bg-surface" as const;

export const SECTION_BAND_B =
  "scroll-mt-24 border-t border-sky-100/90 bg-white" as const;
