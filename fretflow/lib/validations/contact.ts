import { z } from "zod";

export const contactTopics = [
  "lessons",
  "setup_service",
  "shop_support",
  "other",
] as const;

export const contactTopicLabels: Record<(typeof contactTopics)[number], string> =
  {
    lessons: "Lekcje w Gdańsku (dojazd / Forum)",
    setup_service: "Serwis i regulacja gitary",
    shop_support: "Materiały cyfrowe / lista oczekujących",
    other: "Lekcje online / inne pytanie",
  };

export const contactFormSchema = z.object({
  senderName: z
    .string()
    .trim()
    .min(2, "Podaj imię (min. 2 znaki).")
    .max(80, "Imię jest zbyt długie."),
  email: z.email("Podaj poprawny adres e-mail."),
  phone: z
    .string()
    .trim()
    .max(30, "Numer telefonu jest zbyt długi.")
    .optional()
    .or(z.literal("")),
  topic: z.enum(contactTopics, {
    message: "Wybierz temat wiadomości.",
  }),
  message: z
    .string()
    .trim()
    .min(10, "Napisz trochę więcej (min. 10 znaków).")
    .max(2000, "Wiadomość jest zbyt długa (max. 2000 znaków)."),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
