import type { Metadata } from "next";
import Link from "next/link";

import { ShopProductCard } from "@/components/shop-product-card";
import { loadShopCatalog } from "@/lib/shop";
import { isShopSalesOpen } from "@/lib/shop-sales";
import {
  shopInterestHref,
  shopProducts as fallbackProducts,
} from "@/lib/shop-products";
import { formatPricePln, isStripeConfigured } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Sklep — e-booki i materiały",
  description:
    "E-booki GrygielGitara — katalog już dostępny. Zapisz się na listę oczekujących i złap −30% przy premierze konkretnego tytułu.",
};

export default async function SklepPage({
  searchParams,
}: {
  searchParams: Promise<{ anulowano?: string }>;
}) {
  const params = await searchParams;
  const salesOpen = isShopSalesOpen();

  let items: Awaited<ReturnType<typeof loadShopCatalog>>["items"] = [];
  let stripeReady = isStripeConfigured();
  let loggedIn = false;
  let usedFallback = false;

  try {
    const catalog = await loadShopCatalog();
    items = catalog.items;
    stripeReady = catalog.stripeReady;
    loggedIn = Boolean(catalog.userId);
  } catch {
    usedFallback = true;
    items = fallbackProducts.map((product) => ({
      id: `fallback-${product.slug}`,
      slug: product.slug,
      title: product.title,
      shortDescription: product.shortDescription,
      description: "",
      priceLabel: product.priceLabel,
      priceGrosze: product.priceGrosze,
      badge: product.badge,
      image: product.image,
      imageAlt: product.imageAlt,
      comingSoon: product.status === "coming_soon",
      earlyBirdOpen: product.earlyBirdOpen,
      owned: false,
    }));
  }

  const catalogItems = items.map((product) => ({
    ...product,
    comingSoon: !salesOpen || product.comingSoon,
    earlyBirdOpen: product.earlyBirdOpen ?? false,
    priceLabel:
      product.priceGrosze > 0
        ? formatPricePln(product.priceGrosze)
        : product.priceLabel,
  }));

  return (
    <div className="bg-surface">
      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl space-y-3">
            <p className="text-base font-bold uppercase tracking-wide text-sky-600 sm:text-lg">
              Sklep
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              E-booki do nauki gry
            </h1>
            <p className="text-base leading-[1.65] text-slate-700 sm:text-[1.0625rem] sm:leading-relaxed">
              {salesOpen
                ? "Praktyczne materiały PDF na start i dalszą naukę. Kupujesz zalogowany — po płatności plik trafia do Zakupy w koncie i na e-mail."
                : "Praktyczne materiały PDF na start i dalszą naukę. Katalog już możesz przeglądać — sprzedaż włączymy wkrótce."}
            </p>
          </div>
          <p className="shrink-0 text-sm font-medium text-slate-600">
            {catalogItems.length}{" "}
            {catalogItems.length === 1 ? "pozycja" : "pozycje"}
          </p>
        </div>

        {!salesOpen ? (
          <div className="mt-6 rounded-2xl border-2 border-sky-400 bg-sky-50 px-4 py-5 sm:px-6 sm:py-6">
            <p className="text-base font-extrabold tracking-tight text-sky-900 sm:text-lg">
              Premiera wkrótce — dołącz do listy i zgarnij -30%
            </p>
            <p className="mt-2 text-base leading-[1.65] text-slate-800 sm:text-[1.0625rem]">
              Sprzedaż e-booków jeszcze nie wystartowała. Zapisz się na listę
              zainteresowanych przy wybranym tytule, a w dniu premiery wyślemy
              Ci kod rabatowy -30%.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              <Link
                href={shopInterestHref()}
                className="font-semibold text-sky-800 underline-offset-2 hover:underline"
              >
                Masz pytania o materiały? Napisz do mnie.
              </Link>
            </p>
          </div>
        ) : null}

        {params.anulowano ? (
          <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            Płatność anulowana — możesz spróbować ponownie w dowolnej chwili.
          </p>
        ) : null}

        {usedFallback ? (
          <p className="mt-6 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-950">
            Katalog demo (uruchom migrację SQL sklepu w Supabase, żeby włączyć
            prawdziwe produkty).
          </p>
        ) : null}

        {salesOpen && !usedFallback && !stripeReady ? (
          <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            Brak <code className="font-mono">STRIPE_SECRET_KEY</code> — płatności
            będą niedostępne, dopóki nie dodasz klucza.
          </p>
        ) : null}

        <ul className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {catalogItems.map((product) => (
            <li key={product.id}>
              <ShopProductCard
                product={product}
                stripeReady={stripeReady && salesOpen}
                loggedIn={loggedIn}
                salesOpen={salesOpen}
              />
            </li>
          ))}
        </ul>

        <p className="mt-10 max-w-2xl text-base leading-[1.65] text-slate-700 sm:mt-12">
          Masz już dostęp z lekcji? Pliki są w{" "}
          <Link
            href="/moje-kursy"
            className="font-medium text-sky-700 underline-offset-2 hover:underline"
          >
            Zakupy
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
