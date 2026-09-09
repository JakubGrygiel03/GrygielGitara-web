import { createHmac, timingSafeEqual } from "node:crypto";

import { blacklistBrevoContact } from "@/lib/brevo";
import { getSupabaseEnvOptional } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";

export const UNSUBSCRIBE_PATH = "/wypisz-sie";

function unsubscribeSecret(): string {
  return (
    process.env.NEWSLETTER_UNSUBSCRIBE_SECRET?.trim() ||
    process.env.CRON_SECRET?.trim() ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    "local-dev-unsubscribe"
  );
}

export function normalizeNewsletterEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function createUnsubscribeToken(email: string): string {
  return createHmac("sha256", unsubscribeSecret())
    .update(normalizeNewsletterEmail(email))
    .digest("hex")
    .slice(0, 32);
}

export function verifyUnsubscribeToken(email: string, token: string): boolean {
  const expected = createUnsubscribeToken(email);
  const given = token.trim().toLowerCase();
  if (given.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(given));
  } catch {
    return false;
  }
}

export function unsubscribePagePath(email: string): string {
  const normalized = normalizeNewsletterEmail(email);
  const params = new URLSearchParams({
    email: normalized,
    token: createUnsubscribeToken(normalized),
  });
  return `${UNSUBSCRIBE_PATH}?${params.toString()}`;
}

export function unsubscribeApiPath(email: string): string {
  const normalized = normalizeNewsletterEmail(email);
  const params = new URLSearchParams({
    email: normalized,
    token: createUnsubscribeToken(normalized),
  });
  return `/api/unsubscribe?${params.toString()}`;
}

/** Stop marketing: Brevo blacklist + consent flag in the database. */
export async function unsubscribeEmail(email: string): Promise<void> {
  const normalized = normalizeNewsletterEmail(email);
  await blacklistBrevoContact(normalized);

  if (!getSupabaseEnvOptional()) return;
  try {
    const admin = createAdminClient();
    await admin
      .from("newsletter_subscribers")
      .update({
        marketing_consent: false,
        marketing_consent_at: new Date().toISOString(),
      })
      .eq("email", normalized);
  } catch (error) {
    console.error("unsubscribeEmail database:", error);
  }
}
