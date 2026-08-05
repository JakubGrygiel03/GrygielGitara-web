import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";

import { BuyProductButton } from "@/components/buy-product-button";
import { Button } from "@/components/ui/button";
import type { ShopCatalogItem } from "@/lib/shop";
import { shopInterestHref } from "@/lib/shop-products";

type ShopProductCtaProps = {
  product: Pick<ShopCatalogItem, "id" | "owned" | "comingSoon">;
  stripeReady: boolean;
  loggedIn: boolean;
  className?: string;
  loginNext?: string;
};

export function ShopProductCta({
  product,
  stripeReady,
  loggedIn,
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

  if (product.comingSoon || !stripeReady) {
    return (
      <Link
        href={shopInterestHref}
        className={`inline-flex min-h-11 items-center justify-center gap-2 text-sm font-bold uppercase tracking-[0.04em] text-sky-700 transition-colors hover:text-sky-900 ${className ?? ""}`}
      >
        Zapytaj o dostęp
        <ArrowRight className="size-4" aria-hidden />
      </Link>
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
