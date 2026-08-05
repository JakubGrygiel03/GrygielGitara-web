import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";

import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: {
    default: "GrygielGitara — Bezstresowe lekcje gitary w Gdańsku",
    template: "%s | GrygielGitara",
  },
  description:
    "Lekcje gitary w Gdańsku i online, regulacja instrumentu oraz materiały edukacyjne. Zero stresu, praktyczne podejście.",
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
        {children}
        <Toaster richColors position="top-center" closeButton />
      </body>
    </html>
  );
}
