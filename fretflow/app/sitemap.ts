import type { MetadataRoute } from "next";

import { SITE_CANONICAL_ORIGIN } from "@/lib/seo";
import { shopProducts } from "@/lib/shop-products";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  /** Priority: home → lessons booking → shop → lead magnet → contact. */
  const staticRoutes: MetadataRoute.Sitemap = [
    { path: "", priority: 1, changeFrequency: "weekly" as const },
    { path: "/rezerwacja", priority: 0.95, changeFrequency: "weekly" as const },
    { path: "/sklep", priority: 0.95, changeFrequency: "weekly" as const },
    {
      path: "/pobierz-poradnik",
      priority: 0.85,
      changeFrequency: "monthly" as const,
    },
    { path: "/kontakt", priority: 0.8, changeFrequency: "monthly" as const },
    {
      path: "/regulamin-sklepu",
      priority: 0.3,
      changeFrequency: "yearly" as const,
    },
  ].map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_CANONICAL_ORIGIN}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));

  const productRoutes: MetadataRoute.Sitemap = shopProducts.map((product) => ({
    url: `${SITE_CANONICAL_ORIGIN}/sklep/${product.slug}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.88,
  }));

  return [...staticRoutes, ...productRoutes];
}
