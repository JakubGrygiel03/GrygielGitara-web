"use server";

import { randomUUID } from "node:crypto";

import { getAdminSettings } from "@/lib/admin-settings";
import { sendBookingEmails } from "@/lib/resend";
import { createClient } from "@/lib/supabase/server";
import {
  bookingFormSchema,
  type BookingFormValues,
} from "@/lib/validations/booking";

export type BookingActionState = {
  ok: boolean;
  message: string;
  fieldErrors?: Partial<Record<keyof BookingFormValues, string[]>>;
};

export async function submitBookingForm(
  values: BookingFormValues,
): Promise<BookingActionState> {
  const settings = await getAdminSettings();
  if (settings.bookingPaused) {
    return {
      ok: false,
      message:
        settings.bookingPausedMessage ||
        "Zapisy są chwilowo wstrzymane. Napisz przez kontakt.",
    };
  }

  const parsed = bookingFormSchema.safeParse(values);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Sprawdź pola formularza i spróbuj ponownie.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const {
    studentName,
    email,
    phone,
    locationType,
    interestPackage,
    preferredDay,
    favoriteSong,
    hasInstrument,
    message,
  } = parsed.data;

  const token = randomUUID();
  const supabase = await createClient();

  const { error } = await supabase.from("bookings").insert({
    token,
    student_name: studentName,
    email,
    phone,
    location_type: locationType,
    interest_package: interestPackage,
    preferred_day: preferredDay || null,
    favorite_song: favoriteSong || null,
    has_instrument: hasInstrument,
    status: "pending",
    message: message || null,
  });

  if (error) {
    console.error("bookings insert failed:", error.message, error);
    return {
      ok: false,
      message:
        error.code === "42501"
          ? "Baza nie ma uprawnień INSERT. Odpal w Supabase SQL Editor plik supabase/migrations/20260325_phase1_grants.sql"
          : error.message.includes("interest_package")
            ? "Odpal migrację supabase/migrations/20260326_booking_interest_package.sql"
            : "Nie udało się wysłać zgłoszenia. Spróbuj za chwilę.",
    };
  }

  // Booking is transactional — marketing list only via free guide with consent.
  try {
    await sendBookingEmails({
      studentName,
      email,
      phone,
      locationType,
      interestPackage,
      preferredDay: preferredDay || undefined,
      favoriteSong: favoriteSong || undefined,
      hasInstrument,
      message: message || undefined,
      token,
    });
  } catch (mailError) {
    console.error("booking email failed:", mailError);
  }

  return {
    ok: true,
    message:
      "Zgłoszenie wysłane. Na maila leci potwierdzenie — odezwę się w sprawie terminu.",
  };
}
