import type { MetadataRoute } from "next";

import { SITE_CANONICAL_ORIGIN } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/moje-kursy",
          "/api/",
          "/auth/",
          "/sklep/sukces",
        ],
      },
    ],
    sitemap: `${SITE_CANONICAL_ORIGIN}/sitemap.xml`,
    host: SITE_CANONICAL_ORIGIN,
  };
}
