"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { mainNavLinks } from "@/lib/nav";

const SCROLL_Y_ATTR = "navScrollY";

/** Always clear body/html scroll lock (safe to call repeatedly). */
function unlockBodyScroll() {
  if (typeof document === "undefined") return;

  const html = document.documentElement;
  const body = document.body;
  const y = Number(body.dataset[SCROLL_Y_ATTR] ?? "0");

  html.style.removeProperty("overflow");
  body.style.removeProperty("overflow");
  body.style.removeProperty("position");
  body.style.removeProperty("top");
  body.style.removeProperty("left");
  body.style.removeProperty("right");
  body.style.removeProperty("width");
  body.style.removeProperty("touch-action");
  delete body.dataset[SCROLL_Y_ATTR];

  window.scrollTo(0, y);
}

function lockBodyScroll() {
  if (typeof document === "undefined") return;

  const html = document.documentElement;
  const body = document.body;

  if (body.style.position === "fixed") {
    unlockBodyScroll();
  }

  const scrollY = window.scrollY;
  body.dataset[SCROLL_Y_ATTR] = String(scrollY);
  html.style.overflow = "hidden";
  body.style.overflow = "hidden";
  body.style.position = "fixed";
  body.style.top = `-${scrollY}px`;
  body.style.left = "0";
  body.style.right = "0";
  body.style.width = "100%";
  body.style.touchAction = "none";
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Route change: always close + unlock (layout may stay mounted)
  useEffect(() => {
    setOpen(false);
    unlockBodyScroll();
  }, [pathname]);

  useEffect(() => {
    if (!open) {
      unlockBodyScroll();
      return;
    }

    lockBodyScroll();
    return () => {
      unlockBodyScroll();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        unlockBodyScroll();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  /** Unlock scroll first (sync), then close — required for Next.js Link clicks. */
  const closeMenu = () => {
    unlockBodyScroll();
    setOpen(false);
  };

  const toggleMenu = () => {
    setOpen((wasOpen) => {
      if (wasOpen) {
        unlockBodyScroll();
        return false;
      }
      return true;
    });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-sky-100/80 bg-white/95 backdrop-blur-md">
      <div className="relative z-[60] flex h-[4.5rem] w-full items-center bg-white/95 pl-3 pr-2 sm:h-20 sm:pl-4 sm:pr-3 lg:pl-5 lg:pr-4">
        <Link
          href="/"
          className="shrink-0 text-[1.125rem] font-bold leading-none tracking-[-0.03em] text-slate-900 sm:text-[1.35rem] lg:text-[1.45rem]"
          onClick={closeMenu}
          aria-label="GrygielGitara — strona główna"
        >
          Grygiel<span className="text-sky-500">Gitara</span>
        </Link>

        <div className="ml-auto flex min-w-0 items-center gap-1.5 sm:gap-2">
          <nav
            aria-label="Główne"
            className="hidden min-w-0 items-center gap-0.5 lg:flex xl:gap-1"
          >
            {mainNavLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="inline-flex min-h-10 items-center rounded-lg px-2 text-[0.95rem] font-semibold text-slate-700 transition-colors hover:bg-sky-50 hover:text-slate-900 xl:min-h-11 xl:px-2.5 xl:text-base"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/moje-kursy/login"
            className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-sky-200/90 bg-sky-50 px-2.5 text-sm font-semibold text-sky-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition-colors hover:border-sky-300 hover:bg-sky-100 sm:min-h-11 sm:px-3 sm:text-[0.95rem]"
            onClick={closeMenu}
          >
            <BookOpen className="size-4 shrink-0 sm:size-[1.1rem]" aria-hidden />
            <span>Konto</span>
          </Link>

          <Button
            asChild
            size="default"
            className="hidden text-base lg:inline-flex xl:text-lg"
          >
            <Link href="/rezerwacja" onClick={closeMenu}>
              Umów lekcję próbną
            </Link>
          </Button>

          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl text-slate-700 transition-colors hover:bg-sky-50 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Zamknij menu" : "Otwórz menu"}
            onClick={toggleMenu}
          >
            {open ? <X className="size-7" /> : <Menu className="size-7" />}
          </button>
        </div>
      </div>

      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[40] bg-slate-900/30 lg:hidden"
            aria-label="Zamknij menu"
            onClick={closeMenu}
          />
          <div
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="absolute inset-x-0 top-full z-[50] max-h-[min(100dvh-4.5rem,100svh-4.5rem)] overflow-y-auto border-t border-sky-100 bg-white shadow-lg sm:max-h-[min(100dvh-5rem,100svh-5rem)] lg:hidden"
          >
            <nav
              aria-label="Menu mobilne"
              className="mx-auto flex max-w-6xl flex-col gap-1.5 px-4 py-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6"
            >
              {mainNavLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={closeMenu}
                  className="inline-flex min-h-12 items-center rounded-xl px-3.5 text-base font-semibold text-slate-800 transition-colors hover:bg-sky-50 sm:text-lg"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/moje-kursy/login"
                onClick={closeMenu}
                className="mt-1 inline-flex min-h-12 items-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-3.5 text-base font-semibold text-sky-800 transition-colors hover:bg-sky-100 sm:text-lg"
              >
                <BookOpen className="size-5 shrink-0" aria-hidden />
                Konto — zaloguj / załóż
              </Link>
              <Button asChild size="lg" className="mt-3 w-full text-base">
                <Link href="/rezerwacja" onClick={closeMenu}>
                  Umów lekcję próbną
                </Link>
              </Button>
            </nav>
          </div>
        </>
      ) : null}
    </header>
  );
}
