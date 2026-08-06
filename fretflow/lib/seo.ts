import type { Metadata } from "next";

import { lessonPackages } from "@/lib/lesson-packages";
import { shopProducts } from "@/lib/shop-products";
import { SITE_EMAIL, SITE_PHONE_E164 } from "@/lib/site-contact";

/** Prefer www — apex redirects there in Vercel. */
export const SITE_CANONICAL_ORIGIN = "https://www.grygielgitara.pl";

export const SITE_NAME = "GrygielGitara";

/** Home + brand — lessons and shop in one clear search pitch. */
export const SITE_DEFAULT_TITLE =
  "Lekcje gitary Gdańsk i online · e-booki | GrygielGitara";

export const SITE_DEFAULT_DESCRIPTION =
  "Bezstresowe lekcje gitary w Gdańsku (dojazd / okolice Forum) i online. Sklep z e-bookami: start gry, setup instrumentu, pakiet Feedback VIP. Jakub Grygiel — praktyka zamiast szkolnego stresu.";

/** Absolute OG/Twitter image path (served from /public). */
export const SITE_OG_IMAGE_PATH = "/images/jakub-portrait.png";

export function absoluteUrl(path = "/"): string {
  const base = SITE_CANONICAL_ORIGIN.replace(/\/$/, "");
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function pageMetadata(options: {
  title: string;
  description: string;
  path: string;
  /** Use absolute title (no „| GrygielGitara” template). */
  absoluteTitle?: boolean;
}): Metadata {
  const url = absoluteUrl(options.path);
  const title = options.absoluteTitle
    ? { absolute: options.title }
    : options.title;

  return {
    title,
    description: options.description,
    alternates: { canonical: options.path },
    openGraph: {
      type: "website",
      locale: "pl_PL",
      url,
      siteName: SITE_NAME,
      title: options.title,
      description: options.description,
      images: [
        {
          url: SITE_OG_IMAGE_PATH,
          alt: "Jakub Grygiel — lekcje gitary i materiały GrygielGitara",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: options.title,
      description: options.description,
      images: [SITE_OG_IMAGE_PATH],
    },
  };
}

/** Key Q&A for FAQPage schema (mirrors on-page FAQ; not shown twice in UI). */
const SEO_FAQS: { q: string; a: string }[] = [
  {
    q: "Jak umówić lekcję próbną gitary w Gdańsku?",
    a: "Wejdź w Rezerwacja na grygielgitara.pl albo napisz przez Kontakt. Pierwsza lekcja jest z gwarancją — nie płacisz, jeśli nie złapiemy wspólnego języka.",
  },
  {
    q: "Czy prowadzisz lekcje gitary online?",
    a: "Tak. Lekcje online przez Telegram (czysty dźwięk instrumentu) oraz stacjonarnie w Gdańsku — z dojazdem albo w punkcie przy Galerii Forum.",
  },
  {
    q: "Ile kosztuje lekcja gitary?",
    a: "Od 80 zł online, 100 zł stacjonarnie przy Forum, 120 zł z dojazdem; pakiet 4 lekcji z dojazdem to 400 zł (100 zł za lekcję).",
  },
  {
    q: "Czy muszę mieć własną gitarę na start?",
    a: "Najlepiej tak, żeby ćwiczyć w domu. Przy zakupie pomagam wybrać instrument — dzięki wykształceniu technicznemu unikniesz twardej lub wadliwej gitary.",
  },
  {
    q: "Co jest w sklepie GrygielGitara?",
    a: "E-booki i pakiety cyfrowe: Setup i dbanie o gitarę w domu, Start z gitarą bez stresu oraz Start bez stresu + Feedback VIP. Zakupy w koncie na stronie.",
  },
  {
    q: "Czy muszę brać lekcje, żeby kupić e-booka?",
    a: "Nie. Sklep jest dostępny także bez lekcji — wystarczy konto i zakup. Lekcje i materiały się uzupełniają, ale nie trzeba ich łączyć.",
  },
];

/** LocalBusiness + services (lessons) + products (shop) + FAQ — invisible to visitors. */
export function siteJsonLd() {
  const orgId = `${SITE_CANONICAL_ORIGIN}/#organization`;
  const businessId = `${SITE_CANONICAL_ORIGIN}/#localbusiness`;
  const websiteId = `${SITE_CANONICAL_ORIGIN}/#website`;
  const lessonCatalogId = `${SITE_CANONICAL_ORIGIN}/#lesson-offers`;
  const shopCatalogId = `${SITE_CANONICAL_ORIGIN}/#shop-offers`;

  const lessonOffers = lessonPackages.map((pkg) => ({
    "@type": "Offer",
    "@id": `${SITE_CANONICAL_ORIGIN}/#offer-${pkg.id}`,
    name: pkg.name,
    description: pkg.details,
    price: pkg.price,
    priceCurrency: "PLN",
    url: absoluteUrl("/rezerwacja"),
    availability: "https://schema.org/InStock",
    category: "Lekcje gitary",
    areaServed:
      pkg.locationType === "online"
        ? { "@type": "Country", name: "Poland" }
        : { "@type": "City", name: "Gdańsk" },
  }));

  const productNodes = shopProducts.map((product) => {
    const productUrl = absoluteUrl(`/sklep/${product.slug}`);
    const productId = `${productUrl}#product`;
    return {
      "@type": "Product",
      "@id": productId,
      name: product.title,
      description: product.shortDescription,
      image: absoluteUrl(product.image),
      url: productUrl,
      brand: { "@type": "Brand", name: SITE_NAME },
      category: "E-book / materiał cyfrowy",
      offers: {
        "@type": "Offer",
        url: productUrl,
        priceCurrency: "PLN",
        price: (product.priceGrosze / 100).toFixed(2),
        availability: "https://schema.org/PreOrder",
        seller: { "@id": orgId },
      },
    };
  });

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": orgId,
        name: SITE_NAME,
        url: SITE_CANONICAL_ORIGIN,
        email: SITE_EMAIL,
        telephone: SITE_PHONE_E164,
        logo: absoluteUrl(SITE_OG_IMAGE_PATH),
        description: SITE_DEFAULT_DESCRIPTION,
      },
      {
        "@type": ["LocalBusiness", "MusicSchool"],
        "@id": businessId,
        name: SITE_NAME,
        description: SITE_DEFAULT_DESCRIPTION,
        url: SITE_CANONICAL_ORIGIN,
        email: SITE_EMAIL,
        telephone: SITE_PHONE_E164,
        image: absoluteUrl(SITE_OG_IMAGE_PATH),
        areaServed: [
          { "@type": "City", name: "Gdańsk" },
          { "@type": "AdministrativeArea", name: "Pomorskie" },
          { "@type": "Country", name: "Poland" },
        ],
        address: {
          "@type": "PostalAddress",
          addressLocality: "Gdańsk",
          addressRegion: "Pomorskie",
          addressCountry: "PL",
        },
        priceRange: "80-400 PLN",
        knowsAbout: [
          "lekcje gitary",
          "nauka gry na gitarze",
          "lekcje gitary online",
          "setup gitary",
          "e-booki gitarowe",
        ],
        hasOfferCatalog: [
          { "@id": lessonCatalogId },
          { "@id": shopCatalogId },
        ],
        parentOrganization: { "@id": orgId },
      },
      {
        "@type": "OfferCatalog",
        "@id": lessonCatalogId,
        name: "Lekcje gitary — Gdańsk i online",
        url: absoluteUrl("/rezerwacja"),
        itemListElement: lessonOffers.map((offer, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: offer,
        })),
      },
      {
        "@type": "OfferCatalog",
        "@id": shopCatalogId,
        name: "Sklep — e-booki i materiały cyfrowe",
        url: absoluteUrl("/sklep"),
        itemListElement: productNodes.map((product, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: { "@id": product["@id"] },
        })),
      },
      ...productNodes,
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: SITE_CANONICAL_ORIGIN,
        name: SITE_NAME,
        description: SITE_DEFAULT_DESCRIPTION,
        publisher: { "@id": orgId },
        inLanguage: "pl-PL",
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_CANONICAL_ORIGIN}/#faq`,
        url: `${SITE_CANONICAL_ORIGIN}/#faq`,
        mainEntity: SEO_FAQS.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.a,
          },
        })),
      },
    ],
  };
}
