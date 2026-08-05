import { NextResponse } from "next/server";

import { getSiteUrl } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next")?.startsWith("/")
    ? searchParams.get("next")!
    : "/moje-kursy";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const base = getSiteUrl() || origin;
      return NextResponse.redirect(`${base}${next}`);
    }
  }

  const base = getSiteUrl() || origin;
  return NextResponse.redirect(
    `${base}/moje-kursy/login?error=auth`,
  );
}
