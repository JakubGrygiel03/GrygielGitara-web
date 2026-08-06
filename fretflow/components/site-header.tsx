"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { mainNavLinks } from "@/lib/nav";

const SCROLL_Y_ATTR = "navScrollY";

function isScrollLocked() {
  return (
    typeof document !== "undefined" &&
    document.body.dataset[SCROLL_Y_ATTR] !== undefined
  );
}

function unlockBodyScroll() {
  if (typeof document === "undefined" || !isScrollLocked()) return;

  const html = document.documentElement;
  const body = document.body;
  const y = Number(body.dataset[SCROLL_Y_ATTR] ?? "0");

  html.style.removeProperty("overflow");
  body.style.removeProperty("overflow");
  body.style.removeProperty("touch-action");
  delete body.dataset[SCROLL_Y_ATTR];

  window.scrollTo(0, y);
}

/** Prevent background scroll while full-screen menu (portal) is open. */
function lockBodyScroll() {
  if (typeof document === "undefined" || isScrollLocked()) return;

  const scrollY = window.scrollY;
  const body = document.body;
  const html = document.documentElement;

  body.dataset[SCROLL_Y_ATTR] = String(scrollY);
  html.style.overflow = "hidden";
  body.style.overflow = "hidden";
  body.style.touchAction = "none";
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setOpen(false);
    unlockBodyScroll();
  }, [pathname]);

  useEffect(() => {
    if (open) {
      lockBodyScroll();
      return () => unlockBodyScroll();
    }
    unlockBodyScroll();
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

  const isActive = (href: string) => {
    if (href.startsWith("/#")) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const navLinkClass = (href: string) =>
    [
      "inline-flex min-h-10 items-center rounded-lg px-2.5 text-[0.95rem] font-bold tracking-tight transition-colors xl:min-h-11 xl:px-3 xl:text-base",
      isActive(href)
        ? "bg-sky-100 text-sky-900"
        : "text-slate-900 hover:bg-sky-50 hover:text-sky-800",
    ].join(" ");

  const mobileMenu =
    open && mounted
      ? createPortal(
          <>
            <button
              type="button"
              className="fixed inset-0 z-[100] bg-slate-900/40 lg:hidden"
              aria-label="Zamknij menu"
              onClick={closeMenu}
            />
            <div
              id="mobile-nav"
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              className="fixed inset-x-0 top-0 z-[110] flex max-h-[100dvh] flex-col bg-white shadow-xl lg:hidden"
            >
              <div className="flex h-[4.5rem] shrink-0 items-center justify-between border-b-2 border-sky-200 pl-3 pr-2 sm:h-20 sm:pl-4 sm:pr-3">
                <Link
                  href="/"
                  className="text-[1.125rem] font-extrabold tracking-[-0.03em] text-slate-900 sm:text-[1.35rem]"
                  onClick={closeMenu}
                  aria-label="GrygielGitara — strona główna"
                >
                  Grygiel<span className="text-sky-500">Gitara</span>
                </Link>
                <button
                  type="button"
                  className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl text-slate-800 hover:bg-sky-50"
                  aria-label="Zamknij menu"
                  onClick={closeMenu}
                >
                  <X className="size-7" />
                </button>
              </div>
              <nav
                aria-label="Menu mobilne"
                className="flex-1 overflow-y-auto px-4 py-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6"
              >
                <div className="mx-auto flex max-w-6xl flex-col gap-4">
                  <div className="overflow-hidden rounded-2xl border-2 border-sky-200 bg-white">
                    {mainNavLinks.map((link, index) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        onClick={closeMenu}
                        className={`flex min-h-12 items-center px-4 text-base font-bold text-slate-900 transition-colors hover:bg-sky-50 active:bg-sky-100 sm:min-h-14 sm:text-lg ${
                          index > 0 ? "border-t border-sky-200" : ""
                        } ${isActive(link.href) ? "bg-sky-50 text-sky-900" : ""}`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                  <Link
                    href="/moje-kursy/login"
                    onClick={closeMenu}
                    className="inline-flex min-h-12 items-center gap-2 rounded-2xl border-2 border-sky-500 bg-white px-4 text-base font-bold text-slate-900 transition-colors hover:bg-sky-50 sm:min-h-14 sm:text-lg"
                  >
                    <BookOpen className="size-5 shrink-0 text-sky-600" aria-hidden />
                    Konto — zaloguj / załóż
                  </Link>
                  <Button asChild size="lg" className="w-full text-base">
                    <Link href="/rezerwacja" onClick={closeMenu}>
                      Umów lekcję próbną
                    </Link>
                  </Button>
                </div>
              </nav>
            </div>
          </>,
          document.body,
        )
      : null;

  return (
    <>
      <header className="sticky top-0 z-50 border-b-2 border-sky-200 bg-white/95 backdrop-blur-md">
        <div className="relative z-[60] flex h-[4.5rem] w-full items-center bg-white/95 pl-3 pr-2 sm:h-20 sm:pl-4 sm:pr-3 lg:pl-5 lg:pr-4">
          <Link
            href="/"
            className="shrink-0 text-[1.125rem] font-extrabold leading-none tracking-[-0.03em] text-slate-900 sm:text-[1.35rem] lg:text-[1.45rem]"
            onClick={closeMenu}
            aria-label="GrygielGitara — strona główna"
          >
            Grygiel<span className="text-sky-500">Gitara</span>
          </Link>

          <div className="ml-auto flex min-w-0 items-center gap-2 sm:gap-2.5">
            <nav
              aria-label="Główne"
              className="hidden min-w-0 items-center gap-0.5 lg:flex xl:gap-1"
            >
              {mainNavLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={navLinkClass(link.href)}
                  aria-current={isActive(link.href) ? "page" : undefined}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <Link
              href="/moje-kursy/login"
              className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border-2 border-sky-500 bg-white px-2.5 text-sm font-bold text-slate-900 transition-colors hover:bg-sky-50 sm:min-h-11 sm:px-3 sm:text-[0.95rem]"
              onClick={closeMenu}
            >
              <BookOpen
                className="size-4 shrink-0 text-sky-600 sm:size-[1.1rem]"
                aria-hidden
              />
              <span>Konto</span>
            </Link>

            <Button
              asChild
              size="default"
              className="hidden text-base font-bold lg:inline-flex xl:text-lg"
            >
              <Link href="/rezerwacja" onClick={closeMenu}>
                Umów lekcję próbną
              </Link>
            </Button>

            <button
              type="button"
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl text-slate-800 transition-colors hover:bg-sky-50 lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Zamknij menu" : "Otwórz menu"}
              onClick={toggleMenu}
            >
              {open ? <X className="size-7" /> : <Menu className="size-7" />}
            </button>
          </div>
        </div>
      </header>
      {mobileMenu}
    </>
  );
}
