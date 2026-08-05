"use server";

import { upsertBrevoContact } from "@/lib/brevo";
import { leadMagnetSchema } from "@/lib/validations/lead";
import { createClient } from "@/lib/supabase/server";

export type LeadActionState = {
  ok: boolean;
  message: string;
};

export async function submitLeadMagnet(email: string): Promise<LeadActionState> {
  const parsed = leadMagnetSchema.safeParse({
    email,
    source: "tuning_pdf_lead_magnet",
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Podaj poprawny adres e-mail.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("newsletter_subscribers").insert({
    email: parsed.data.email,
    source: parsed.data.source,
  });

  // Unique email already subscribed — treat as success for UX.
  if (error && error.code !== "23505") {
    console.error("newsletter_subscribers insert failed:", error.message);
    return {
      ok: false,
      message: "Nie udało się zapisać. Spróbuj za chwilę.",
    };
  }

  await upsertBrevoContact({
    email: parsed.data.email,
  });

  return {
    ok: true,
    message:
      "Zapisane! Poradnik i info o materiałach wyślę na podany e-mail (PDF w przygotowaniu).",
  };
}
