/**
 * Public free PDF lead magnet (/pobierz-poradnik + hero/footer CTAs).
 * Set FREE_GUIDE_OPEN=true when the PDF is ready to offer.
 */
export function isFreeGuideOpen(): boolean {
  const raw = process.env.FREE_GUIDE_OPEN?.trim().toLowerCase();
  return raw === "1" || raw === "true" || raw === "yes" || raw === "on";
}
