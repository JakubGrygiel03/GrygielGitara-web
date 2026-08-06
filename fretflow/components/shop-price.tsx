import { SHOP_EARLY_BIRD_PERCENT } from "@/lib/shop-products";
import { formatPricePln } from "@/lib/stripe";
import { cn } from "@/lib/utils";

type ShopPriceProps = {
  priceGrosze: number;
  priceLabel: string;
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
  showEarlyBird = false,
  className,
  size = "card",
}: ShopPriceProps) {
  const regular =
    priceGrosze > 0 ? formatPricePln(priceGrosze) : priceLabel;
  const saleGrosze =
    priceGrosze > 0 ? earlyBirdSaleGrosze(priceGrosze) : 0;

  if (!showEarlyBird || saleGrosze <= 0) {
    return (
      <p
        className={cn(
          "font-semibold tabular-nums text-slate-900",
          size === "detail" ? "text-2xl font-bold" : "text-base",
          className,
        )}
      >
        {regular}
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
        {regular}
      </span>{" "}
      <span
        className={cn(
          "font-bold text-sky-800",
          size === "detail" ? "text-2xl" : "text-base",
        )}
      >
        {formatPricePln(saleGrosze)}
      </span>{" "}
      <span
        className={cn(
          "font-semibold text-sky-700",
          size === "detail" ? "text-base" : "text-sm",
        )}
      >
        z rabatem
      </span>
    </p>
  );
}
