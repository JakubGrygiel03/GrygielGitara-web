import { getAdminSettings } from "@/lib/admin-settings";
import { Resend } from "resend";

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

async function sendBrevoSms(phoneRaw: string, content: string) {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  if (!apiKey) return { ok: false as const, reason: "Brak BREVO_API_KEY" };

  const digits = phoneRaw.replace(/\D/g, "");
  if (digits.length < 9) return { ok: false as const, reason: "Zły numer" };
  const recipient = digits.startsWith("48")
    ? digits
    : `48${digits.replace(/^0/, "")}`;
  const senderRaw = process.env.BREVO_SMS_SENDER?.trim() || "Grygiel";
  const sender =
    senderRaw.replace(/[^a-zA-Z0-9]/g, "").slice(0, 11) || "Grygiel";

  try {
    const response = await fetch(
      "https://api.brevo.com/v3/transactionalSMS/sms",
      {
        method: "POST",
        headers: {
          "api-key": apiKey,
          accept: "application/json",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          type: "transactional",
          unicodeEnabled: true,
          sender,
          recipient,
          content: content.slice(0, 320),
        }),
      },
    );
    if (response.ok) return { ok: true as const };
    return { ok: false as const, reason: await response.text() };
  } catch {
    return { ok: false as const, reason: "Błąd sieci SMS" };
  }
}

export async function notifyServiceReady(input: {
  clientName: string;
  email?: string | null;
  phone?: string | null;
  guitarModel: string;
}) {
  const settings = await getAdminSettings();
  const resend = getResend();
  const from = process.env.RESEND_FROM_EMAIL;
  let emailOk = false;
  let smsOk = false;
  let smsSkippedReason: string | undefined;

  const message =
    "Cześć! Twoja gitara jest już wyregulowana i gotowa do odbioru.";

  if (resend && from && input.email?.includes("@")) {
    try {
      await resend.emails.send({
        from,
        to: input.email.trim(),
        subject: `Gitara gotowa do odbioru · ${input.guitarModel} · GrygielGitara`,
        html: `
          <p>Cześć ${input.clientName},</p>
          <p>${message}</p>
          <p><strong>Instrument:</strong> ${input.guitarModel}</p>
          <p>Do zobaczenia!<br/>Jakub · GrygielGitara</p>
        `,
      });
      emailOk = true;
    } catch (error) {
      console.error("service ready email failed:", error);
    }
  }

  if (!settings.smsEnabled) {
    smsSkippedReason = "SMS wyłączone w ustawieniach";
  } else if (input.phone) {
    const sms = await sendBrevoSms(
      input.phone,
      `GrygielGitara: ${message} (${input.guitarModel})`,
    );
    smsOk = sms.ok;
    if (!sms.ok) smsSkippedReason = sms.reason;
  } else {
    smsSkippedReason = "Brak telefonu";
  }

  return { emailOk, smsOk, smsSkippedReason };
}
