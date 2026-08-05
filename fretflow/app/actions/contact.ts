"use server";

import {
  contactFormSchema,
  type ContactFormValues,
} from "@/lib/validations/contact";
import { upsertBrevoContact } from "@/lib/brevo";
import { createClient } from "@/lib/supabase/server";
import { sendContactEmails } from "@/lib/resend";

export type ContactActionState = {
  ok: boolean;
  message: string;
  fieldErrors?: Partial<Record<keyof ContactFormValues, string[]>>;
};

export async function submitContactForm(
  values: ContactFormValues,
): Promise<ContactActionState> {
  const parsed = contactFormSchema.safeParse(values);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Sprawdź pola formularza i spróbuj ponownie.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { senderName, email, phone, topic, message } = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase.from("contact_messages").insert({
    sender_name: senderName,
    email,
    phone: phone || null,
    topic,
    message,
  });

  if (error) {
    console.error("contact_messages insert failed:", error.message, error);
    return {
      ok: false,
      message:
        error.code === "42501"
          ? "Baza nie ma uprawnień INSERT. Odpal w Supabase SQL Editor plik supabase/migrations/20260325_phase1_grants.sql"
          : "Nie udało się wysłać wiadomości. Spróbuj za chwilę.",
    };
  }

  // Bonus lead magnet list — ignore duplicate email conflicts.
  const { error: leadError } = await supabase
    .from("newsletter_subscribers")
    .insert({
      email,
      source: "contact_form_bonus",
    });

  if (leadError && leadError.code !== "23505") {
    console.error("newsletter_subscribers insert failed:", leadError.message);
  }

  await upsertBrevoContact({
    email,
    firstName: senderName,
  });

  try {
    await sendContactEmails({
      senderName,
      email,
      phone: phone || undefined,
      topic,
      message,
    });
  } catch (mailError) {
    console.error("contact email failed:", mailError);
  }

  return {
    ok: true,
    message:
      "Wiadomość wysłana. Na maila leci potwierdzenie (poradnik PDF dołączymy, gdy będzie gotowy).",
  };
}
