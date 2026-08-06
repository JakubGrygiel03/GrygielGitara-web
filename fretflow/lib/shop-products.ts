export type ShopProductStatus = "coming_soon" | "available";

export type ShopProduct = {
  slug: string;
  title: string;
  priceLabel: string;
  /** Regular price in grosze (for early-bird strike-through math). */
  priceGrosze: number;
  badge: string;
  shortDescription: string;
  image: string;
  imageAlt: string;
  status: ShopProductStatus;
  /**
   * When true, visitors can join the −30% waitlist for THIS title.
   * Turn off at premiere (or never enable for concept/feedback drafts).
   */
  earlyBirdOpen: boolean;
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
    priceGrosze: 4900,
    badge: "E-book",
    shortDescription:
      "Pierwsze tygodnie gry w jednym handbooku (ok. 40 stron + wideo): postawa, strojenie, melodie i plan 15 minut dziennie.",
    image: "/images/shop/ebook-start-cover.svg",
    imageAlt: "Okładka e-booka Start z gitarą bez stresu",
    status: "available",
    earlyBirdOpen: true,
  },
  {
    slug: "setup-gitary-w-domu",
    title: "Setup gitary w domu",
    priceLabel: "39,00 zł",
    priceGrosze: 3900,
    badge: "E-book",
    shortDescription:
      "Wymiana strun, czyszczenie i podstawowa regulacja — bez warsztatu.",
    image: "/images/shop/ebook-setup-cover.svg",
    imageAlt: "Okładka e-booka Setup gitary w domu",
    status: "available",
    earlyBirdOpen: true,
  },
  {
    slug: "rytm-i-timing-na-start",
    title: "Rytm i timing na start",
    priceLabel: "59,00 zł",
    priceGrosze: 5900,
    badge: "E-book",
    shortDescription:
      "Ćwiczenia rytmiczne, które słychać — metronom bez frustracji.",
    image: "/images/shop/ebook-rytm-cover.svg",
    imageAlt: "Okładka e-booka Rytm i timing na start",
    status: "available",
    earlyBirdOpen: true,
  },
];

/** Early-bird waitlist while product.early_bird_open (fulfill with Stripe coupon at launch). */
export const SHOP_EARLY_BIRD_PERCENT = 30;

export const SHOP_COMING_SOON_HINT = `Ten tytuł jeszcze nie jest w sprzedaży. Zapisz się na listę — przy premierze wyślę kod −${SHOP_EARLY_BIRD_PERCENT}%.`;

export const SHOP_INTEREST_CTA = `Zapisz się po -${SHOP_EARLY_BIRD_PERCENT}%`;

export const SHOP_INTEREST_FORM_HINT = `Dopisujesz się do listy na ten konkretny e-book. Przy jego premierze odezwę się z kodem −${SHOP_EARLY_BIRD_PERCENT}%. Nowe tytuły / koncepty bez otwartej listy nie dostają tej zniżki automatycznie.`;

export function shopInterestHref(product?: {
  slug?: string;
  title?: string;
}): string {
  const params = new URLSearchParams({ temat: "shop_support" });
  if (product?.slug) params.set("produkt", product.slug);
  if (product?.title) params.set("tytul", product.title);
  return `/kontakt?${params.toString()}`;
}

export function shopInterestPrefillMessage(title: string): string {
  return `Proszę o dopisanie do listy oczekujących na e-book „${title}” — chcę −${SHOP_EARLY_BIRD_PERCENT}% przy premierze tego tytułu.`;
}
