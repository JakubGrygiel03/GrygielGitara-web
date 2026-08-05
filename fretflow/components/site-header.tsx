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
      <div className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between gap-3 px-4 sm:h-20 sm:px-6">
        <Link
          href="/"
          className="shrink-0 text-[1.25rem] font-bold leading-none tracking-[-0.02em] text-slate-900 sm:text-[1.75rem]"
          onClick={() => setOpen(false)}
          aria-label="GrygielGitara — strona główna"
        >
          Grygiel<span className="text-sky-500">Gitara</span>
        </Link>

        <nav aria-label="Główne" className="hidden items-center gap-1 lg:flex">
          {mainNavLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="inline-flex min-h-12 items-center rounded-xl px-3.5 text-lg font-semibold text-slate-700 transition-colors hover:bg-sky-50 hover:text-slate-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/moje-kursy/login"
            className="inline-flex min-h-12 items-center gap-1.5 rounded-xl px-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-sky-50 hover:text-slate-900 sm:px-3 sm:text-base"
          >
            <BookOpen className="size-5 shrink-0 sm:size-5" aria-hidden />
            <span className="hidden sm:inline">Strefa ucznia</span>
            <span className="sm:hidden">Uczeń</span>
          </Link>

          <Button asChild size="default" className="hidden text-lg lg:inline-flex">
            <Link href="/rezerwacja">Umów lekcję próbną</Link>
          </Button>

          <button
            type="button"
            className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-xl text-slate-700 transition-colors hover:bg-sky-50 lg:hidden"
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
            className="inline-flex min-h-12 items-center rounded-xl px-3.5 text-base font-semibold text-sky-700 transition-colors hover:bg-sky-50 sm:text-lg"
          >
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
