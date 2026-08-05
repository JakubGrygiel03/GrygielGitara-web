import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";

import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "GrygielGitara — Bezstresowe lekcje gitary w Gdańsku",
    template: "%s | GrygielGitara",
  },
  description:
    "Lekcje gitary w Gdańsku i online, regulacja instrumentu oraz materiały edukacyjne. Zero stresu, praktyczne podejście.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pl" className={`${plusJakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <Toaster richColors position="top-center" closeButton />
      </body>
    </html>
  );
}
