import {
  SHOP_EARLY_BIRD_PERCENT,
  shopProducts,
} from "@/lib/shop-products";

/** Static fallback when DB column is missing / catalog from demo. */
export function staticEarlyBirdOpen(slug: string): boolean {
  return shopProducts.some((p) => p.slug === slug && p.earlyBirdOpen);
}

export function earlyBirdSuccessMessage(productTitle: string): string {
  return `Jesteś na liście na „${productTitle}”. Przy premierze tego produktu dostaniesz kod −${SHOP_EARLY_BIRD_PERCENT}% (zapisany na ten tytuł).`;
}
