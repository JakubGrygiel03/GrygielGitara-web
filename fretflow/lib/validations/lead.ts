import { z } from "zod";

/** Optional — PDF delivery does not require marketing list signup. */
export const MARKETING_CONSENT_LABEL =
  "Chcę dostawać od GrygielGitara informacje o lekcjach i materiałach (mogę wypisać się w każdej chwili). PDF dostaniesz także bez tej zgody.";

export const leadMagnetSchema = z.object({
  email: z.email("Podaj poprawny adres e-mail."),
  marketingConsent: z.boolean(),
  source: z
    .string()
    .trim()
    .min(1)
    .max(80)
    .default("gitarowy_falstart_free_guide"),
});

export type LeadMagnetValues = z.infer<typeof leadMagnetSchema>;
