import { siteJsonLd } from "@/lib/seo";

/** Invisible structured data for search engines — does not change page UI. */
export function SiteJsonLd() {
  const json = JSON.stringify(siteJsonLd());

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
