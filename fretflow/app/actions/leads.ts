"use server";

import { upsertBrevoContact } from "@/lib/brevo";
import { getFreeGuidePdfUrl, isFreeGuideOpen } from "@/lib/free-guide";
import { grantFreeGuideToEmail, grantFreeGuideToUserId } from "@/lib/free-guide-entitlement";
import { FREE_GUIDE_SUCCESS } from "@/lib/free-guide-copy";
import { sendFreeGuideEmail } from "@/lib/resend";
import {
  leadMagnetSchema,
  MARKETING_CONSENT_LABEL,
  PRIVACY_CONSENT_LABEL,
} from "@/lib/validations/lead";
import { createClient } from "@/lib/supabase/server";

export type LeadActionState = {
  ok: boolean;
  message: string;
  downloadUrl?: string;
};

function consentRecordText() {
  return `${MARKETING_CONSENT_LABEL} ${PRIVACY_CONSENT_LABEL}`;
}

export async function submitLeadMagnet(
  email: string,
  marketingConsent: boolean,
  privacyConsent: boolean,
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
    privacyConsent,
    source: "gitarowy_reset_free_guide",
  });

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return {
      ok: false,
      message:
        fieldErrors.email?.[0] ??
        fieldErrors.marketingConsent?.[0] ??
        fieldErrors.privacyConsent?.[0] ??
        "Zaznacz wymagane zgody i spróbuj ponownie.",
    };
  }

  const consentText = consentRecordText();
  const consentedAt = new Date().toISOString();
  const supabase = await createClient();
  const { error } = await supabase.from("newsletter_subscribers").insert({
    email: parsed.data.email,
    source: parsed.data.source,
    marketing_consent: true,
    marketing_consent_text: consentText,
    marketing_consent_at: consentedAt,
  });

  if (error && error.code === "23505") {
    const { error: updateError } = await supabase
      .from("newsletter_subscribers")
      .update({
        marketing_consent: true,
        marketing_consent_text: consentText,
        marketing_consent_at: consentedAt,
      })
      .eq("email", parsed.data.email);
    if (updateError) {
      console.error(
        "newsletter_subscribers consent update failed:",
        updateError.message,
      );
    }
  } else if (error) {
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

  await upsertBrevoContact({
    email: parsed.data.email,
    addToMarketingList: true,
    marketingConsent: true,
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user?.id) {
    await grantFreeGuideToUserId(user.id);
  }
  await grantFreeGuideToEmail(parsed.data.email);

  const downloadUrl = getFreeGuidePdfUrl();
  const mailed = await sendFreeGuideEmail({
    to: parsed.data.email,
    downloadUrl,
  });
  if (!mailed.ok) {
    console.error("sendFreeGuideEmail failed:", mailed.message);
  }

  return {
    ok: true,
    message: FREE_GUIDE_SUCCESS,
    downloadUrl,
  };
}
