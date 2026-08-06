import { SHOP_EARLY_BIRD_PERCENT } from "@/lib/shop-products";
import { formatPricePln } from "@/lib/stripe";
import { cn } from "@/lib/utils";

type ShopPriceProps = {
  priceGrosze: number;
  priceLabel: string;
  /** Suggested / anchor price (e.g. ~~129~~ 79). */
  compareAtGrosze?: number;
  showEarlyBird?: boolean;
  className?: string;
  size?: "card" | "detail";
};

export function earlyBirdSaleGrosze(
  priceGrosze: number,
  percent = SHOP_EARLY_BIRD_PERCENT,
): number {
  return Math.round((priceGrosze * (100 - percent)) / 100);
}

export function ShopPrice({
  priceGrosze,
  priceLabel,
  compareAtGrosze,
  showEarlyBird = false,
  className,
  size = "card",
}: ShopPriceProps) {
  const sellingGrosze = priceGrosze > 0 ? priceGrosze : 0;
  const earlyGrosze =
    showEarlyBird && sellingGrosze > 0
      ? earlyBirdSaleGrosze(sellingGrosze)
      : 0;
  const displayGrosze = earlyGrosze > 0 ? earlyGrosze : sellingGrosze;
  const displayLabel =
    displayGrosze > 0 ? formatPricePln(displayGrosze) : priceLabel;

  const strikeGrosze =
    compareAtGrosze && compareAtGrosze > displayGrosze
      ? compareAtGrosze
      : showEarlyBird && sellingGrosze > displayGrosze
        ? sellingGrosze
        : 0;

  if (strikeGrosze <= 0) {
    return (
      <p
        className={cn(
          "font-semibold tabular-nums text-slate-900",
          size === "detail" ? "text-2xl font-bold" : "text-base",
          className,
        )}
      >
        {displayLabel}
      </p>
    );
  }

  return (
    <p
      className={cn(
        "leading-snug tabular-nums",
        size === "detail" ? "text-2xl" : "text-base",
        className,
      )}
    >
      <span className="font-medium text-slate-500 line-through decoration-slate-400">
        {formatPricePln(strikeGrosze)}
      </span>{" "}
      <span
        className={cn(
          "font-bold text-sky-800",
          size === "detail" ? "text-2xl" : "text-base",
        )}
      >
        {displayLabel}
      </span>
      {showEarlyBird ? (
        <>
          {" "}
          <span
            className={cn(
              "font-semibold text-sky-700",
              size === "detail" ? "text-base" : "text-sm",
            )}
          >
            z rabatem
          </span>
        </>
      ) : null}
    </p>
  );
}
