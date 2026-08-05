import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "gg_admin_session";

function normalizeSecret(value: string): string {
  return value
    .replace(/^\uFEFF/, "")
    .trim()
    .replace(/^["']|["']$/g, "");
}

function candidateEnvPaths(): string[] {
  const cwd = process.cwd();
  return [
    path.join(cwd, ".env.local"),
    path.join(cwd, "fretflow", ".env.local"),
    path.join(cwd, "..", "fretflow", ".env.local"),
  ];
}

function readPasswordFromEnvFile(): string | null {
  if (process.env.NODE_ENV === "production") return null;

  for (const envPath of candidateEnvPaths()) {
    if (!existsSync(/* turbopackIgnore: true */ envPath)) continue;
    try {
      const text = readFileSync(
        /* turbopackIgnore: true */ envPath,
        "utf8",
      );
      const match = text.match(/^\s*ADMIN_PASSWORD\s*=\s*(.*)$/m);
      if (!match) continue;
      const password = normalizeSecret(match[1] ?? "");
      if (password) return password;
    } catch {
      // try next path
    }
  }
  return null;
}

function getAdminPassword(): string | null {
  // In dev, prefer .env.local on disk (avoids stale process.env after edits).
  const fromFile = readPasswordFromEnvFile();
  if (fromFile) return fromFile;

  const raw = process.env.ADMIN_PASSWORD;
  if (!raw) return null;
  return normalizeSecret(raw) || null;
}

function digest(value: string): Buffer {
  return createHash("sha256").update(value, "utf8").digest();
}

export function createAdminSessionToken(): string | null {
  const password = getAdminPassword();
  if (!password) return null;
  return createHmac("sha256", password)
    .update("grygielgitara-admin-v1")
    .digest("hex");
}

export function verifyAdminPassword(input: string): boolean {
  const password = getAdminPassword();
  if (!password) return false;

  const a = digest(normalizeSecret(input));
  const b = digest(password);
  return timingSafeEqual(a, b);
}

export function verifyAdminSessionToken(token: string | undefined): boolean {
  const expected = createAdminSessionToken();
  if (!expected || !token) return false;

  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return verifyAdminSessionToken(cookieStore.get(ADMIN_COOKIE)?.value);
}

export function getAdminPasswordDebug(): {
  configured: boolean;
  envLength: number;
} {
  const password = getAdminPassword();
  return {
    configured: Boolean(password),
    envLength: password?.length ?? 0,
  };
}
