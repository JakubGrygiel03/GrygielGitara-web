import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { getSupabaseEnvOptional } from "@/lib/env";
import type { Database } from "@/lib/supabase/types";

export type SessionUpdate = {
  response: NextResponse;
  supabase: ReturnType<typeof createServerClient<Database>> | null;
};

/**
 * Refreshes the Auth session cookie on each matched request.
 * Called from root `proxy.ts` (Next.js 16 network boundary).
 */
export async function updateSession(request: NextRequest): Promise<SessionUpdate> {
  let supabaseResponse = NextResponse.next({ request });

  const env = getSupabaseEnvOptional();
  if (!env) {
    return { response: supabaseResponse, supabase: null };
  }

  const { url, key } = env;

  const supabase = createServerClient<Database>(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        supabaseResponse = NextResponse.next({ request });

        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });

        Object.entries(headers).forEach(([headerKey, value]) => {
          supabaseResponse.headers.set(headerKey, value);
        });
      },
    },
  });

  // Validates JWT / rotates refresh token; do not use getSession() here.
  await supabase.auth.getClaims();

  return { response: supabaseResponse, supabase };
}
