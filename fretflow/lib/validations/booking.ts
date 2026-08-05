import { z } from "zod";

import { lessonPackageIds } from "@/lib/lesson-packages";

export const bookingLocations = [
  "student_home",
  "studio_forum",
  "online",
] as const;

export const bookingLocationLabels: Record<
  (typeof bookingLocations)[number],
  string
> = {
  student_home: "Dojazd do ucznia",
  studio_forum: "U nauczyciela (okolice Galerii Forum, Gdańsk)",
  online: "Online (Telegram)",
};

export const bookingFormSchema = z.object({
  studentName: z
    .string()
    .trim()
    .min(2, "Podaj imię (min. 2 znaki).")
    .max(80, "Imię jest zbyt długie."),
  email: z.email("Podaj poprawny adres e-mail."),
  phone: z
    .string()
    .trim()
    .min(7, "Podaj numer telefonu.")
    .max(30, "Numer telefonu jest zbyt długi."),
  locationType: z.enum(bookingLocations, {
    message: "Wybierz miejsce lekcji.",
  }),
  interestPackage: z.enum(lessonPackageIds, {
    message: "Wybierz interesujący Cię pakiet / wariant ceny.",
  }),
  preferredDay: z
    .string()
    .trim()
    .max(120, "Preferowany termin jest zbyt długi.")
    .optional()
    .or(z.literal("")),
  favoriteSong: z
    .string()
    .trim()
    .max(120, "Nazwa utworu jest zbyt długa.")
    .optional()
    .or(z.literal("")),
  hasInstrument: z.boolean(),
  acceptsGuarantee: z.boolean().refine((value) => value === true, {
    message: "Potwierdź akceptację gwarancji pierwszej lekcji.",
  }),
  message: z
    .string()
    .trim()
    .max(1000, "Wiadomość jest zbyt długa.")
    .optional()
    .or(z.literal("")),
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;
