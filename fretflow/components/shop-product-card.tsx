import Link from "next/link";

import { ShopEbookCover } from "@/components/shop-ebook-cover";
import { ShopPrice } from "@/components/shop-price";
import { ShopProductCta } from "@/components/shop-product-cta";
import type { ShopCatalogItem } from "@/lib/shop";
import { cn } from "@/lib/utils";

type ShopProductCardProps = {
  product: ShopCatalogItem;
  stripeReady: boolean;
  loggedIn: boolean;
  salesOpen?: boolean;
  className?: string;
};

export function ShopProductCard({
  product,
  stripeReady,
  loggedIn,
  salesOpen = true,
  className,
}: ShopProductCardProps) {
  const detailHref = `/sklep/${product.slug}`;
  const canOpenDetail = !product.slug.startsWith("fallback");
  const showEarlyBirdPrice =
    product.earlyBirdOpen && (!salesOpen || product.comingSoon || !stripeReady);
  const isFeatured = product.slug === "start-z-gitara-bez-stresu";
  const isVip = product.slug === "start-bez-stresu-feedback-vip";

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1px_0_rgba(15,23,42,0.04),0_12px_32px_-16px_rgba(14,165,233,0.35)] transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_1px_0_rgba(15,23,42,0.06),0_24px_48px_-20px_rgba(14,165,233,0.45)]",
        isFeatured &&
          "ring-2 ring-sky-500 shadow-[0_1px_0_rgba(15,23,42,0.06),0_24px_48px_-18px_rgba(14,165,233,0.55)] sm:scale-[1.02]",
        isVip &&
          "ring-2 ring-amber-600/80 shadow-[0_1px_0_rgba(15,23,42,0.06),0_24px_48px_-18px_rgba(180,130,40,0.4)]",
        className,
      )}
    >
      {isFeatured ? (
        <p className="bg-sky-600 px-3 py-1.5 text-center text-[0.7rem] font-bold uppercase tracking-wide text-white">
          Najpopularniejszy
        </p>
      ) : null}
      {isVip ? (
        <p className="bg-gradient-to-r from-[#2a1038] via-[#5b21b6] to-[#2a1038] px-3 py-1.5 text-center text-[0.7rem] font-bold uppercase tracking-[0.14em] text-amber-200">
          VIP
        </p>
      ) : null}

      {canOpenDetail ? (
        <Link href={detailHref} className="relative block">
          <ShopEbookCover
            slug={product.slug}
            title={product.title}
            badge={product.badge}
          />
          {product.comingSoon ? (
            <span className="absolute right-3 top-3 rounded-md bg-white/95 px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-sky-800 shadow-sm">
              Wkrótce
            </span>
          ) : null}
        </Link>
      ) : (
        <div className="relative">
          <ShopEbookCover
            slug={product.slug}
            title={product.title}
            badge={product.badge}
          />
          {product.comingSoon ? (
            <span className="absolute right-3 top-3 rounded-md bg-white/95 px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-sky-800 shadow-sm">
              Wkrótce
            </span>
          ) : null}
        </div>
      )}

      <div className="flex flex-1 flex-col px-4 py-4 sm:px-5 sm:py-5">
        <h2 className="text-base font-bold leading-snug tracking-[-0.015em] text-slate-900 sm:text-lg">
          {canOpenDetail ? (
            <Link
              href={detailHref}
              className="transition-colors hover:text-sky-800"
            >
              {product.title}
            </Link>
          ) : (
            product.title
          )}
        </h2>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
          {product.shortDescription}
        </p>

        {canOpenDetail ? (
          <Link
            href={detailHref}
            className="mt-3 text-sm font-semibold text-sky-700 underline-offset-2 hover:underline"
          >
            Dowiedz się więcej
          </Link>
        ) : null}

        <div className="mt-4 border-t border-slate-100 pt-3">
          <ShopPrice
            priceGrosze={product.priceGrosze}
            priceLabel={product.priceLabel}
            compareAtGrosze={product.compareAtGrosze}
            showEarlyBird={showEarlyBirdPrice}
          />
        </div>

        <div className="mt-4">
          <ShopProductCta
            product={product}
            stripeReady={stripeReady}
            loggedIn={loggedIn}
            salesOpen={salesOpen}
            className="w-full"
            loginNext={canOpenDetail ? detailHref : "/sklep"}
          />
        </div>
      </div>
    </article>
  );
}
