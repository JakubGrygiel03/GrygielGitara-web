"use server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { lessonPackageIds } from "@/lib/lesson-packages";
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
