import { NextResponse } from "next/server";

import { getSiteUrl } from "@/lib/env";
import {
  unsubscribeEmail,
  UNSUBSCRIBE_PATH,
  verifyUnsubscribeToken,
} from "@/lib/newsletter-unsubscribe";

function readParams(request: Request, form?: FormData | null) {
  const url = new URL(request.url);
  const email =
    url.searchParams.get("email")?.trim() ||
    (typeof form?.get("email") === "string" ? String(form.get("email")) : "");
  const token =
    url.searchParams.get("token")?.trim() ||
    (typeof form?.get("token") === "string" ? String(form.get("token")) : "");
  return { email, token };
}

/** One-click unsubscribe (RFC 8058) used by Gmail / Outlook buttons. */
export async function POST(request: Request) {
  let form: FormData | null = null;
  try {
    form = await request.formData();
  } catch {
    form = null;
  }
  const { email, token } = readParams(request, form);
  if (!email || !verifyUnsubscribeToken(email, token)) {
    return new NextResponse("Invalid unsubscribe link", { status: 400 });
  }
  await unsubscribeEmail(email);
  return new NextResponse(null, { status: 200 });
}

export async function GET(request: Request) {
  const { email, token } = readParams(request);
  const dest = new URL(UNSUBSCRIBE_PATH, getSiteUrl());
  if (email) dest.searchParams.set("email", email);
  if (token) dest.searchParams.set("token", token);
  return NextResponse.redirect(dest, 302);
}
