"use server";

import {
  unsubscribeEmail,
  verifyUnsubscribeToken,
} from "@/lib/newsletter-unsubscribe";

export async function confirmNewsletterUnsubscribe(
  email: string,
  token: string,
): Promise<{ ok: boolean; message: string }> {
  if (!verifyUnsubscribeToken(email, token)) {
    return {
      ok: false,
      message: "Link do wypisania jest nieprawidłowy albo niekompletny.",
    };
  }

  await unsubscribeEmail(email);
  return {
    ok: true,
    message: "Gotowe. Nie będę już wysyłał wiadomości na ten adres.",
  };
}
