export type ShopProductStatus = "coming_soon" | "available";

export type ShopProduct = {
  slug: string;
  title: string;
  priceLabel: string;
  badge: string;
  shortDescription: string;
  image: string;
  imageAlt: string;
  status: ShopProductStatus;
};

/**
 * Static showcase catalog — no Stripe / DB yet.
 * CTA goes to contact with topic shop_support.
 */
export const shopProducts: ShopProduct[] = [
  {
    slug: "start-z-gitara-bez-stresu",
    title: "Start z gitarą bez stresu",
    priceLabel: "49,00 zł",
    badge: "E-book",
    shortDescription:
      "Pierwsze tygodnie gry: postawa, strojenie i proste melodie bez szkolnego rygoru.",
    image: "/images/shop/ebook-start-cover.svg",
    imageAlt: "Okładka e-booka Start z gitarą bez stresu",
    status: "available",
  },
  {
    slug: "setup-gitary-w-domu",
    title: "Setup gitary w domu",
    priceLabel: "39,00 zł",
    badge: "E-book",
    shortDescription:
      "Wymiana strun, czyszczenie i podstawowa regulacja — bez warsztatu.",
    image: "/images/shop/ebook-setup-cover.svg",
    imageAlt: "Okładka e-booka Setup gitary w domu",
    status: "available",
  },
  {
    slug: "test-emaila-zakupu",
    title: "Test e-maila: Setup gitary",
    priceLabel: "1,00 zł",
    badge: "Test",
    shortDescription:
      "1 zł w Stripe Test — ten sam mail i PDF co Setup, żeby sprawdzić skrzynkę.",
    image: "/images/shop/ebook-setup-cover.svg",
    imageAlt: "Produkt testowy e-maila po zakupie",
    status: "available",
  },
  {
    slug: "rytm-i-timing-na-start",
    title: "Rytm i timing na start",
    priceLabel: "59,00 zł",
    badge: "E-book",
    shortDescription:
      "Ćwiczenia rytmiczne, które słychać — metronom bez frustracji.",
    image: "/images/shop/ebook-rytm-cover.svg",
    imageAlt: "Okładka e-booka Rytm i timing na start",
    status: "available",
  },
];

export const shopInterestHref = "/kontakt?temat=shop_support" as const;
