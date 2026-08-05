import { createAdminClient } from "@/lib/supabase/admin";

export type LinkedStudent = {
  id: string;
  full_name: string;
  email: string;
  user_id: string | null;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

/**
 * Find student row by auth user id or e-mail, then set user_id if missing.
 * Tolerates missing user_id column (asks for migration) and case/whitespace in e-mail.
 */
export async function resolveStudentForAuthUser(input: {
  userId: string;
  email: string;
}): Promise<
  | { ok: true; student: LinkedStudent }
  | {
      ok: false;
      reason: "no_student" | "taken" | "migration" | "error";
      message: string;
    }
> {
  const email = normalizeEmail(input.email);
  const admin = createAdminClient();

  // 1) Already linked
  const byUser = await admin
    .from("students")
    .select("id, full_name, email, user_id")
    .eq("user_id", input.userId)
    .maybeSingle();

  if (!byUser.error && byUser.data) {
    return { ok: true, student: byUser.data };
  }

  const userIdMissing =
    !!byUser.error?.message &&
    (byUser.error.message.includes("user_id") ||
      byUser.error.message.toLowerCase().includes("column"));

  // 2) Match by e-mail (exact lowercased — emails are stored lowercased)
  let student: LinkedStudent | null = null;
  let selectError: string | null = null;

  if (userIdMissing) {
    const fallback = await admin
      .from("students")
      .select("id, full_name, email")
      .eq("email", email)
      .maybeSingle();
    if (fallback.error) {
      selectError = fallback.error.message;
    } else if (fallback.data) {
      student = { ...fallback.data, user_id: null };
    }
  } else {
    const byEmail = await admin
      .from("students")
      .select("id, full_name, email, user_id")
      .eq("email", email)
      .maybeSingle();

    if (byEmail.error) {
      selectError = byEmail.error.message;
    } else {
      student = byEmail.data;
    }

    // Fallback: case / stray spaces in older rows
    if (!student && !byEmail.error) {
      const loose = await admin
        .from("students")
        .select("id, full_name, email, user_id");
      if (!loose.error && loose.data) {
        student =
          loose.data.find(
            (row) => normalizeEmail(row.email) === email,
          ) ?? null;
      }
    }
  }

  if (selectError?.includes("user_id")) {
    return {
      ok: false,
      reason: "migration",
      message:
        "Odpal w Supabase SQL: migrations/20260326_student_portal_auth.sql (kolumna user_id).",
    };
  }

  if (selectError) {
    return { ok: false, reason: "error", message: selectError };
  }

  if (!student) {
    return {
      ok: false,
      reason: "no_student",
      message:
        "Nie ma Cię na liście uczniów pod tym e-mailem. W panelu admina e-mail musi być dokładnie taki sam jak przy logowaniu.",
    };
  }

  if (student.user_id && student.user_id !== input.userId) {
    return {
      ok: false,
      reason: "taken",
      message:
        "Ten uczeń jest już powiązany z innym kontem. W adminie kliknij „Nowe hasło tymczasowe” albo wyczyść powiązanie.",
    };
  }

  if (!student.user_id && !userIdMissing) {
    const { error: linkError } = await admin
      .from("students")
      .update({ user_id: input.userId })
      .eq("id", student.id);

    if (linkError) {
      const lower = linkError.message.toLowerCase();
      if (lower.includes("column") || lower.includes("schema cache")) {
        return {
          ok: false,
          reason: "migration",
          message:
            "Brak kolumny user_id. Odpal w Supabase: FIX_student_portal_user_id.sql",
        };
      }
      return { ok: false, reason: "error", message: linkError.message };
    }
    student = { ...student, user_id: input.userId };
  }

  // Normalize e-mail on the row if it wasn't lowercase
  if (normalizeEmail(student.email) !== student.email) {
    await admin
      .from("students")
      .update({ email })
      .eq("id", student.id);
  }

  return { ok: true, student };
}
