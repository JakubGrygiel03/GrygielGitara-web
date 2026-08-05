/** Canonical site origin for Auth redirects (no trailing slash). */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    const cleaned = explicit.replace(/\/$/, "");
    // Never ship production Auth redirects to localhost by mistake
    const onVercel = Boolean(process.env.VERCEL_URL);
    if (onVercel && cleaned.includes("localhost")) {
      const vercel = process.env.VERCEL_URL!.trim();
      return vercel.startsWith("http")
        ? vercel.replace(/\/$/, "")
        : `https://${vercel}`;
    }
    return cleaned;
  }

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    return vercel.startsWith("http") ? vercel.replace(/\/$/, "") : `https://${vercel}`;
  }

  return "http://localhost:3000";
}

/**
 * Prefer the host of the current request (Vercel domain) over env,
 * so password-reset emails never point at localhost from production.
 */
export async function getRequestSiteUrl(): Promise<string> {
  try {
    const { headers } = await import("next/headers");
    const h = await headers();
    const host = h.get("x-forwarded-host") ?? h.get("host");
    const proto = h.get("x-forwarded-proto") ?? "https";
    if (host && !host.includes("localhost") && !host.startsWith("127.")) {
      return `${proto}://${host}`.replace(/\/$/, "");
    }
  } catch {
    // outside a request context
  }
  return getSiteUrl();
}

/**
 * Central place for public Supabase env vars.
 * Prefer PUBLISHABLE_KEY (new dashboard name); fall back to ANON_KEY.
 */
export function getSupabaseEnvOptional(): { url: string; key: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return null;
  }

  return { url, key };
}

export function getSupabaseEnv(): { url: string; key: string } {
  const env = getSupabaseEnvOptional();

  if (!env) {
    throw new Error(
      "Missing Supabase env: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or ANON_KEY).",
    );
  }

  return env;
}
