import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";

import { BuyProductButton } from "@/components/buy-product-button";
import { Button } from "@/components/ui/button";
import type { ShopCatalogItem } from "@/lib/shop";
import { shopInterestHref } from "@/lib/shop-products";
import { cn } from "@/lib/utils";

type ShopProductCardProps = {
  product: ShopCatalogItem;
  stripeReady: boolean;
  loggedIn: boolean;
  className?: string;
};

export function ShopProductCard({
  product,
  stripeReady,
  loggedIn,
  className,
}: ShopProductCardProps) {
  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1px_0_rgba(15,23,42,0.04),0_12px_32px_-16px_rgba(14,165,233,0.35)] transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_1px_0_rgba(15,23,42,0.06),0_24px_48px_-20px_rgba(14,165,233,0.45)]",
        className,
      )}
    >
      <div className="relative flex aspect-[5/4] items-center justify-center bg-gradient-to-b from-slate-100 to-sky-50/80 px-6 py-7 sm:px-8 sm:py-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-8 top-6 h-px bg-gradient-to-r from-transparent via-sky-200/80 to-transparent"
        />
        <div className="relative aspect-[3/4] w-[42%] max-w-[7.5rem] rotate-[-2deg] shadow-[0_18px_40px_-12px_rgba(15,23,42,0.45)] transition-transform duration-300 ease-out group-hover:rotate-0 group-hover:scale-[1.03] sm:max-w-[8.25rem]">
          <Image
            src={product.image}
            alt={product.imageAlt}
            fill
            sizes="8.25rem"
            className="rounded-sm object-cover"
          />
        </div>
        <span className="absolute left-3 top-3 rounded-md bg-slate-900/90 px-2 py-1 text-[0.65rem] font-bold uppercase tracking-[0.08em] text-white">
          {product.badge}
        </span>
        {product.comingSoon ? (
          <span className="absolute right-3 top-3 rounded-md bg-white/95 px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-sky-800 shadow-sm">
            Wkrótce
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col px-4 py-4 sm:px-5 sm:py-5">
        <h2 className="text-base font-bold leading-snug tracking-[-0.015em] text-slate-900 sm:text-lg">
          {product.title}
        </h2>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
          {product.shortDescription}
        </p>

        <div className="mt-4 flex items-end justify-between gap-3 border-t border-slate-100 pt-3">
          <p className="text-base font-semibold tabular-nums text-slate-900">
            {product.priceLabel}
          </p>
        </div>

        <div className="mt-4">
          {product.owned ? (
            <Button asChild variant="secondary" className="w-full">
              <a href={`/api/shop/download/${product.id}`}>
                <Download className="size-4" aria-hidden />
                Pobierz PDF
              </a>
            </Button>
          ) : product.comingSoon || !stripeReady ? (
            <Link
              href={shopInterestHref}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 text-sm font-bold uppercase tracking-[0.04em] text-sky-700 transition-colors hover:text-sky-900"
            >
              Zapytaj o dostęp
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          ) : !loggedIn ? (
            <Button asChild className="w-full">
              <Link
                href={`/moje-kursy/login?next=${encodeURIComponent("/sklep")}`}
              >
                Zaloguj się i kup
              </Link>
            </Button>
          ) : (
            <BuyProductButton productId={product.id} className="w-full" />
          )}
        </div>
      </div>
    </article>
  );
}
