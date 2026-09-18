import type { MetadataRoute } from "next";

import { SITE_DEFAULT_DESCRIPTION, SITE_NAME } from "@/lib/seo";

/** Web app manifest — enables “Install app” / Add to Home Screen. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: SITE_DEFAULT_DESCRIPTION,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#ffffff",
    theme_color: "#0F172A",
    lang: "pl",
    categories: ["education", "music"],
    shortcuts: [
      {
        name: "Panel",
        short_name: "Panel",
        description: "Panel administracyjny GrygielGitara",
        url: "/admin",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
      {
        name: "Konto",
        short_name: "Konto",
        url: "/moje-kursy/login",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
    ],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
