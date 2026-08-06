import { Resend } from "resend";

import { resolveNotifyEmail } from "@/lib/admin-settings";
import { lessonPackageLabel } from "@/lib/lesson-packages";
import {
  bookingLocationLabels,
  type BookingFormValues,
} from "@/lib/validations/booking";
import { contactTopicLabels, type ContactFormValues } from "@/lib/validations/contact";

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

/** Generic transactional send (magic link invites, etc.). */
export async function sendEmail(input: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ ok: boolean; message?: string }> {
  const resend = getResendClient();
  const from = process.env.RESEND_FROM_EMAIL;
  if (!resend || !from) {
    return { ok: false, message: "Brak RESEND_API_KEY / RESEND_FROM_EMAIL." };
  }
  try {
    const { error } = await resend.emails.send({
      from,
      to: input.to,
      subject: input.subject,
      html: input.html,
    });
    if (error) return { ok: false, message: error.message };
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Resend error",
    };
  }
}

type ContactMailInput = {
  senderName: string;
  email: string;
  phone?: string;
  topic: ContactFormValues["topic"];
  message: string;
};

/**
 * Transactional confirmation + owner notification.
 * Free PDF is only via /pobierz-poradnik (email for delivery; marketing optional).
 */
export async function sendContactEmails(input: ContactMailInput): Promise<void> {
  const resend = getResendClient();
  const from = process.env.RESEND_FROM_EMAIL;
  const ownerInbox = resolveNotifyEmail();

  if (!resend || !from) {
    console.warn(
      "Resend skipped: set RESEND_API_KEY and RESEND_FROM_EMAIL to enable emails.",
    );
    return;
  }

  const topicLabel = contactTopicLabels[input.topic];

  await resend.emails.send({
    from,
    to: input.email,
    ...(ownerInbox ? { replyTo: ownerInbox } : {}),
    subject: "Dzięki za wiadomość · GrygielGitara",
    html: `
    <p>Cześć ${input.senderName},</p>
    <p>Dzięki za wiadomość. Odpiszę tak szybko, jak to możliwe.</p>
    <p>Do usłyszenia,<br/>Jakub · GrygielGitara</p>
  `,
  });

  if (ownerInbox) {
    await resend.emails.send({
      from,
      to: ownerInbox,
      replyTo: input.email,
      subject: `Nowa wiadomość: ${topicLabel} · ${input.senderName}`,
      html: `
        <p><strong>Od:</strong> ${input.senderName} (${input.email})</p>
        <p><strong>Telefon:</strong> ${input.phone || "brak"}</p>
        <p><strong>Temat:</strong> ${topicLabel}</p>
        <p><strong>Wiadomość:</strong></p>
        <p>${input.message.replace(/\n/g, "<br/>")}</p>
        <p><em>Lead dostał potwierdzenie transakcyjne (bez PDF / marketingu).</em></p>
      `,
    });
  }
}

type BookingMailInput = {
  studentName: string;
  email: string;
  phone: string;
  locationType: BookingFormValues["locationType"];
  interestPackage: BookingFormValues["interestPackage"];
  preferredDay?: string;
  favoriteSong?: string;
  hasInstrument: boolean;
  message?: string;
  token: string;
};

/**
 * Confirmation to student + owner notification after booking submit.
 */
export async function sendBookingEmails(input: BookingMailInput): Promise<void> {
  const resend = getResendClient();
  const from = process.env.RESEND_FROM_EMAIL;
  const ownerInbox = resolveNotifyEmail();

  if (!resend || !from) {
    console.warn(
      "Resend skipped: set RESEND_API_KEY and RESEND_FROM_EMAIL to enable emails.",
    );
    return;
  }

  const locationLabel = bookingLocationLabels[input.locationType];
  const packageLabel =
    lessonPackageLabel(input.interestPackage) || input.interestPackage;

  await resend.emails.send({
    from,
    to: input.email,
    ...(ownerInbox ? { replyTo: ownerInbox } : {}),
    subject: "Zgłoszenie lekcji próbnej · GrygielGitara",
    html: `
      <p>Cześć ${input.studentName},</p>
      <p>Dzięki za zgłoszenie lekcji próbnej. Odezwę się wkrótce, żeby ustalić dokładny termin.</p>
      <p><strong>Interesujący wariant:</strong> ${packageLabel}</p>
      <p><strong>Wybrane miejsce:</strong> ${locationLabel}</p>
      ${
        input.preferredDay
          ? `<p><strong>Preferowany termin:</strong> ${input.preferredDay}</p>`
          : ""
      }
      <p>Przypomnienie: pierwsza lekcja z gwarancją — jeśli nie złapiemy wspólnego języka, nie płacisz za te zajęcia.</p>
      <p>Do usłyszenia,<br/>Jakub · GrygielGitara</p>
    `,
  });

  if (ownerInbox) {
    await resend.emails.send({
      from,
      to: ownerInbox,
      replyTo: input.email,
      subject: `Nowa rezerwacja · ${input.studentName}`,
      html: `
        <p><strong>Uczeń:</strong> ${input.studentName} (${input.email})</p>
        <p><strong>Telefon:</strong> ${input.phone}</p>
        <p><strong>Pakiet / wariant:</strong> ${packageLabel}</p>
        <p><strong>Miejsce:</strong> ${locationLabel}</p>
        <p><strong>Preferowany termin:</strong> ${input.preferredDay || "brak"}</p>
        <p><strong>Ulubiony utwór:</strong> ${input.favoriteSong || "brak"}</p>
        <p><strong>Ma instrument:</strong> ${input.hasInstrument ? "tak" : "nie"}</p>
        <p><strong>Wiadomość:</strong></p>
        <p>${(input.message || "—").replace(/\n/g, "<br/>")}</p>
        <p><em>Token: ${input.token}</em></p>
      `,
    });
  }
}
