/**
 * Public shop checkout / catalog sales.
 * Set SHOP_SALES_OPEN=true on Vercel (and .env.local) to reopen buying.
 * Admin product grants and already-owned downloads stay available either way.
 */
export function isShopSalesOpen(): boolean {
  const raw = process.env.SHOP_SALES_OPEN?.trim().toLowerCase();
  return raw === "1" || raw === "true" || raw === "yes" || raw === "on";
}
