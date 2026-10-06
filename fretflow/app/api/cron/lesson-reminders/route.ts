import { NextRequest, NextResponse } from "next/server";

import { runLessonReminders } from "@/lib/lesson-reminders";
import { pingSupabaseKeepAlive } from "@/lib/supabase-keepalive";

function isAuthorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;

  const auth = request.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

async function handle(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  // Always touch the DB — reminder window often skips without a query.
  const keepAlive = await pingSupabaseKeepAlive();

  const force = request.nextUrl.searchParams.get("force") === "1";
  const result = await runLessonReminders({ force });
  return NextResponse.json(
    { ...result, keepAlive },
    { status: result.ok && keepAlive.ok ? 200 : 500 },
  );
}

export async function GET(request: NextRequest) {
  return handle(request);
}

export async function POST(request: NextRequest) {
  return handle(request);
}
