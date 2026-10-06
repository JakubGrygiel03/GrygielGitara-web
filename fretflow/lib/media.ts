/**
 * Single source of truth for site images.
 * Sections reference these paths — never copy files per section.
 * Next.js Image optimizer serves resized WebP/AVIF from the same original.
 */
export const SITE_IMAGES = {
  portrait: "/images/jakub-portrait.png",
  casual: "/images/jakub-casual.png",
  medievals: "/images/medievals-portrait.png",
  forumMusicum: "/images/forum-musicum.png",
  concert: "/images/concert-classical.png",
  logoSquare: "/images/logo-grygielgitara-square.png",
  wordmark: "/images/logo-grygielgitara.png",
  coverGitarowyReset: "/images/shop/ebook-gitarowy-reset-cover.png",
  coverStart: "/images/shop/ebook-start-cover.svg",
  coverSetup: "/images/shop/ebook-setup-cover.svg",
  icon192: "/icons/icon-192.png",
  icon512: "/icons/icon-512.png",
} as const;

export type SiteImageKey = keyof typeof SITE_IMAGES;

export const SITE_IMAGE_LABELS: Record<SiteImageKey, string> = {
  portrait: "Portret (hero / OG)",
  casual: "Zdjęcie luźne (metoda)",
  medievals: "The Medievals (o mnie)",
  forumMusicum: "Forum Musicum",
  concert: "Koncert (cennik)",
  logoSquare: "Logo kwadratowe",
  wordmark: "Logotyp",
  coverGitarowyReset: "Okładka Gitarowy Reset",
  coverStart: "Okładka Start bez stresu",
  coverSetup: "Okładka Setup gitary",
  icon192: "Ikona PWA 192",
  icon512: "Ikona PWA 512",
};

/** Shop slug → existing cover (VIP reuses Start — no second file). */
export const SHOP_COVER_BY_SLUG: Record<string, string> = {
  "gitarowy-reset": SITE_IMAGES.coverGitarowyReset,
  "gitarowy-falstart": SITE_IMAGES.coverGitarowyReset,
  "start-z-gitara-bez-stresu": SITE_IMAGES.coverStart,
  "start-bez-stresu-feedback-vip": SITE_IMAGES.coverStart,
  "setup-gitary-w-domu": SITE_IMAGES.coverSetup,
};

export const MEDIA_BUCKET = "site-media";
export const MEDIA_MAX_BYTES = 1_500_000;
export const MEDIA_MAX_EDGE = 1600;
export const MEDIA_ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;
