"use server";

import { upsertBrevoContact } from "@/lib/brevo";
import { isFreeGuideOpen } from "@/lib/free-guide";
import { FREE_GUIDE_SUCCESS } from "@/lib/free-guide-copy";
import {
  leadMagnetSchema,
  MARKETING_CONSENT_LABEL,
} from "@/lib/validations/lead";
import { createClient } from "@/lib/supabase/server";

export type LeadActionState = {
  ok: boolean;
  message: string;
};

export async function submitLeadMagnet(
  email: string,
  marketingConsent: boolean,
): Promise<LeadActionState> {
  if (!isFreeGuideOpen()) {
    return {
      ok: false,
      message: "Darmowy poradnik jest jeszcze w przygotowaniu. Wróć wkrótce.",
    };
  }

  const parsed = leadMagnetSchema.safeParse({
    email,
    marketingConsent,
    source: "gitarowy_falstart_free_guide",
  });

  if (!parsed.success) {
    return {
      ok: false,
      message:
        parsed.error.flatten().fieldErrors.email?.[0] ??
        "Sprawdź formularz i spróbuj ponownie.",
    };
  }

  const wantsMarketing = parsed.data.marketingConsent === true;
  const supabase = await createClient();
  const { error } = await supabase.from("newsletter_subscribers").insert({
    email: parsed.data.email,
    source: parsed.data.source,
    marketing_consent: wantsMarketing,
    marketing_consent_text: wantsMarketing ? MARKETING_CONSENT_LABEL : null,
    marketing_consent_at: wantsMarketing ? new Date().toISOString() : null,
  });

  // Unique email already subscribed — treat as success for UX.
  if (error && error.code !== "23505") {
    if (error.message.includes("marketing_consent")) {
      const retry = await supabase.from("newsletter_subscribers").insert({
        email: parsed.data.email,
        source: parsed.data.source,
      });
      if (retry.error && retry.error.code !== "23505") {
        console.error("newsletter_subscribers insert failed:", retry.error.message);
        return {
          ok: false,
          message: "Nie udało się zapisać. Spróbuj za chwilę.",
        };
      }
    } else {
      console.error("newsletter_subscribers insert failed:", error.message);
      return {
        ok: false,
        message: "Nie udało się zapisać. Spróbuj za chwilę.",
      };
    }
  }

  if (wantsMarketing) {
    await upsertBrevoContact({
      email: parsed.data.email,
      addToMarketingList: true,
      marketingConsent: true,
    });
  }

  return {
    ok: true,
    message: FREE_GUIDE_SUCCESS,
  };
}
