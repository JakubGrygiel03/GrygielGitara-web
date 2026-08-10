import Link from "next/link";

import { ShopEbookCover } from "@/components/shop-ebook-cover";
import { Button } from "@/components/ui/button";
import { isFreeGuideOpen } from "@/lib/free-guide";
import {
  FREE_GUIDE_BLURB,
  FREE_GUIDE_COMING_SOON_CTA,
  FREE_GUIDE_CTA_LABEL,
  FREE_GUIDE_SHORT_TITLE,
} from "@/lib/free-guide-copy";
import { cn } from "@/lib/utils";

const FREE_GUIDE_SLUG = "gitarowy-falstart";

type ShopFreeGuideCardProps = {
  className?: string;
};

/** Catalog card for the free PDF — sits with paid e-books in /sklep. */
export function ShopFreeGuideCard({ className }: ShopFreeGuideCardProps) {
  const open = isFreeGuideOpen();

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-2 ring-cyan-500 shadow-[0_1px_0_rgba(15,23,42,0.04),0_12px_32px_-16px_rgba(6,182,212,0.4)] transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_1px_0_rgba(15,23,42,0.06),0_24px_48px_-20px_rgba(6,182,212,0.5)]",
        className,
      )}
    >
      <p className="bg-cyan-600 px-3 py-1.5 text-center text-[0.7rem] font-bold uppercase tracking-wide text-white">
        100% za darmo
      </p>

      <Link href="/pobierz-poradnik" className="relative block">
        <ShopEbookCover
          slug={FREE_GUIDE_SLUG}
          title={FREE_GUIDE_SHORT_TITLE}
          badge="PDF gratis"
        />
        {!open ? (
          <span className="absolute right-3 top-3 rounded-md bg-white/95 px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-cyan-900 shadow-sm">
            Wkrótce
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col px-4 py-4 sm:px-5 sm:py-5">
        <h2 className="text-base font-bold leading-snug tracking-[-0.015em] text-slate-900 sm:text-lg">
          <Link
            href="/pobierz-poradnik"
            className="transition-colors hover:text-cyan-800"
          >
            {FREE_GUIDE_SHORT_TITLE}
          </Link>
        </h2>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
          {FREE_GUIDE_BLURB}
        </p>

        <Link
          href="/pobierz-poradnik"
          className="mt-3 text-sm font-semibold text-cyan-800 underline-offset-2 hover:underline"
        >
          Dowiedz się więcej
        </Link>

        <div className="mt-4 border-t border-slate-100 pt-3">
          <p className="text-base font-bold tabular-nums text-cyan-900">
            0,00 zł
          </p>
          <p className="mt-0.5 text-sm font-semibold text-cyan-800">
            Zostaw e-mail i pobierz
          </p>
        </div>

        <div className="mt-4">
          <Button
            asChild
            className="w-full border-2 border-cyan-800 bg-cyan-600 text-white hover:bg-cyan-700"
          >
            <Link href="/pobierz-poradnik">
              {open ? FREE_GUIDE_CTA_LABEL : FREE_GUIDE_COMING_SOON_CTA}
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
