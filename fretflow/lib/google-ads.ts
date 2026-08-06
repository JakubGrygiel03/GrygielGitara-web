/** Google Ads conversion ID (public — used in gtag). */
export const GOOGLE_ADS_ID =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_ID?.trim() || "AW-17981602172";

/**
 * Conversion label from Ads → Konwersje → Kontakt (send_to after /).
 * Full send_to: `${GOOGLE_ADS_ID}/${label}`
 */
export const GOOGLE_ADS_CONTACT_LABEL =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_CONTACT_LABEL?.trim() ||
  "u5nvCISkl4McEPzypf5C";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Fire Ads conversion after a successful lead form (kontakt / rezerwacja). */
export function trackGoogleAdsContactConversion() {
  if (typeof window === "undefined" || !GOOGLE_ADS_ID || !window.gtag) {
    return;
  }

  const sendTo = GOOGLE_ADS_CONTACT_LABEL
    ? `${GOOGLE_ADS_ID}/${GOOGLE_ADS_CONTACT_LABEL}`
    : GOOGLE_ADS_ID;

  window.gtag("event", "conversion", {
    send_to: sendTo,
  });
}
