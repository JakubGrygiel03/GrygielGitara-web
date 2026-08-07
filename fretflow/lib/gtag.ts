/** Google Ads account ID (public — used in gtag.js). */
export const GOOGLE_ADS_ID =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_ID?.trim() || "AW-17981602172";

/**
 * Full conversion send_to for Kontakt / Rezerwacja.
 * From Ads → Konwersje → fragment zdarzenia.
 */
export const GOOGLE_ADS_CONVERSION_SEND_TO =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_SEND_TO?.trim() ||
  "AW-17981602172/u5nvCISkl4McEPzypf5C";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Fire Google Ads conversion after a successful contact/booking form. */
export function trackGoogleConversion() {
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag("event", "conversion", {
    send_to: GOOGLE_ADS_CONVERSION_SEND_TO,
  });
}

/** @deprecated Use trackGoogleConversion */
export const trackGoogleAdsContactConversion = trackGoogleConversion;
