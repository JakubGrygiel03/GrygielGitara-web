/**
 * Free PDF download form.
 * false = keep teaser/page visible with „Już wkrótce dostępny”.
 * true = open /pobierz-poradnik form + real download CTAs.
 */
export function isFreeGuideOpen(): boolean {
  const raw = process.env.FREE_GUIDE_OPEN?.trim().toLowerCase();
  return raw === "1" || raw === "true" || raw === "yes" || raw === "on";
}
