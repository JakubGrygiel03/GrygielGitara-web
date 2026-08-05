import { NextResponse, type NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/middleware";

/**
 * Next.js 16 Proxy — refreshes Supabase Auth cookies and guards /moje-kursy.
 */
export async function proxy(request: NextRequest) {
  const { response, supabase } = await updateSession(request);
  const path = request.nextUrl.pathname;

  const isStudentArea =
    path === "/moje-kursy" || path.startsWith("/moje-kursy/");
  const isStudentPublicAuth =
    path === "/moje-kursy/login" ||
    path === "/moje-kursy/register" ||
    path === "/moje-kursy/zapomniane-haslo";

  if (isStudentArea && !isStudentPublicAuth && supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/moje-kursy/login";
      loginUrl.searchParams.set("next", path);
      const redirect = NextResponse.redirect(loginUrl);
      response.cookies.getAll().forEach((cookie) => {
        redirect.cookies.set(cookie.name, cookie.value);
      });
      return redirect;
    }
  }

  if (isStudentPublicAuth && supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const nextRaw = request.nextUrl.searchParams.get("next");
      const nextPath =
        nextRaw?.startsWith("/") && !nextRaw.startsWith("//")
          ? nextRaw
          : "/moje-kursy";
      const dest = request.nextUrl.clone();
      dest.pathname = nextPath;
      dest.search = "";
      const redirect = NextResponse.redirect(dest);
      response.cookies.getAll().forEach((cookie) => {
        redirect.cookies.set(cookie.name, cookie.value);
      });
      return redirect;
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
