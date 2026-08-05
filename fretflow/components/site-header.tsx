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
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-sky-100/80 bg-white/70 backdrop-blur-md">
      <div className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between gap-3 px-4 sm:h-20 sm:px-6">
        <Link
          href="/"
          className="shrink-0 text-2xl font-bold tracking-tight text-slate-900 sm:text-[1.75rem]"
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
            href="/moje-kursy"
            className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-xl text-slate-600 transition-colors hover:bg-sky-50 hover:text-slate-900"
            aria-label="Strefa studenta"
            title="Strefa studenta"
          >
            <BookOpen className="size-6" aria-hidden />
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

      <div
        id="mobile-nav"
        className={cn(
          "max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-sky-100 bg-white sm:max-h-[calc(100dvh-5rem)] lg:hidden",
          open ? "block" : "hidden",
        )}
      >
        <nav
          aria-label="Menu mobilne"
          className="mx-auto flex max-w-6xl flex-col gap-1.5 px-4 py-5 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6"
        >
          {mainNavLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="inline-flex min-h-12 items-center rounded-xl px-3.5 text-xl font-semibold text-slate-800 transition-colors hover:bg-sky-50"
            >
              {link.label}
            </Link>
          ))}
          <Button asChild size="lg" className="mt-3 w-full text-lg">
            <Link href="/rezerwacja" onClick={() => setOpen(false)}>
              Umów lekcję próbną
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
