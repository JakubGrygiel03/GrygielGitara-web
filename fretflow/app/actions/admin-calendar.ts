"use server";

import { randomUUID } from "crypto";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { lessonPackageIds } from "@/lib/lesson-packages";
import { notifyStudentAboutLesson } from "@/lib/notify-lesson";
import {
  consumePackageCredit,
  restorePackageCredit,
} from "@/lib/package-credits";
import { createAdminClient } from "@/lib/supabase/admin";

export type AdminMutationResult = {
  ok: boolean;
  message: string;
};

type StudentInput = {
  fullName: string;
  email: string;
  phone?: string;
  defaultLocation?: string;
  interestPackage?: string;
  notes?: string;
};

function parseStudentInput(input: StudentInput) {
  const fullName = input.fullName.trim();
  const email = input.email.trim().toLowerCase();
  if (fullName.length < 2 || !email.includes("@")) {
    return null;
  }
  const pkg = input.interestPackage?.trim() || "";
  const interest_package =
    pkg && (lessonPackageIds as readonly string[]).includes(pkg) ? pkg : null;
  return {
    full_name: fullName,
    email,
    phone: input.phone?.trim() || null,
    default_location: input.defaultLocation?.trim() || null,
    interest_package,
    notes: input.notes?.trim() || null,
  };
}

function addWeeks(date: Date, weeks: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + weeks * 7);
  return next;
}

export async function createStudent(
  input: StudentInput,
): Promise<AdminMutationResult> {
  if (!(await isAdminAuthenticated())) {
    return { ok: false, message: "Brak autoryzacji." };
  }

  const row = parseStudentInput(input);
  if (!row) {
    return { ok: false, message: "Podaj imię i poprawny e-mail." };
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("students").insert(row);

    if (error) {
      console.error("createStudent failed:", error.message);
      return { ok: false, message: error.message };
    }

    return { ok: true, message: "Uczeń dodany." };
  } catch (error) {
    console.error("createStudent error:", error);
    return {
      ok: false,
      message:
        "Brak tabeli students? Odpal migrację 20260326_students_lessons.sql",
    };
  }
}

export async function updateStudent(
  id: string,
  input: StudentInput,
): Promise<AdminMutationResult> {
  if (!(await isAdminAuthenticated())) {
    return { ok: false, message: "Brak autoryzacji." };
  }

  const row = parseStudentInput(input);
  if (!row) {
    return { ok: false, message: "Podaj imię i poprawny e-mail." };
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("students").update(row).eq("id", id);

    if (error) {
      console.error("updateStudent failed:", error.message);
      return { ok: false, message: error.message };
    }

    return { ok: true, message: "Dane ucznia zapisane." };
  } catch (error) {
    console.error("updateStudent error:", error);
    return { ok: false, message: "Nie udało się zapisać ucznia." };
  }
}

export async function deleteStudent(id: string): Promise<AdminMutationResult> {
  if (!(await isAdminAuthenticated())) {
    return { ok: false, message: "Brak autoryzacji." };
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("students").delete().eq("id", id);
    if (error) {
      return { ok: false, message: error.message };
    }
    return { ok: true, message: "Uczeń usunięty." };
  } catch (error) {
    console.error("deleteStudent error:", error);
    return { ok: false, message: "Nie udało się usunąć ucznia." };
  }
}

