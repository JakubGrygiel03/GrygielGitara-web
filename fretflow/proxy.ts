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
  const isStudentLogin = path === "/moje-kursy/login";

  if (isStudentArea && !isStudentLogin && supabase) {
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

  if (isStudentLogin && supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const dest = request.nextUrl.clone();
      dest.pathname = "/moje-kursy";
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
