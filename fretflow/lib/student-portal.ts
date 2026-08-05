import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type StudentPortalLesson = {
  id: string;
  starts_at: string;
  ends_at: string;
  location: string | null;
  notes: string | null;
};

export type StudentPortalMaterial = {
  id: string;
  title: string;
  url: string;
  created_at: string;
};

export type StudentPortalPackage = {
  id: string;
  label: string;
  total_lessons: number;
  remaining_lessons: number;
  active: boolean;
};

export type StudentPortalData = {
  student: {
    id: string;
    full_name: string;
    email: string;
  };
  nextLesson: StudentPortalLesson | null;
  pastLessons: StudentPortalLesson[];
  materials: StudentPortalMaterial[];
  packages: StudentPortalPackage[];
  sessionNotes: { id: string; body: string; created_at: string }[];
};

/**
 * Link auth.users → students by e-mail (service role), then load portal data under RLS.
 */
export async function loadStudentPortalData(): Promise<
  | { ok: true; data: StudentPortalData }
  | { ok: false; reason: "unauthenticated" | "no_student" | "error"; message: string }
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return {
      ok: false,
      reason: "unauthenticated",
      message: "Zaloguj się magic linkiem.",
    };
  }

  const email = user.email.trim().toLowerCase();
  const admin = createAdminClient();

  const { data: byUser } = await admin
    .from("students")
    .select("id, full_name, email, user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  let student = byUser;

  if (!student) {
    const { data: byEmail } = await admin
      .from("students")
      .select("id, full_name, email, user_id")
      .ilike("email", email)
      .maybeSingle();

    if (!byEmail) {
      return {
        ok: false,
        reason: "no_student",
        message:
          "Nie ma Cię jeszcze na liście uczniów. Napisz do nauczyciela — po dodaniu w panelu ten sam e-mail otworzy strefę.",
      };
    }

    if (byEmail.user_id && byEmail.user_id !== user.id) {
      return {
        ok: false,
        reason: "error",
        message: "To konto jest już powiązane z innym logowaniem. Napisz do nauczyciela.",
      };
    }

    if (!byEmail.user_id) {
      const { error: linkError } = await admin
        .from("students")
        .update({ user_id: user.id })
        .eq("id", byEmail.id);

      if (linkError) {
        return {
          ok: false,
          reason: "error",
          message:
            linkError.message.includes("user_id")
              ? "Odpal migrację 20260326_student_portal_auth.sql w Supabase."
              : linkError.message,
        };
      }
    }

    student = { ...byEmail, user_id: user.id };
  }

  const nowIso = new Date().toISOString();

  const [lessonsUpcoming, lessonsPast, materials, packages, notes] =
    await Promise.all([
      supabase
        .from("lessons")
        .select("id, starts_at, ends_at, location, notes")
        .eq("student_id", student.id)
        .gte("starts_at", nowIso)
        .order("starts_at", { ascending: true })
        .limit(1),
      supabase
        .from("lessons")
        .select("id, starts_at, ends_at, location, notes")
        .eq("student_id", student.id)
        .lt("starts_at", nowIso)
        .order("starts_at", { ascending: false })
        .limit(12),
      supabase
        .from("student_materials")
        .select("id, title, url, created_at")
        .eq("student_id", student.id)
        .order("created_at", { ascending: false })
        .limit(50),
      supabase
        .from("student_packages")
        .select("id, label, total_lessons, remaining_lessons, active")
        .eq("student_id", student.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("lesson_session_notes")
        .select("id, body, created_at")
        .eq("student_id", student.id)
        .order("created_at", { ascending: false })
        .limit(10),
    ]);

  const rlsError =
    lessonsUpcoming.error ||
    lessonsPast.error ||
    materials.error ||
    packages.error ||
    notes.error;

  if (rlsError) {
    // Fallback via service role if RLS/migration not applied yet
    const [lu, lp, mats, pkgs, nts] = await Promise.all([
      admin
        .from("lessons")
        .select("id, starts_at, ends_at, location, notes")
        .eq("student_id", student.id)
        .gte("starts_at", nowIso)
        .order("starts_at", { ascending: true })
        .limit(1),
      admin
        .from("lessons")
        .select("id, starts_at, ends_at, location, notes")
        .eq("student_id", student.id)
        .lt("starts_at", nowIso)
        .order("starts_at", { ascending: false })
        .limit(12),
      admin
        .from("student_materials")
        .select("id, title, url, created_at")
        .eq("student_id", student.id)
        .order("created_at", { ascending: false })
        .limit(50),
      admin
        .from("student_packages")
        .select("id, label, total_lessons, remaining_lessons, active")
        .eq("student_id", student.id)
        .order("created_at", { ascending: false }),
      admin
        .from("lesson_session_notes")
        .select("id, body, created_at")
        .eq("student_id", student.id)
        .order("created_at", { ascending: false })
        .limit(10),
    ]);

    return {
      ok: true,
      data: {
        student: {
          id: student.id,
          full_name: student.full_name,
          email: student.email,
        },
        nextLesson: lu.data?.[0] ?? null,
        pastLessons: lp.data ?? [],
        materials: mats.data ?? [],
        packages: pkgs.data ?? [],
        sessionNotes: nts.data ?? [],
      },
    };
  }

  return {
    ok: true,
    data: {
      student: {
        id: student.id,
        full_name: student.full_name,
        email: student.email,
      },
      nextLesson: lessonsUpcoming.data?.[0] ?? null,
      pastLessons: lessonsPast.data ?? [],
      materials: materials.data ?? [],
      packages: packages.data ?? [],
      sessionNotes: notes.data ?? [],
    },
  };
}
