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
