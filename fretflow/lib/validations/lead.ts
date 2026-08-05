import { z } from "zod";

export const leadMagnetSchema = z.object({
  email: z.email("Podaj poprawny adres e-mail."),
  source: z
    .string()
    .trim()
    .min(1)
    .max(80)
    .default("tuning_pdf_lead_magnet"),
});

export type LeadMagnetValues = z.infer<typeof leadMagnetSchema>;
