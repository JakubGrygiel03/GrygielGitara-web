"use server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  lessonPackageById,
  lessonPackageIds,
  type LessonPackageId,
} from "@/lib/lesson-packages";
import { createAdminClient } from "@/lib/supabase/admin";

export async function markContactRead(id: string): Promise<{ ok: boolean }> {
  if (!(await isAdminAuthenticated())) {
    return { ok: false };
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("contact_messages")
      .update({ is_read: true })
      .eq("id", id);

    if (error) {
      console.error("markContactRead failed:", error.message);
      return { ok: false };
    }

    return { ok: true };
  } catch (error) {
    console.error("markContactRead error:", error);
    return { ok: false };
  }
}

export async function updateBookingStatus(
  id: string,
  status: "pending" | "confirmed" | "cancelled" | "completed",
): Promise<{ ok: boolean }> {
  if (!(await isAdminAuthenticated())) {
    return { ok: false };
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error("updateBookingStatus failed:", error.message);
      return { ok: false };
    }

    return { ok: true };
  } catch (error) {
    console.error("updateBookingStatus error:", error);
    return { ok: false };
  }
}

export async function updateBookingInterestPackage(
  id: string,
  interestPackage: (typeof lessonPackageIds)[number] | "",
): Promise<{ ok: boolean; message: string }> {
  if (!(await isAdminAuthenticated())) {
    return { ok: false, message: "Brak autoryzacji." };
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("bookings")
      .update({
        interest_package: interestPackage || null,
      })
      .eq("id", id);

    if (error) {
      return {
        ok: false,
        message: error.message.includes("interest_package")
          ? "Odpal migrację 20260326_booking_interest_package.sql"
          : error.message,
      };
    }
    return { ok: true, message: "Pakiet w rezerwacji zapisany." };
  } catch {
    return { ok: false, message: "Nie udało się zapisać pakietu." };
  }
}

/**
 * One-click: booking → student (+ karnet when package has multiple lessons).
 * Marks booking as confirmed. Reuses existing student matched by e-mail.
 */
export async function convertBookingToStudent(
  bookingId: string,
): Promise<{ ok: boolean; message: string; studentId?: string }> {
  if (!(await isAdminAuthenticated())) {
    return { ok: false, message: "Brak autoryzacji." };
  }

  try {
    const supabase = createAdminClient();
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select(
        "id, student_name, email, phone, location_type, interest_package, preferred_day, favorite_song, message, status",
      )
      .eq("id", bookingId)
      .maybeSingle();

    if (bookingError || !booking) {
      return { ok: false, message: "Nie znaleziono rezerwacji." };
    }

    const email = booking.email.trim().toLowerCase();
    const fullName = booking.student_name.trim();
    if (fullName.length < 2 || !email.includes("@")) {
      return { ok: false, message: "Rezerwacja bez poprawnego imienia/e-maila." };
    }

    const pkgId =
      booking.interest_package &&
      (lessonPackageIds as readonly string[]).includes(booking.interest_package)
        ? (booking.interest_package as LessonPackageId)
        : null;
    const pkg = pkgId ? lessonPackageById[pkgId] : null;

    const defaultLocation =
      booking.location_type || pkg?.locationType || null;

    const noteParts = [
      booking.preferred_day
        ? `Preferowany termin: ${booking.preferred_day}`
        : null,
      booking.favorite_song
        ? `Ulubiony utwór: ${booking.favorite_song}`
        : null,
      booking.message ? `Wiadomość z rezerwacji: ${booking.message}` : null,
      `Z rezerwacji ${booking.id.slice(0, 8)}`,
    ].filter(Boolean);

    const { data: existing } = await supabase
      .from("students")
      .select("id, phone, default_location, interest_package, notes")
      .eq("email", email)
      .maybeSingle();

    let studentId = existing?.id;
    let createdNew = false;

    if (studentId && existing) {
      const { error: updateError } = await supabase
        .from("students")
        .update({
          full_name: fullName,
          phone: booking.phone?.trim() || existing.phone,
          default_location: defaultLocation || existing.default_location,
          interest_package: pkgId || existing.interest_package,
          notes: [existing.notes, noteParts.join(" · ")]
            .filter(Boolean)
            .join("\n"),
        })
        .eq("id", studentId);

      if (updateError) {
        return { ok: false, message: updateError.message };
      }
    } else {
      const { data: inserted, error: insertError } = await supabase
        .from("students")
        .insert({
          full_name: fullName,
          email,
          phone: booking.phone?.trim() || null,
          default_location: defaultLocation,
          interest_package: pkgId,
          notes: noteParts.join(" · "),
        })
        .select("id")
        .single();

      if (insertError || !inserted) {
        return {
          ok: false,
          message: insertError?.message ?? "Nie udało się dodać ucznia.",
        };
      }
      studentId = inserted.id;
      createdNew = true;
    }

    let packageNote = "";
    if (pkg && pkg.totalLessons >= 2) {
      const { data: activePkg } = await supabase
        .from("student_packages")
        .select("id")
        .eq("student_id", studentId)
        .eq("active", true)
        .eq("label", pkg.name)
        .maybeSingle();

      if (!activePkg) {
        const { error: pkgError } = await supabase
          .from("student_packages")
          .insert({
            student_id: studentId,
            label: pkg.name,
            total_lessons: pkg.totalLessons,
            remaining_lessons: pkg.totalLessons,
            active: true,
          });
        if (pkgError) {
          return {
            ok: false,
            message: `Uczeń zapisany, ale pakiet nie: ${pkgError.message}`,
            studentId,
          };
        }
        packageNote = ` + karnet ${pkg.totalLessons} lekcji`;
      } else {
        packageNote = " (karnet już aktywny)";
      }
    }

    if (booking.status === "pending") {
      await supabase
        .from("bookings")
        .update({ status: "confirmed" })
        .eq("id", bookingId);
    }

    return {
      ok: true,
      studentId,
      message: createdNew
        ? `Uczeń dodany${packageNote}. Ustaw termin w „Lekcje”.`
        : `Uczeń już był — uzupełniono dane${packageNote}.`,
    };
  } catch (error) {
    console.error("convertBookingToStudent error:", error);
    return { ok: false, message: "Nie udało się dodać ucznia z rezerwacji." };
  }
}