export async function createLesson(input: {
  studentId: string;
  startsAt: string;
  endsAt: string;
  location?: string;
  notes?: string;
  includeNotes: boolean;
  sendNotify: boolean;
  /** When notifying (or forced), consume 1 from active package. */
  consumeFromPackage: boolean;
  recurring: boolean;
  /** Total occurrences including the first (1–26). */
  weeksCount?: number;
}): Promise<AdminMutationResult> {
  if (!(await isAdminAuthenticated())) {
    return { ok: false, message: "Brak autoryzacji." };
  }

  const startsAt = new Date(input.startsAt);
  const endsAt = new Date(input.endsAt);
  if (Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime())) {
    return { ok: false, message: "Nieprawidłowa data lekcji." };
  }
  if (endsAt <= startsAt) {
    return { ok: false, message: "Koniec lekcji musi być po starcie." };
  }

  const occurrences = input.recurring
    ? Math.min(26, Math.max(2, Math.floor(input.weeksCount ?? 4)))
    : 1;
  const notes =
    input.includeNotes && input.notes?.trim() ? input.notes.trim() : null;
  const location = input.location?.trim() || null;
  const durationMs = endsAt.getTime() - startsAt.getTime();

  try {
    const supabase = createAdminClient();

    const { data: student, error: studentError } = await supabase
      .from("students")
      .select("id, full_name, email, phone")
      .eq("id", input.studentId)
      .maybeSingle();

    if (studentError || !student) {
      return { ok: false, message: "Nie znaleziono ucznia." };
    }

    const seriesId = occurrences > 1 ? randomUUID() : null;
    const rows = Array.from({ length: occurrences }, (_, index) => {
      const start = addWeeks(startsAt, index);
      const end = new Date(start.getTime() + durationMs);
      return {
        student_id: student.id,
        starts_at: start.toISOString(),
        ends_at: end.toISOString(),
        location,
        notes,
        notify_sent: false,
        reminder_sent: false,
        series_id: seriesId,
      };
    });

    const { data: inserted, error } = await supabase
      .from("lessons")
      .insert(rows)
      .select("id, starts_at");

    if (error || !inserted?.length) {
      console.error("createLesson failed:", error?.message);
      return {
        ok: false,
        message:
          error?.message ||
          "Nie udało się dodać lekcji. Sprawdź migrację SQL (recurring/reminders).",
      };
    }

    let notifySuffix = "";
    let packageSuffix = "";

    const shouldConsume =
      input.consumeFromPackage && (input.sendNotify || !input.recurring);

    if (shouldConsume) {
      const consumed = await consumePackageCredit(
        supabase,
        student.id,
        inserted[0].id,
      );
      if (consumed.ok) {
        packageSuffix = ` Pakiet „${consumed.label}”: zostało ${consumed.remaining}.`;
      } else {
        packageSuffix = ` (pakiet: ${consumed.reason})`;
      }
    }

    if (input.sendNotify) {
      const notify = await notifyStudentAboutLesson({
        studentName: student.full_name,
        email: student.email,
        phone: student.phone,
        startsAt,
        endsAt,
        location: location ?? undefined,
        notes: notes ?? undefined,
        kind: "created",
      });

      if (notify.emailOk || notify.smsOk) {
        await supabase
          .from("lessons")
          .update({ notify_sent: true })
          .eq("id", inserted[0].id);
      }

      const parts = [
        notify.emailOk ? "e-mail OK" : "e-mail nie wyszedł",
        notify.smsOk
          ? "SMS OK"
          : `SMS: ${notify.smsSkippedReason || "nie wysłano"}`,
      ];
      notifySuffix = ` Powiadomienie (1. termin): ${parts.join(", ")}.`;
    }

    if (occurrences > 1) {
      return {
        ok: true,
        message: `Dodano cykl: ${occurrences} lekcji co tydzień.${notifySuffix}${packageSuffix} Przypomnienia dzień wcześniej o 12:00.`,
      };
    }

    return {
      ok: true,
      message: input.sendNotify
        ? `Lekcja dodana.${notifySuffix}${packageSuffix}`
        : `Lekcja dodana.${packageSuffix} Przypomnienie dzień wcześniej o 12:00.`,
    };
  } catch (error) {
    console.error("createLesson error:", error);
    return {
      ok: false,
      message: "Błąd serwera. Odpal migrację students/lessons w Supabase.",
    };
  }
}

export async function deleteLesson(id: string): Promise<AdminMutationResult> {
  if (!(await isAdminAuthenticated())) {
    return { ok: false, message: "Brak autoryzacji." };
  }

  try {
    const supabase = createAdminClient();
    await restorePackageCredit(supabase, id);
    const { error } = await supabase.from("lessons").delete().eq("id", id);
    if (error) {
      return { ok: false, message: error.message };
    }
    return { ok: true, message: "Lekcja usunięta (kredyt pakietu przywrócony, jeśli był)." };
  } catch (error) {
    console.error("deleteLesson error:", error);
    return { ok: false, message: "Nie udało się usunąć." };
  }
}

/** Lesson did not happen — restore package credit without deleting the row. */
export async function revertLessonPackageUse(
  lessonId: string,
): Promise<AdminMutationResult> {
  if (!(await isAdminAuthenticated())) {
    return { ok: false, message: "Brak autoryzacji." };
  }

  try {
    const supabase = createAdminClient();
    const restored = await restorePackageCredit(supabase, lessonId);
    if (!restored.ok) {
      return { ok: false, message: restored.reason };
    }
    return {
      ok: true,
      message: `Przywrócono 1 lekcję do pakietu (teraz ${restored.remaining}).`,
    };
  } catch {
    return {
      ok: false,
      message: "Odpal migrację 20260326_lesson_package_consume.sql",
    };
  }
}

export async function consumeLessonPackageNow(
  lessonId: string,
  studentId: string,
): Promise<AdminMutationResult> {
  if (!(await isAdminAuthenticated())) {
    return { ok: false, message: "Brak autoryzacji." };
  }

  try {
    const supabase = createAdminClient();
    const consumed = await consumePackageCredit(supabase, studentId, lessonId);
    if (!consumed.ok) {
      return { ok: false, message: consumed.reason };
    }
    return {
      ok: true,
      message: `Zużyto 1 z „${consumed.label}”. Zostało ${consumed.remaining}.`,
    };
  } catch {
    return {
      ok: false,
      message: "Odpal migrację 20260326_lesson_package_consume.sql",
    };
  }
}

export async function deleteLessonSeries(
  seriesId: string,
): Promise<AdminMutationResult> {
  if (!(await isAdminAuthenticated())) {
    return { ok: false, message: "Brak autoryzacji." };
  }

  try {
    const supabase = createAdminClient();
    const { data: seriesLessons } = await supabase
      .from("lessons")
      .select("id")
      .eq("series_id", seriesId);
    for (const row of seriesLessons ?? []) {
      await restorePackageCredit(supabase, row.id);
    }
    const { error, count } = await supabase
      .from("lessons")
      .delete({ count: "exact" })
      .eq("series_id", seriesId);
    if (error) {
      return { ok: false, message: error.message };
    }
    return {
      ok: true,
      message: `Usunięto cykl (${count ?? "?"} lekcji). Kredyty pakietu przywrócone gdzie trzeba.`,
    };
  } catch (error) {
    console.error("deleteLessonSeries error:", error);
    return { ok: false, message: "Nie udało się usunąć cyklu." };
  }
}
