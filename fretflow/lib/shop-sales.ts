/**
 * Public Stripe checkout.
 * false = catalog stays visible, CTAs become „zapisz się / zniżka”.
 * true = reopen buying. Owned downloads work either way.
 */
export function isShopSalesOpen(): boolean {
  const raw = process.env.SHOP_SALES_OPEN?.trim().toLowerCase();
  return raw === "1" || raw === "true" || raw === "yes" || raw === "on";
}
