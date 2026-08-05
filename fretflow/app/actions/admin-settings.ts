"use server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  getAdminSettings,
  saveAdminSettings,
  type AdminSettings,
} from "@/lib/admin-settings";

export async function loadAdminSettingsAction(): Promise<AdminSettings | null> {
  if (!(await isAdminAuthenticated())) return null;
  return getAdminSettings();
}

export async function updateAdminSettingsAction(
  settings: AdminSettings,
): Promise<{ ok: boolean; message: string }> {
  if (!(await isAdminAuthenticated())) {
    return { ok: false, message: "Brak autoryzacji." };
  }
  return saveAdminSettings(settings);
}
