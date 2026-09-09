import { z } from "zod";

/** Exact wording stored with the lead (audit trail). Keep in sync with the form. */
export const MARKETING_CONSENT_LABEL =
  "Zapisuję się na newsletter. Mogę wypisać się w każdej chwili.";

export const PRIVACY_CONSENT_LABEL =
  "Akceptuję Regulamin sklepu i Politykę prywatności.";

export const MARKETING_CONSENT_REQUIRED =
  "Pole wymagane do zaznaczenia.";

export const PRIVACY_CONSENT_REQUIRED =
  "Pole wymagane do zaznaczenia.";

export const leadMagnetSchema = z.object({
  email: z.email("Podaj poprawny adres e-mail."),
  marketingConsent: z.boolean().refine((value) => value === true, {
    message: MARKETING_CONSENT_REQUIRED,
  }),
  privacyConsent: z.boolean().refine((value) => value === true, {
    message: PRIVACY_CONSENT_REQUIRED,
  }),
  source: z
    .string()
    .trim()
    .min(1)
    .max(80)
    .default("gitarowy_reset_free_guide"),
});

export type LeadMagnetValues = z.infer<typeof leadMagnetSchema>;
