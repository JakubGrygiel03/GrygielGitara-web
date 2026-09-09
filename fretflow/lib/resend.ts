import { Resend } from "resend";

import { resolveNotifyEmail } from "@/lib/admin-settings";
import {
  canAttachFreeGuidePdf,
  FREE_GUIDE_DOWNLOAD_FILENAME,
  getFreeGuidePdfFileUrl,
} from "@/lib/free-guide";
import { FREE_GUIDE_SHORT_TITLE } from "@/lib/free-guide-copy";
import { getRequestSiteUrl } from "@/lib/env";
import {
  unsubscribeApiPath,
  unsubscribePagePath,
} from "@/lib/newsletter-unsubscribe";
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

function escapeHtmlAttr(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;");
}

/** Generic transactional send (magic link invites, etc.). */
export async function sendEmail(input: {
  to: string;
  subject: string;
  html: string;
  headers?: Record<string, string>;
  attachments?: { path: string; filename: string }[];
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
      ...(input.headers ? { headers: input.headers } : {}),
      ...(input.attachments?.length ? { attachments: input.attachments } : {}),
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
 * Free PDF is only via /sklep/gitarowy-reset (download link by e-mail; marketing optional).
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
      <p><strong>Wybrany wariant:</strong> ${packageLabel}</p>
      <p><strong>Wybrane miejsce:</strong> ${locationLabel}</p>
      ${
        input.preferredDay
          ? `<p><strong>Preferowany termin:</strong> ${input.preferredDay}</p>`
          : ""
      }
      <p>Przypomnienie: pierwsza lekcja z gwarancją — jeśli nie złapiemy wspólnego języka, nie płacisz za te zajęcia.</p>
      <p>Jeśli zmienią Ci się plany albo godziny — <strong>nie musisz wysyłać formularza ponownie</strong>. Poczekaj na mój kontakt (telefon / wiadomość) i ustalimy wszystko w rozmowie.</p>
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

/**
 * Lead-magnet delivery. Attaches the PDF when it fits mailbox limits (~18 MB
 * source). The current 37 MB file is delivered as an immediate on-site
 * download plus a copy link in the e-mail.
 */
export async function sendFreeGuideEmail(input: {
  to: string;
  downloadUrl: string;
}): Promise<{ ok: boolean; message?: string }> {
  const site = await getRequestSiteUrl();
  const unsubPage = `${site}${unsubscribePagePath(input.to)}`;
  const unsubApi = `${site}${unsubscribeApiPath(input.to)}`;
  const safeDownloadUrl = escapeHtmlAttr(input.downloadUrl);
  const safeUnsub = escapeHtmlAttr(unsubPage);
  const attach = await canAttachFreeGuidePdf();

  const copyLine = attach
    ? "Plik powinien pobrać się automatycznie na stronie po wpisaniu maila, ale dla wygody przesyłam go również tutaj w załączniku, żebyś zawsze miał go pod ręką."
    : `Plik powinien pobrać się automatycznie na stronie po wpisaniu maila, ale dla wygody przesyłam go również tutaj, żebyś zawsze miał go pod ręką:<br/><br/><a href="${safeDownloadUrl}" style="display:inline-block;padding:12px 18px;background:#0369a1;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">Pobierz e-book „${FREE_GUIDE_SHORT_TITLE}”</a>`;

  const html = `
    <p>Cześć!</p>
    <p>Dziękuję bardzo za zainteresowanie moim materiałem.</p>
    <p>Mam szczerą nadzieję, że wyciągniesz z tego e-booka jak najwięcej dla siebie i że pomoże Ci on w codziennej grze na gitarze.</p>
    <p>${copyLine}</p>
    <p>Życzę udanej lektury i powodzenia z instrumentem!</p>
    <p>Pozdrawiam,<br/>Jakub Grygiel</p>
    <hr style="border:none;border-top:1px solid #e2e8f0;margin:28px 0 16px;" />
    <p style="font-size:12px;line-height:1.55;color:#64748b;">
      Jeśli w przyszłości nie będziesz chciał otrzymywać ode mnie kolejnych wiadomości, w każdej chwili możesz się wypisać z listy, klikając link do rezygnacji znajdujący się na samym dole tej wiadomości.
    </p>
    <p style="font-size:12px;line-height:1.55;color:#64748b;">
      <a href="${safeUnsub}" style="color:#0369a1;">Wypisz się z listy</a>
    </p>
  `;

  const headers = {
    "List-Unsubscribe": `<${unsubApi}>`,
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
  };

  const attachments = attach
    ? [
        {
          path: getFreeGuidePdfFileUrl(),
          filename: FREE_GUIDE_DOWNLOAD_FILENAME,
        },
      ]
    : undefined;

  const mailed = await sendEmail({
    to: input.to,
    subject: `Dziękuję za zainteresowanie – Twój e-book „${FREE_GUIDE_SHORT_TITLE}”`,
    html,
    headers,
    attachments,
  });

  if (!mailed.ok && attachments) {
    console.error(
      "sendFreeGuideEmail attachment failed, retrying without:",
      mailed.message,
    );
    return sendEmail({
      to: input.to,
      subject: `Dziękuję za zainteresowanie – Twój e-book „${FREE_GUIDE_SHORT_TITLE}”`,
      html,
      headers,
    });
  }

  return mailed;
}
