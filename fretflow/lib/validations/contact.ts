import { z } from "zod";

import { SHOP_EARLY_BIRD_PERCENT } from "@/lib/shop-products";

export const contactTopics = [
  "lessons",
  "lesson_waitlist",
  "setup_service",
  "shop_support",
  "other",
] as const;

export const contactTopicLabels: Record<(typeof contactTopics)[number], string> =
  {
    lessons: "Pytanie o lekcje (bez rezerwacji terminu)",
    lesson_waitlist: "Lista oczekujących na lekcję",
    setup_service: "Serwis i regulacja gitary",
    shop_support: `Sklep — lista oczekujących (−${SHOP_EARLY_BIRD_PERCENT}% przy premierze)`,
    other: "Inne pytanie",
  };

export const LESSON_WAITLIST_SUCCESS =
  "Jesteś na liście. Jak tylko zwolni się miejsce, odezwę się na podany e-mail.";

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
  /** Locked product for early-bird (−30%) when set from shop CTA. */
  productSlug: z
    .string()
    .trim()
    .max(120)
    .optional()
    .or(z.literal("")),
  productTitle: z
    .string()
    .trim()
    .max(200)
    .optional()
    .or(z.literal("")),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
