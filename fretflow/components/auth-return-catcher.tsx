"use client";

import { useEffect } from "react";

/**
 * If Supabase falls back to Site URL (homepage) with ?code= or #access_token,
 * forward the user into the Auth handlers instead of leaving them on "/".
 */
export function AuthReturnCatcher() {
  useEffect(() => {
    const { pathname, search, hash } = window.location;
    if (pathname.startsWith("/auth/")) return;

    // Avoid redirect loops if auth already failed once
    const params = new URLSearchParams(search);
    if (params.get("error") === "auth") return;

    const code = params.get("code");
    if (code) {
      const type = params.get("type");
      const next =
        params.get("next") ||
        (type === "recovery" ? "/moje-kursy/ustaw-haslo" : "/moje-kursy");
      const target = new URL("/auth/callback", window.location.origin);
      target.searchParams.set("code", code);
      target.searchParams.set("next", next);
      if (type) target.searchParams.set("type", type);
      window.location.replace(target.toString());
      return;
    }

    const tokenHash = params.get("token_hash");
    const type = params.get("type");
    if (tokenHash && type) {
      const next =
        params.get("next") ||
        (type === "recovery" ? "/moje-kursy/ustaw-haslo" : "/moje-kursy");
      const target = new URL("/auth/confirm", window.location.origin);
      target.searchParams.set("token_hash", tokenHash);
      target.searchParams.set("type", type);
      target.searchParams.set("next", next);
      window.location.replace(target.toString());
      return;
    }

    if (
      hash.includes("access_token") ||
      hash.includes("type=recovery") ||
      hash.includes("type=invite")
    ) {
      // Implicit flow tokens in hash — let browser client pick them up on ustaw-haslo
      window.location.replace(
        `/moje-kursy/ustaw-haslo${hash.startsWith("#") ? hash : `#${hash}`}`,
      );
    }
  }, []);

  return null;
}
