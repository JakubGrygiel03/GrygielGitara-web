"use server";

import { cookies } from "next/headers";

import {
  ADMIN_COOKIE,
  createAdminSessionToken,
  getAdminEmail,
  getAdminPasswordDebug,
  isAdminEmail,
  verifyAdminPassword,
} from "@/lib/admin-auth";

export type AdminAuthState = {
  ok: boolean;
  message: string;
  /** Email is not the admin inbox — caller should try student login instead. */
  notAdminEmail?: boolean;
};

export async function loginAdmin(input: {
  email: string;
  password: string;
}): Promise<AdminAuthState> {
  const debug = getAdminPasswordDebug();
  const adminEmail = getAdminEmail();

  // Unknown inbox → fall through to student auth (don't block /moje-kursy login).
  if (!adminEmail || !isAdminEmail(input.email)) {
    return {
      ok: false,
      message: "",
      notAdminEmail: true,
    };
  }

  if (!debug.configured) {
    return {
      ok: false,
      message:
        "Ustaw ADMIN_PASSWORD w .env.local i na Vercel, potem zrestartuj / redeploy.",
    };
  }

  if (!verifyAdminPassword(input.password)) {
    const inputLen = input.password.trim().length;
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

  return { ok: true, message: "Zalogowano do panelu." };
}

export async function logoutAdmin(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
}
