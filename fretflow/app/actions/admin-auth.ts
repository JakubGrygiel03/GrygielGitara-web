"use server";

import { cookies } from "next/headers";

import {
  ADMIN_COOKIE,
  createAdminSessionToken,
  getAdminPasswordDebug,
  verifyAdminPassword,
} from "@/lib/admin-auth";

export type AdminAuthState = {
  ok: boolean;
  message: string;
};

export async function loginAdmin(password: string): Promise<AdminAuthState> {
  const debug = getAdminPasswordDebug();

  if (!debug.configured) {
    return {
      ok: false,
      message: "Ustaw ADMIN_PASSWORD w .env.local i zrestartuj serwer (npm run dev).",
    };
  }

  if (!verifyAdminPassword(password)) {
    const inputLen = password.trim().length;
    return {
      ok: false,
      message:
        process.env.NODE_ENV === "development"
          ? `Nieprawidłowe hasło. (z .env.local: ${debug.envLength} znaków, wpisano: ${inputLen})`
          : "Nieprawidłowe hasło.",
    };
  }

  const token = createAdminSessionToken();
  if (!token) {
    return { ok: false, message: "Nie udało się utworzyć sesji." };
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return { ok: true, message: "Zalogowano." };
}

export async function logoutAdmin(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
}
