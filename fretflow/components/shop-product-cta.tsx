import Link from "next/link";
import { Download } from "lucide-react";

import { BuyProductButton } from "@/components/buy-product-button";
import { Button } from "@/components/ui/button";
import type { ShopCatalogItem } from "@/lib/shop";
import {
  SHOP_COMING_SOON_HINT,
  SHOP_INTEREST_CTA,
  shopInterestHref,
} from "@/lib/shop-products";

type ShopProductCtaProps = {
  product: Pick<
    ShopCatalogItem,
    "id" | "owned" | "comingSoon" | "slug" | "title" | "earlyBirdOpen"
  >;
  stripeReady: boolean;
  loggedIn: boolean;
  salesOpen?: boolean;
  showWaitlistHint?: boolean;
  className?: string;
  loginNext?: string;
};

export function ShopProductCta({
  product,
  stripeReady,
  loggedIn,
  salesOpen = true,
  showWaitlistHint = false,
  className,
  loginNext = "/sklep",
}: ShopProductCtaProps) {
  if (product.owned) {
    return (
      <Button asChild variant="secondary" className={className}>
        <a href={`/api/shop/download/${product.id}`}>
          <Download className="size-4" aria-hidden />
          Pobierz PDF
        </a>
      </Button>
    );
  }

  const showEarlyBird =
    product.earlyBirdOpen && (!salesOpen || product.comingSoon || !stripeReady);

  if (showEarlyBird) {
    return (
      <div className={`flex flex-col gap-2 ${className ?? ""}`}>
        {showWaitlistHint ? (
          <p className="text-sm font-semibold leading-snug text-slate-800">
            {SHOP_COMING_SOON_HINT}
          </p>
        ) : null}
        <Button asChild className="w-full whitespace-nowrap">
          <Link
            href={shopInterestHref({
              slug: product.slug,
              title: product.title,
            })}
          >
            {SHOP_INTEREST_CTA}
          </Link>
        </Button>
      </div>
    );
  }

  if (!salesOpen || product.comingSoon || !stripeReady) {
    return (
      <p
        className={`rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-center text-sm font-semibold text-slate-700 ${className ?? ""}`}
      >
        Wkrótce w sprzedaży
      </p>
    );
  }

  if (!loggedIn) {
    return (
      <Button asChild className={className}>
        <Link
          href={`/moje-kursy/login?next=${encodeURIComponent(loginNext)}`}
        >
          Zaloguj się i kup
        </Link>
      </Button>
    );
  }

  return <BuyProductButton productId={product.id} className={className} />;
}
