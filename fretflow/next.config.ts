import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
          {
            key: "Service-Worker-Allowed",
            value: "/",
          },
        ],
      },
      {
        source: "/products/gitarowy-reset.pdf",
        headers: [
          {
            key: "Content-Disposition",
            value: 'attachment; filename="Gitarowy-Reset.pdf"',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/pobierz-poradnik",
        destination: "/sklep/gitarowy-reset",
        permanent: true,
      },
      {
        source: "/sklep/gitarowy-falstart",
        destination: "/sklep/gitarowy-reset",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
