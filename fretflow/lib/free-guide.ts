/** Canonical product slug — same offer from home, shop, and CTAs. */
export const FREE_GUIDE_SLUG = "gitarowy-reset";

/** Single offer URL for the free PDF (shop product page). */
export const FREE_GUIDE_HREF = `/sklep/${FREE_GUIDE_SLUG}` as const;

/**
 * Free PDF download form.
 * false = keep teaser/page visible with „Już wkrótce dostępny”.
 * true = open form + real download CTAs on FREE_GUIDE_HREF.
 */
export function isFreeGuideOpen(): boolean {
  const raw = process.env.FREE_GUIDE_OPEN?.trim().toLowerCase();
  return raw === "1" || raw === "true" || raw === "yes" || raw === "on";
}
