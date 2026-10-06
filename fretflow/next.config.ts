import type { NextConfig } from "next";

function supabaseImageHost(): string | null {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!raw) return null;
  try {
    return new URL(raw).hostname;
  } catch {
    return null;
  }
}

const supabaseHost = supabaseImageHost();

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(self)",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.googleadservices.com https://googleads.g.doubleclick.net",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://www.google-analytics.com https://www.googletagmanager.com https://googleads.g.doubleclick.net https://api.stripe.com https://api.resend.com",
      "frame-src https://www.youtube-nocookie.com https://www.youtube.com https://js.stripe.com",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  serverActions: {
    bodySizeLimit: "2mb",
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 70, 75],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: supabaseHost
      ? [
          {
            protocol: "https",
            hostname: supabaseHost,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
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
