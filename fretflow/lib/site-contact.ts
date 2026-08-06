/** Public contact details shown on the site. */

export const SITE_PHONE_E164 = "+48798579505";
export const SITE_PHONE_DISPLAY = "+48 798 579 505";
export const SITE_PHONE_HREF = `tel:${SITE_PHONE_E164}`;

export const SITE_EMAIL =
  process.env.CONTACT_TO_EMAIL?.trim() || "kontakt@grygielgitara.pl";
