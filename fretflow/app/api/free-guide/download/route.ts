import { NextResponse } from "next/server";

import { getFreeGuidePdfUrl, isFreeGuideOpen } from "@/lib/free-guide";

/** Starts the PDF download (redirect to Storage / local file with filename hint). */
export function GET() {
  if (!isFreeGuideOpen()) {
    return new NextResponse("Darmowy e-book jest chwilowo niedostępny.", {
      status: 404,
    });
  }

  return NextResponse.redirect(getFreeGuidePdfUrl(), 302);
}
