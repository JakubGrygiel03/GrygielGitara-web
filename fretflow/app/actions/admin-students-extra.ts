"use server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function createStudentPackage(input: {
  studentId: string;
  label: string;
  totalLessons: number;
}): Promise<{ ok: boolean; message: string }> {
  if (!(await isAdminAuthenticated())) {
    return { ok: false, message: "Brak autoryzacji." };
  }
  const total = Math.floor(input.totalLessons);
  if (!input.studentId || total < 1 || total > 100) {
    return { ok: false, message: "Podaj ucznia i liczbę lekcji (1–100)." };
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("student_packages").insert({
      student_id: input.studentId,
      label: input.label.trim() || "Pakiet lekcji",
      total_lessons: total,
      remaining_lessons: total,
      active: true,
    });
    if (error) return { ok: false, message: error.message };
    return { ok: true, message: "Pakiet dodany." };
  } catch {
    return { ok: false, message: "Odpal migrację admin_ops." };
  }
}

export async function adjustStudentPackage(
  id: string,
  delta: number,
): Promise<{ ok: boolean; message: string }> {
  if (!(await isAdminAuthenticated())) {
    return { ok: false, message: "Brak autoryzacji." };
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("student_packages")
      .select("remaining_lessons, total_lessons")
      .eq("id", id)
      .maybeSingle();
    if (error || !data) return { ok: false, message: "Nie znaleziono pakietu." };

    const next = Math.max(
      0,
      Math.min(data.total_lessons, data.remaining_lessons + delta),
    );
    const { error: updateError } = await supabase
      .from("student_packages")
      .update({ remaining_lessons: next, active: next > 0 })
      .eq("id", id);
    if (updateError) return { ok: false, message: updateError.message };
    return { ok: true, message: `Pozostało ${next} lekcji w pakiecie.` };
  } catch {
    return { ok: false, message: "Nie udało się zaktualizować pakietu." };
  }
}

export async function addStudentMaterial(input: {
  studentId: string;
  title: string;
  url: string;
}): Promise<{ ok: boolean; message: string }> {
  if (!(await isAdminAuthenticated())) {
    return { ok: false, message: "Brak autoryzacji." };
  }
  const title = input.title.trim();
  const url = input.url.trim();
  if (!input.studentId || title.length < 2 || !url.startsWith("http")) {
    return { ok: false, message: "Podaj tytuł i pełny URL (https://…)." };
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("student_materials").insert({
      student_id: input.studentId,
      title,
      url,
    });
    if (error) return { ok: false, message: error.message };
    return { ok: true, message: "Materiał dodany." };
  } catch {
    return { ok: false, message: "Odpal migrację admin_ops." };
  }
}

export async function deleteStudentMaterial(
  id: string,
): Promise<{ ok: boolean; message: string }> {
  if (!(await isAdminAuthenticated())) {
    return { ok: false, message: "Brak autoryzacji." };
  }
  const supabase = createAdminClient();
  const { error } = await supabase.from("student_materials").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };
  return { ok: true, message: "Materiał usunięty." };
}

export async function addLessonSessionNote(input: {
  studentId: string;
  lessonId?: string;
  body: string;
}): Promise<{ ok: boolean; message: string }> {
  if (!(await isAdminAuthenticated())) {
    return { ok: false, message: "Brak autoryzacji." };
  }
  const body = input.body.trim();
  if (!input.studentId || body.length < 2) {
    return { ok: false, message: "Wpisz krótką notatkę po lekcji." };
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("lesson_session_notes").insert({
      student_id: input.studentId,
      lesson_id: input.lessonId || null,
      body,
    });
    if (error) return { ok: false, message: error.message };
    return { ok: true, message: "Notatka zapisana." };
  } catch {
    return { ok: false, message: "Odpal migrację admin_ops." };
  }
}

export async function updateLessonPayment(input: {
  lessonId: string;
  paymentStatus: "paid" | "unpaid";
  price?: string;
  consumePackage?: boolean;
}): Promise<{ ok: boolean; message: string }> {
  if (!(await isAdminAuthenticated())) {
    return { ok: false, message: "Brak autoryzacji." };
  }

  const priceRaw = input.price?.trim();
  const price =
    priceRaw === undefined || priceRaw === ""
      ? undefined
      : Number(priceRaw.replace(",", "."));
  if (price !== undefined && (Number.isNaN(price) || price < 0)) {
    return { ok: false, message: "Nieprawidłowa kwota." };
  }

  try {
    const supabase = createAdminClient();
    const patch: {
      payment_status: "paid" | "unpaid";
      price?: number | null;
    } = { payment_status: input.paymentStatus };
    if (price !== undefined) patch.price = price;

    const { data: lesson, error } = await supabase
      .from("lessons")
      .update(patch)
      .eq("id", input.lessonId)
      .select("id, student_id")
      .maybeSingle();

    if (error || !lesson) {
      return { ok: false, message: error?.message || "Brak lekcji." };
    }

    let packageMsg = "";
    if (input.paymentStatus === "paid" && input.consumePackage) {
      const { data: fullLesson } = await supabase
        .from("lessons")
        .select("package_consumed")
        .eq("id", input.lessonId)
        .maybeSingle();

      if (fullLesson?.package_consumed) {
        packageMsg = " (kredyt pakietu już był zużyty przy powiadomieniu)";
      } else {
        const { data: pkg } = await supabase
          .from("student_packages")
          .select("id, remaining_lessons")
          .eq("student_id", lesson.student_id)
          .eq("active", true)
          .gt("remaining_lessons", 0)
          .order("created_at", { ascending: true })
          .limit(1)
          .maybeSingle();

        if (pkg && pkg.remaining_lessons > 0) {
          const next = pkg.remaining_lessons - 1;
          await supabase
            .from("student_packages")
            .update({ remaining_lessons: next, active: next > 0 })
            .eq("id", pkg.id);
          await supabase
            .from("lessons")
            .update({
              package_consumed: true,
              consumed_package_id: pkg.id,
            })
            .eq("id", input.lessonId);
          packageMsg = ` Pakiet: zostało ${next}.`;
        }
      }
    }

    return {
      ok: true,
      message:
        (input.paymentStatus === "paid" ? "Oznaczono jako opłacone." : "Niewyrównana.") +
        packageMsg,
    };
  } catch {
    return { ok: false, message: "Odpal migrację admin_ops (payment_status)." };
  }
}

export async function addRevenueEntry(input: {
  category: "lesson" | "service" | "shop";
  amount: string;
  note?: string;
  occurredOn: string;
}): Promise<{ ok: boolean; message: string }> {
  if (!(await isAdminAuthenticated())) {
    return { ok: false, message: "Brak autoryzacji." };
  }
  const amount = Number(input.amount.replace(",", "."));
  if (Number.isNaN(amount) || amount === 0) {
    return { ok: false, message: "Podaj kwotę." };
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("revenue_entries").insert({
      category: input.category,
      amount,
      note: input.note?.trim() || null,
      occurred_on: input.occurredOn || new Date().toISOString().slice(0, 10),
    });
    if (error) return { ok: false, message: error.message };
    return { ok: true, message: "Wpis kasowy dodany." };
  } catch {
    return { ok: false, message: "Odpal migrację admin_ops." };
  }
}
