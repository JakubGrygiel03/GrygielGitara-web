import { type EmailOtpType } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { getSupabaseEnv } from "@/lib/env";
import type { Database } from "@/lib/supabase/types";

/**
 * Handles Supabase email template links:
 * {{ .SiteURL }}/auth/confirm?token_hash=...&type=recovery&next=/moje-kursy/ustaw-haslo
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const nextRaw = searchParams.get("next");
  const next =
    nextRaw?.startsWith("/") && !nextRaw.startsWith("//")
      ? nextRaw
      : type === "recovery"
        ? "/moje-kursy/ustaw-haslo"
        : "/moje-kursy";

  if (token_hash && type) {
    const { url, key } = getSupabaseEnv();
    const redirect = NextResponse.redirect(new URL(next, origin));

    const supabase = createServerClient<Database>(url, key, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            redirect.cookies.set(name, value, options);
          });
        },
      },
    });

    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (!error) {
      return redirect;
    }
  }

  return NextResponse.redirect(
    new URL("/moje-kursy/login?error=auth", origin),
  );
}
