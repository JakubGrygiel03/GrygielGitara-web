export type ShopProductStatus = "coming_soon" | "available";

export type ShopProduct = {
  slug: string;
  title: string;
  priceLabel: string;
  /** Selling price in grosze (Stripe / early-bird base). */
  priceGrosze: number;
  /**
   * Optional “sugerowana” price for anchoring (e.g. ~~129~~ 79).
   * Not charged — display only.
   */
  compareAtGrosze?: number;
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
 * Static showcase catalog — fallback when DB is unavailable.
 * Order: entry → bestseller → VIP (also matches price ascending).
 */
export const shopProducts: ShopProduct[] = [
  {
    slug: "setup-gitary-w-domu",
    title: "Setup i dbanie o gitarę w domu",
    priceLabel: "19,00 zł",
    priceGrosze: 1900,
    badge: "E-book",
    shortDescription:
      "Wymiana strun, czyszczenie i podstawowa regulacja — konkret lutniczy bez warsztatu. Kwota jak za kawę — bez długiego namysłu.",
    image: "/images/shop/ebook-setup-cover.svg",
    imageAlt: "Okładka e-booka Setup i dbanie o gitarę w domu",
    status: "available",
    earlyBirdOpen: true,
  },
  {
    slug: "start-z-gitara-bez-stresu",
    title: "Start z gitarą bez stresu",
    priceLabel: "59,00 zł",
    priceGrosze: 5900,
    compareAtGrosze: 7900,
    badge: "E-book",
    shortDescription:
      "Pierwsze tygodnie gry w jednym handbooku (ok. 40 stron + wideo): postawa, strojenie, melodie i plan 15 minut dziennie — gotowy plan zamiast chaosu w internecie.",
    image: "/images/shop/ebook-start-cover.svg",
    imageAlt: "Okładka e-booka Start z gitarą bez stresu",
    status: "available",
    earlyBirdOpen: true,
  },
  {
    slug: "start-bez-stresu-feedback-vip",
    title: "Start bez stresu + Feedback VIP",
    priceLabel: "119,00 zł",
    priceGrosze: 11900,
    badge: "Pakiet",
    shortDescription:
      "E-book „Start z gitarą bez stresu” plus moja analiza wideo Twojej postawy i ułożenia dłoni — personalny komentarz w przystępnej cenie.",
    image: "/images/shop/ebook-start-cover.svg",
    imageAlt: "Pakiet Start bez stresu + Feedback VIP",
    status: "available",
    earlyBirdOpen: true,
  },
];

/** Early-bird waitlist while product.early_bird_open (fulfill with Stripe coupon at launch). */
export const SHOP_EARLY_BIRD_PERCENT = 30;

export const SHOP_COMING_SOON_HINT = `Ten tytuł jeszcze nie jest w sprzedaży. Zapisz się na listę — przy premierze wyślę kod −${SHOP_EARLY_BIRD_PERCENT}%.`;

export const SHOP_INTEREST_CTA = `Zapisz się po -${SHOP_EARLY_BIRD_PERCENT}%`;

export const SHOP_INTEREST_FORM_HINT = `Dopisujesz się do listy na ten konkretny produkt. Przy jego premierze odezwę się z kodem −${SHOP_EARLY_BIRD_PERCENT}%. Nowe tytuły bez otwartej listy nie dostają tej zniżki automatycznie.`;

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
  return `Proszę o dopisanie do listy oczekujących na „${title}” — chcę −${SHOP_EARLY_BIRD_PERCENT}% przy premierze tego tytułu.`;
}

/** Static compare-at / badge helpers when DB row has no extra columns. */
export function staticCompareAtGrosze(slug: string): number | undefined {
  return shopProducts.find((p) => p.slug === slug)?.compareAtGrosze;
}
