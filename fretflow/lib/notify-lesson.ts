import { getAdminSettings, resolveNotifyEmail } from "@/lib/admin-settings";
import { Resend } from "resend";

type LessonNotifyInput = {
  studentName: string;
  email: string;
  phone?: string | null;
  startsAt: Date;
  endsAt: Date;
  location?: string | null;
  notes?: string | null;
  kind?: "created" | "reminder";
  /** Also email the teacher (CONTACT_TO_EMAIL). */
  notifyTeacher?: boolean;
};

export type LessonNotifyResult = {
  emailOk: boolean;
  smsOk: boolean;
  teacherEmailOk: boolean;
  smsSkippedReason?: string;
};

function formatPl(date: Date) {
  return new Intl.DateTimeFormat("pl-PL", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(date);
}

/** UTC stamp for Google Calendar template URLs: YYYYMMDDTHHMMSSZ */
function toGoogleCalendarStamp(date: Date) {
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

function buildGoogleCalendarUrl(input: {
  title: string;
  startsAt: Date;
  endsAt: Date;
  location: string;
  details: string;
}) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: input.title,
    dates: `${toGoogleCalendarStamp(input.startsAt)}/${toGoogleCalendarStamp(input.endsAt)}`,
    details: input.details,
    location: input.location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function googleCalendarButtonHtml(url: string) {
  return `
    <p style="margin: 20px 0;">
      <a href="${url}"
         style="display:inline-block;background:#0ea5e9;color:#ffffff;text-decoration:none;font-weight:600;padding:12px 18px;border-radius:10px;">
        Dodaj do Google Calendar
      </a>
    </p>
    <p style="font-size:13px;color:#64748b;">
      Albo otwórz link:<br/>
      <a href="${url}">${url}</a>
    </p>
  `;
}

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

async function sendBrevoSms(
  phoneRaw: string,
  content: string,
): Promise<{ ok: boolean; reason?: string }> {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  if (!apiKey) return { ok: false, reason: "Brak BREVO_API_KEY" };

  const phone = phoneRaw.replace(/[^\d+]/g, "");
  if (!phone || phone.replace(/\D/g, "").length < 9) {
    return { ok: false, reason: "Brak numeru telefonu" };
  }

  const digits = phone.replace(/\D/g, "");
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

    if (response.ok) return { ok: true };

    const detail = await response.text();
    console.error("Brevo SMS failed:", response.status, detail);
    return { ok: false, reason: explainBrevoSmsError(response.status, detail) };
  } catch (error) {
    console.error("Brevo SMS network error:", error);
    return { ok: false, reason: "Błąd sieci SMS" };
  }
}

/**
 * Email (Resend) + optional SMS (Brevo) to student;
 * optional teacher email for reminders / created.
 */
export async function notifyStudentAboutLesson(
  input: LessonNotifyInput,
): Promise<LessonNotifyResult> {
  const kind = input.kind ?? "created";
  const when = formatPl(input.startsAt);
  const until = new Intl.DateTimeFormat("pl-PL", { timeStyle: "short" }).format(
    input.endsAt,
  );
  const place = input.location?.trim() || "do ustalenia / jak zwykle";
  const note = input.notes?.trim();

  const isReminder = kind === "reminder";
  const studentSubject = isReminder
    ? `Przypomnienie: lekcja jutro ${when} · GrygielGitara`
    : `Lekcja gitary: ${when} · GrygielGitara`;
  const studentIntro = isReminder
    ? "Przypominam o jutrzejszej lekcji:"
    : "Mam dla Ciebie zaplanowaną lekcję:";
  const smsPrefix = isReminder
    ? `GrygielGitara: jutro lekcja ${when}`
    : `GrygielGitara: lekcja ${when}`;

  const calendarDetails = [
    "Lekcja gitary · GrygielGitara",
    note ? `Notatka: ${note}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const googleCalendarUrl = buildGoogleCalendarUrl({
    title: `Lekcja gitary · ${input.studentName}`,
    startsAt: input.startsAt,
    endsAt: input.endsAt,
    location: place,
    details: calendarDetails,
  });
  const calendarBlock = googleCalendarButtonHtml(googleCalendarUrl);

  let emailOk = false;
  let smsOk = false;
  let teacherEmailOk = false;
  let smsSkippedReason: string | undefined;

  const settings = await getAdminSettings();

  const resend = getResend();
  const from = process.env.RESEND_FROM_EMAIL;
  if (resend && from) {
    try {
      await resend.emails.send({
        from,
        to: input.email,
        subject: studentSubject,
        html: `
          <p>Cześć ${input.studentName},</p>
          <p>${studentIntro}</p>
          <ul>
            <li><strong>Start:</strong> ${when}</li>
            <li><strong>Koniec:</strong> ${until}</li>
            <li><strong>Miejsce:</strong> ${place}</li>
          </ul>
          ${note ? `<p><strong>Notatka:</strong> ${note}</p>` : ""}
          ${calendarBlock}
          <p>Do zobaczenia!<br/>Jakub · GrygielGitara</p>
        `,
      });
      emailOk = true;
    } catch (error) {
      console.error("lesson email failed:", error);
    }
  } else {
    console.warn("lesson email skipped: missing Resend env");
  }

  const smsContent =
    `${smsPrefix} (do ${until}), miejsce: ${place}.` + (note ? ` ${note}` : "");
  if (!settings.smsEnabled) {
    smsSkippedReason = "SMS wyłączone w ustawieniach admina";
  } else if (input.phone) {
    const sms = await sendBrevoSms(input.phone, smsContent);
    smsOk = sms.ok;
    if (!sms.ok) smsSkippedReason = sms.reason;
  } else {
    smsSkippedReason = "Brak numeru telefonu ucznia";
  }

  if (input.notifyTeacher) {
    const owner = resolveNotifyEmail(settings);
    if (resend && from && owner) {
      try {
        await resend.emails.send({
          from,
          to: owner,
          subject: isReminder
            ? `Przypomnienie (Ty): lekcja jutro z ${input.studentName}`
            : `Nowa lekcja w kalendarzu: ${input.studentName}`,
          html: `
            <p>Cześć Jakub,</p>
            <p>${isReminder ? "Jutro masz lekcję:" : "Dodałeś lekcję:"}</p>
            <ul>
              <li><strong>Uczeń:</strong> ${input.studentName}</li>
              <li><strong>E-mail:</strong> ${input.email}</li>
              <li><strong>Telefon:</strong> ${input.phone || "—"}</li>
              <li><strong>Start:</strong> ${when}</li>
              <li><strong>Koniec:</strong> ${until}</li>
              <li><strong>Miejsce:</strong> ${place}</li>
            </ul>
            ${note ? `<p><strong>Notatka dla ucznia:</strong> ${note}</p>` : ""}
            ${calendarBlock}
          `,
        });
        teacherEmailOk = true;
      } catch (error) {
        console.error("teacher lesson email failed:", error);
      }
    }

    const teacherPhone =
      settings.teacherPhone.trim() || process.env.TEACHER_PHONE?.trim() || "";
    if (teacherPhone && isReminder && settings.smsEnabled) {
      await sendBrevoSms(
        teacherPhone,
        `GrygielGitara: jutro ${when} · ${input.studentName} · ${place}`,
      );
    }
  }

  return { emailOk, smsOk, teacherEmailOk, smsSkippedReason };
}

function explainBrevoSmsError(status: number, body: string): string {
  try {
    const parsed = JSON.parse(body) as { code?: string; message?: string };
    const message = parsed.message ?? "";
    if (message.toLowerCase().includes("no sms related addons")) {
      return "konto Brevo nie ma włączonego SMS (trzeba doładować/aktywować SMS w Brevo)";
    }
    if (status === 402 || parsed.code === "not_enough_credits") {
      return "brak kredytów SMS w Brevo";
    }
    if (message) return message;
  } catch {
    // fall through
  }
  return `Brevo SMS ${status}`;
}
