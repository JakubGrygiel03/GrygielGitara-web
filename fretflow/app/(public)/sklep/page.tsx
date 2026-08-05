import type { Metadata } from "next";
import Link from "next/link";

import { ShopProductCard } from "@/components/shop-product-card";
import { loadShopCatalog } from "@/lib/shop";
import { shopProducts as fallbackProducts } from "@/lib/shop-products";
import { formatPricePln, isStripeConfigured } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Sklep — e-booki i materiały",
  description:
    "Kup e-booki GrygielGitara online. Po płatności PDF w koncie i na e-mailu.",
};

export default async function SklepPage({
  searchParams,
}: {
  searchParams: Promise<{ anulowano?: string }>;
}) {
  const params = await searchParams;
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
      priceGrosze: 0,
      badge: product.badge,
      image: product.image,
      imageAlt: product.imageAlt,
      comingSoon: product.status === "coming_soon",
      owned: false,
    }));
  }

  return (
    <div className="bg-surface">
      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl space-y-3">
            <p className="text-base font-bold uppercase tracking-wide text-sky-600 sm:text-lg">
              Sklep
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              E-booki, które pomagają grać
            </h1>
            <p className="text-[0.9375rem] leading-relaxed text-muted sm:text-base">
              Kupujesz zalogowany — po płatności Stripe PDF trafia do sekcji
              Zakupy w koncie i na e-mail.{" "}
              {!stripeReady
                ? "Płatności online włączymy po dodaniu kluczy Stripe."
                : null}
            </p>
          </div>
          <p className="shrink-0 text-sm font-medium text-slate-600">
            {items.length} {items.length === 1 ? "pozycja" : "pozycje"}
          </p>
        </div>

        {params.anulowano ? (
          <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            Płatność anulowana — możesz spróbować ponownie w dowolnej chwili.
          </p>
        ) : null}

        {usedFallback ? (
          <p className="mt-6 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-950">
            Katalog demo (uruchom migrację SQL sklepu w Supabase, żeby włączyć
            prawdziwe produkty i płatności).
          </p>
        ) : null}

        {!usedFallback && !stripeReady ? (
          <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            Brak <code className="font-mono">STRIPE_SECRET_KEY</code> na Vercel —
            dodaj klucz i zrób Redeploy, wtedy pojawi się „Kup teraz”.
          </p>
        ) : null}

        <ul className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {items.map((product) => (
            <li key={product.id}>
              <ShopProductCard
                product={{
                  ...product,
                  priceLabel:
                    product.priceGrosze > 0
                      ? formatPricePln(product.priceGrosze)
                      : product.priceLabel,
                }}
                stripeReady={stripeReady && !usedFallback}
                loggedIn={loggedIn}
              />
            </li>
          ))}
        </ul>

        <p className="mt-10 max-w-2xl text-sm leading-relaxed text-muted sm:mt-12">
          Po zakupie materiały są w{" "}
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
