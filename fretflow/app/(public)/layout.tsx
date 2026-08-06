import type { ReactNode } from "react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SiteJsonLd } from "@/components/site-json-ld";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteJsonLd />
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
