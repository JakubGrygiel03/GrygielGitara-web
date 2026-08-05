import type { createAdminClient } from "@/lib/supabase/admin";

type AdminClient = ReturnType<typeof createAdminClient>;

/** Consume 1 credit from the oldest active package; mark lesson. */
export async function consumePackageCredit(
  supabase: AdminClient,
  studentId: string,
  lessonId: string,
): Promise<{ ok: true; remaining: number; label: string } | { ok: false; reason: string }> {
  const { data: lesson } = await supabase
    .from("lessons")
    .select("id, package_consumed")
    .eq("id", lessonId)
    .maybeSingle();

  if (lesson?.package_consumed) {
    return { ok: false, reason: "Ta lekcja już zużyła kredyt z pakietu." };
  }

  const { data: pkg } = await supabase
    .from("student_packages")
    .select("id, label, remaining_lessons")
    .eq("student_id", studentId)
    .eq("active", true)
    .gt("remaining_lessons", 0)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!pkg) {
    return { ok: false, reason: "Brak aktywnego pakietu z wolnymi lekcjami." };
  }

  const remaining = pkg.remaining_lessons - 1;
  const { error: pkgError } = await supabase
    .from("student_packages")
    .update({ remaining_lessons: remaining, active: remaining > 0 })
    .eq("id", pkg.id);

  if (pkgError) return { ok: false, reason: pkgError.message };

  const { error: lessonError } = await supabase
    .from("lessons")
    .update({
      package_consumed: true,
      consumed_package_id: pkg.id,
    })
    .eq("id", lessonId);

  if (lessonError) return { ok: false, reason: lessonError.message };

  return { ok: true, remaining, label: pkg.label };
}

/** Restore 1 credit if this lesson had consumed a package. */
export async function restorePackageCredit(
  supabase: AdminClient,
  lessonId: string,
): Promise<{ ok: true; remaining: number } | { ok: false; reason: string }> {
  const { data: lesson } = await supabase
    .from("lessons")
    .select("id, package_consumed, consumed_package_id")
    .eq("id", lessonId)
    .maybeSingle();

  if (!lesson?.package_consumed || !lesson.consumed_package_id) {
    return { ok: false, reason: "Ta lekcja nie zużyła kredytu z pakietu." };
  }

  const { data: pkg } = await supabase
    .from("student_packages")
    .select("id, remaining_lessons, total_lessons")
    .eq("id", lesson.consumed_package_id)
    .maybeSingle();

  if (pkg) {
    const remaining = Math.min(pkg.total_lessons, pkg.remaining_lessons + 1);
    await supabase
      .from("student_packages")
      .update({ remaining_lessons: remaining, active: true })
      .eq("id", pkg.id);

    await supabase
      .from("lessons")
      .update({ package_consumed: false, consumed_package_id: null })
      .eq("id", lessonId);

    return { ok: true, remaining };
  }

  await supabase
    .from("lessons")
    .update({ package_consumed: false, consumed_package_id: null })
    .eq("id", lessonId);

  return { ok: false, reason: "Pakiet usunięty — odznaczono tylko flagę lekcji." };
}
