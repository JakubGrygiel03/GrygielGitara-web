"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, type ComponentProps, type MouseEvent } from "react";

function parseHashHref(href: string): { path: string; hash: string } | null {
  const hashIndex = href.indexOf("#");
  if (hashIndex === -1) return null;
  const path = href.slice(0, hashIndex) || "/";
  const hash = href.slice(hashIndex + 1);
  if (!hash) return null;
  return { path, hash };
}

function pathsMatch(linkPath: string, pathname: string) {
  return linkPath === pathname || (linkPath === "/" && pathname === "/");
}

function scrollToId(hash: string) {
  const el = document.getElementById(hash);
  if (!el) return false;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  return true;
}

/** Scroll to URL hash after client navigations (e.g. /sklep → /#materialy). */
export function HashScrollOnLoad() {
  const pathname = usePathname();

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash) return;
    const id = window.setTimeout(() => {
      scrollToId(hash);
    }, 50);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return null;
}

/**
 * Same-page hash links that keep working on every click
 * (Next.js Link otherwise skips scroll when the URL is unchanged).
 */
export function HashLink({
  href,
  onClick,
  ...props
}: ComponentProps<typeof Link>) {
  const pathname = usePathname();
  const hrefString = typeof href === "string" ? href : null;
  const parsed = hrefString ? parseHashHref(hrefString) : null;

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || !parsed || !hrefString) return;
    if (!pathsMatch(parsed.path, pathname)) return;

    event.preventDefault();
    if (scrollToId(parsed.hash)) {
      const url =
        parsed.path === "/"
          ? `/#${parsed.hash}`
          : `${parsed.path}#${parsed.hash}`;
      window.history.pushState(null, "", url);
    } else {
      window.location.assign(hrefString);
    }
  };

  return <Link href={href} onClick={handleClick} {...props} />;
}
