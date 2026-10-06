import { headers } from "next/headers";

const WINDOW_MS = 15 * 60 * 1000;
const hits = new Map<string, number[]>();

function prune(now: number) {
  if (hits.size < 400) return;
  for (const [key, stamps] of hits) {
    const next = stamps.filter((t) => now - t < WINDOW_MS);
    if (next.length === 0) hits.delete(key);
    else hits.set(key, next);
  }
}

export async function getClientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first.slice(0, 64);
  }
  return h.get("x-real-ip")?.trim() || "unknown";
}

/** In-memory sliding window. Best-effort on serverless (per instance). */
export async function rateLimit(
  bucket: string,
  max: number,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const ip = await getClientIp();
  const key = `${bucket}:${ip}`;
  const now = Date.now();
  prune(now);
  const stamps = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (stamps.length >= max) {
    return {
      ok: false,
      message: "Zbyt wiele prób. Poczekaj kilka minut i spróbuj ponownie.",
    };
  }
  stamps.push(now);
  hits.set(key, stamps);
  return { ok: true };
}

export async function assertSameOrigin(): Promise<
  { ok: true } | { ok: false; message: string }
> {
  const h = await headers();
  const origin = h.get("origin");
  if (!origin) return { ok: true };

  const host = (h.get("x-forwarded-host") ?? h.get("host") ?? "")
    .split(",")[0]
    .trim();
  if (!host) return { ok: true };

  try {
    if (new URL(origin).host !== host) {
      return { ok: false, message: "Nieprawidłowe źródło żądania." };
    }
  } catch {
    return { ok: false, message: "Nieprawidłowe źródło żądania." };
  }
  return { ok: true };
}

export function isSafeHttpUrl(raw: string): boolean {
  try {
    const url = new URL(raw.trim());
    if (url.protocol === "https:") return true;
    if (
      url.protocol === "http:" &&
      (url.hostname === "localhost" || url.hostname === "127.0.0.1")
    ) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
