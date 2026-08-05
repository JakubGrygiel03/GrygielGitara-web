"use client";

import Link from "next/link";
import { BookOpen, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { mainNavLinks } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const scrollY = window.scrollY;
    const { style } = document.body;
    const previous = {
      position: style.position,
      top: style.top,
      width: style.width,
      overflow: style.overflow,
    };

    style.position = "fixed";
    style.top = `-${scrollY}px`;
    style.width = "100%";
    style.overflow = "hidden";

    return () => {
      style.position = previous.position;
      style.top = previous.top;
      style.width = previous.width;
      style.overflow = previous.overflow;
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header
      className={cn(
        "z-50 border-b border-sky-100/80 bg-white/90 backdrop-blur-md",
        open
          ? "fixed inset-x-0 top-0"
          : "sticky top-0",
      )}
    >
      <div className="flex h-[4.5rem] w-full items-center pl-3 pr-2 sm:h-20 sm:pl-4 sm:pr-3 lg:pl-5 lg:pr-4">
        <Link
          href="/"
          className="shrink-0 text-[1.125rem] font-bold leading-none tracking-[-0.03em] text-slate-900 sm:text-[1.35rem] lg:text-[1.45rem]"
          onClick={() => setOpen(false)}
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
          >
            <BookOpen className="size-4 shrink-0 sm:size-[1.1rem]" aria-hidden />
            <span className="hidden sm:inline">Strefa ucznia</span>
            <span className="sm:hidden">Uczeń</span>
          </Link>

          <Button
            asChild
            size="default"
            className="hidden text-base lg:inline-flex xl:text-lg"
          >
            <Link href="/rezerwacja">Umów lekcję próbną</Link>
          </Button>

          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl text-slate-700 transition-colors hover:bg-sky-50 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Zamknij menu" : "Otwórz menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="size-7" /> : <Menu className="size-7" />}
          </button>
        </div>
      </div>

      {/* Fixed overlay — always opens in current viewport, even after scroll */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-slate-900/25 lg:hidden",
          open ? "block" : "hidden",
        )}
        aria-hidden={!open}
        onClick={() => setOpen(false)}
      />

      <div
        id="mobile-nav"
        role="dialog"
        aria-modal={open}
        aria-label="Menu"
        className={cn(
          "fixed inset-x-0 top-[4.5rem] bottom-0 z-50 overflow-y-auto border-t border-sky-100 bg-white sm:top-20 lg:hidden",
          open ? "block" : "hidden",
        )}
      >
        <nav
          aria-label="Menu mobilne"
          className="mx-auto flex max-w-6xl flex-col gap-1.5 px-4 py-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6"
        >
          {mainNavLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="inline-flex min-h-12 items-center rounded-xl px-3.5 text-base font-semibold text-slate-800 transition-colors hover:bg-sky-50 sm:text-lg"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/moje-kursy/login"
            onClick={() => setOpen(false)}
            className="mt-1 inline-flex min-h-12 items-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-3.5 text-base font-semibold text-sky-800 transition-colors hover:bg-sky-100 sm:text-lg"
          >
            <BookOpen className="size-5 shrink-0" aria-hidden />
            Strefa ucznia — zaloguj
          </Link>
          <Button asChild size="lg" className="mt-3 w-full text-base">
            <Link href="/rezerwacja" onClick={() => setOpen(false)}>
              Umów lekcję próbną
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
