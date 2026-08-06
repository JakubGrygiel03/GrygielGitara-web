import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";

import { AuthReturnCatcher } from "@/components/auth-return-catcher";
import { GoogleAdsTag } from "@/components/google-ads-tag";
import {
  SITE_CANONICAL_ORIGIN,
  SITE_DEFAULT_DESCRIPTION,
  SITE_DEFAULT_TITLE,
  SITE_NAME,
  SITE_OG_IMAGE_PATH,
} from "@/lib/seo";

import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CANONICAL_ORIGIN),
  title: {
    default: SITE_DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "lekcje gitary Gdańsk",
    "nauka gry na gitarze",
    "lekcje gitary online",
    "gitara z dojazdem Gdańsk",
    "e-book gitara",
    "setup gitary",
    "GrygielGitara",
  ],
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: SITE_CANONICAL_ORIGIN,
    siteName: SITE_NAME,
    title: SITE_DEFAULT_TITLE,
    description: SITE_DEFAULT_DESCRIPTION,
    images: [
      {
        url: SITE_OG_IMAGE_PATH,
        alt: "Jakub Grygiel — lekcje gitary i sklep materiałów GrygielGitara",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_DEFAULT_TITLE,
    description: SITE_DEFAULT_DESCRIPTION,
    images: [SITE_OG_IMAGE_PATH],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "rUQBiXO_NdbaGwQwhgizWIoHNqOne_GHPxHyd_Rrd0c",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pl"
      className={`${plusJakarta.variable} h-full antialiased`}
    >
      <body
        className={`${plusJakarta.className} flex min-h-full flex-col bg-background text-foreground`}
      >
        <GoogleAdsTag />
        <AuthReturnCatcher />
        {children}
        <Toaster richColors position="top-center" closeButton />
      </body>
    </html>
  );
}
