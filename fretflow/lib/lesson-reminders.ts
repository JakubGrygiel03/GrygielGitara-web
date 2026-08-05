import { notifyStudentAboutLesson } from "@/lib/notify-lesson";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  formatWarsawDate,
  getWarsawTomorrowDate,
  isWarsawReminderWindow,
} from "@/lib/warsaw-time";

export type ReminderRunResult = {
  ok: boolean;
  skippedReason?: string;
  processed: number;
  sent: number;
  errors: string[];
};

/**
 * At 12:00 Europe/Warsaw, email/SMS student + teacher about lessons tomorrow.
 */
export async function runLessonReminders(options?: {
  /** Bypass noon check (manual/admin test). */
  force?: boolean;
}): Promise<ReminderRunResult> {
  if (!options?.force && !isWarsawReminderWindow()) {
    return {
      ok: true,
      skippedReason: `Poza oknem przypomnień ~12:00 (Warszawa). Teraz ${new Intl.DateTimeFormat(
        "pl-PL",
        { timeZone: "Europe/Warsaw", timeStyle: "short" },
      ).format(new Date())}.`,
      processed: 0,
      sent: 0,
      errors: [],
    };
  }

  const tomorrowYmd = getWarsawTomorrowDate();
  const supabase = createAdminClient();

  // Wide UTC window around “tomorrow in Warsaw”, then filter by Warsaw date.
  const windowStart = new Date();
  windowStart.setUTCHours(windowStart.getUTCHours() - 12);
  const windowEnd = new Date();
  windowEnd.setUTCDate(windowEnd.getUTCDate() + 3);

  const { data, error } = await supabase
    .from("lessons")
    .select(
      "id, starts_at, ends_at, location, notes, reminder_sent, students(full_name, email, phone)",
    )
    .eq("reminder_sent", false)
    .gte("starts_at", windowStart.toISOString())
    .lte("starts_at", windowEnd.toISOString())
    .order("starts_at", { ascending: true });

  if (error) {
    return {
      ok: false,
      processed: 0,
      sent: 0,
      errors: [error.message],
    };
  }

  type Row = {
    id: string;
    starts_at: string;
    ends_at: string;
    location: string | null;
    notes: string | null;
    students:
      | { full_name: string; email: string; phone: string | null }
      | { full_name: string; email: string; phone: string | null }[]
      | null;
  };

  const rows = (data ?? []) as unknown as Row[];
  const targets = rows.filter(
    (row) => formatWarsawDate(new Date(row.starts_at)) === tomorrowYmd,
  );

  let sent = 0;
  const errors: string[] = [];

  for (const row of targets) {
    const student = Array.isArray(row.students)
      ? row.students[0]
      : row.students;
    if (!student) {
      errors.push(`${row.id}: brak ucznia`);
      continue;
    }

    const notify = await notifyStudentAboutLesson({
      studentName: student.full_name,
      email: student.email,
      phone: student.phone,
      startsAt: new Date(row.starts_at),
      endsAt: new Date(row.ends_at),
      location: row.location,
      notes: row.notes,
      kind: "reminder",
      notifyTeacher: true,
    });

    if (notify.emailOk || notify.smsOk || notify.teacherEmailOk) {
      const { error: updateError } = await supabase
        .from("lessons")
        .update({ reminder_sent: true })
        .eq("id", row.id);
      if (updateError) {
        errors.push(`${row.id}: ${updateError.message}`);
      } else {
        sent += 1;
      }
    } else {
      errors.push(
        `${row.id} (${student.full_name}): nie wysłano (e-mail/SMS)`,
      );
    }
  }

  return {
    ok: errors.length === 0,
    processed: targets.length,
    sent,
    errors,
  };
}
