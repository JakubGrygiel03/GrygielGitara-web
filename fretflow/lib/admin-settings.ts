import { createAdminClient } from "@/lib/supabase/admin";

export type AdminSettings = {
  smsEnabled: boolean;
  bookingPaused: boolean;
  bookingPausedMessage: string;
  notifyEmail: string;
  teacherPhone: string;
};

export const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  smsEnabled: true,
  bookingPaused: false,
  bookingPausedMessage:
    "Chwilowo wstrzymane zapisy na nowe lekcje. Napisz na kontakt — odpiszę, gdy wrócę.",
  notifyEmail: "",
  teacherPhone: "",
};

function asBool(value: unknown, fallback: boolean) {
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
}

function asString(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

export async function getAdminSettings(): Promise<AdminSettings> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.from("admin_settings").select("key, value");
    if (error || !data) return { ...DEFAULT_ADMIN_SETTINGS };

    const map = new Map(data.map((row) => [row.key, row.value]));
    return {
      smsEnabled: asBool(map.get("sms_enabled"), DEFAULT_ADMIN_SETTINGS.smsEnabled),
      bookingPaused: asBool(
        map.get("booking_paused"),
        DEFAULT_ADMIN_SETTINGS.bookingPaused,
      ),
      bookingPausedMessage: asString(
        map.get("booking_paused_message"),
        DEFAULT_ADMIN_SETTINGS.bookingPausedMessage,
      ),
      notifyEmail: asString(map.get("notify_email"), "").trim(),
      teacherPhone: asString(map.get("teacher_phone"), "").trim(),
    };
  } catch {
    return { ...DEFAULT_ADMIN_SETTINGS };
  }
}

export async function saveAdminSettings(
  settings: AdminSettings,
): Promise<{ ok: boolean; message: string }> {
  try {
    const supabase = createAdminClient();
    const rows = [
      { key: "sms_enabled", value: settings.smsEnabled },
      { key: "booking_paused", value: settings.bookingPaused },
      {
        key: "booking_paused_message",
        value: settings.bookingPausedMessage.trim() || DEFAULT_ADMIN_SETTINGS.bookingPausedMessage,
      },
      { key: "notify_email", value: settings.notifyEmail.trim() },
      { key: "teacher_phone", value: settings.teacherPhone.trim() },
    ].map((row) => ({
      ...row,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase.from("admin_settings").upsert(rows);
    if (error) return { ok: false, message: error.message };
    return { ok: true, message: "Ustawienia zapisane." };
  } catch {
    return {
      ok: false,
      message: "Brak tabeli admin_settings? Odpal 20260326_admin_ops.sql",
    };
  }
}

/** Effective owner inbox: settings override, else CONTACT_TO_EMAIL. */
export function resolveNotifyEmail(settings: AdminSettings) {
  return (
    settings.notifyEmail.trim() ||
    process.env.CONTACT_TO_EMAIL?.trim() ||
    ""
  );
}
