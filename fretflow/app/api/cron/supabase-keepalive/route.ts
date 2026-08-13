import { NextRequest, NextResponse } from "next/server";

import { pingSupabaseKeepAlive } from "@/lib/supabase-keepalive";

function isAuthorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;

  const auth = request.headers.get("authorization");
  if (auth === `Bearer ${secret}`) return true;

  const query = request.nextUrl.searchParams.get("secret");
  return query === secret;
}

async function handle(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const result = await pingSupabaseKeepAlive();
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}

export async function GET(request: NextRequest) {
  return handle(request);
}

export async function POST(request: NextRequest) {
  return handle(request);
}
