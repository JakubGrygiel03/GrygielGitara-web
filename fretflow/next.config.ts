import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
