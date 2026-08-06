import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { ShopEbookCover } from "@/components/shop-ebook-cover";
import { ShopPrice } from "@/components/shop-price";
import { ShopProductCta } from "@/components/shop-product-cta";
import { ShopProductOfferBody } from "@/components/shop-product-offer";
import {
  getOwnedProductIds,
  getPublishedProductBySlug,
} from "@/lib/shop";
import { getShopProductOffer } from "@/lib/shop-product-details";
import { staticEarlyBirdOpen } from "@/lib/shop-early-bird";
import { isShopSalesOpen } from "@/lib/shop-sales";
import {
  shopProducts as fallbackProducts,
  staticCompareAtGrosze,
} from "@/lib/shop-products";
import { formatPricePln, isStripeConfigured } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{ slug: string }>;
};

/** Static slugs only — avoid cookies/DB during build (can 500 a deploy). */
export function generateStaticParams() {
  return fallbackProducts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const offer = getShopProductOffer(slug);
  try {
    const product = await getPublishedProductBySlug(slug);
    if (product) {
      return {
        title: `${product.title} — sklep`,
        description: offer?.subtitle ?? product.short_description,
      };
    }
  } catch {
    // ignore
  }
  const fallback = fallbackProducts.find((p) => p.slug === slug);
  return {
    title: fallback ? `${fallback.title} — sklep` : "Produkt — sklep",
    description: offer?.subtitle ?? fallback?.shortDescription,
  };
}

export default async function SklepProductPage({ params }: PageProps) {
  const { slug } = await params;
  const offer = getShopProductOffer(slug);
  const stripeReady = isStripeConfigured();

  let productRow: Awaited<ReturnType<typeof getPublishedProductBySlug>> = null;
  let owned = false;
  let loggedIn = false;

  try {
    productRow = await getPublishedProductBySlug(slug);
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    loggedIn = Boolean(user);
    if (user && productRow) {
      const ids = await getOwnedProductIds(user.id);
      owned = ids.has(productRow.id);
    }
  } catch {
    productRow = null;
  }

  const fallback = fallbackProducts.find((p) => p.slug === slug);
  if (!productRow && !fallback) {
    notFound();
  }

  const title = productRow?.title ?? fallback!.title;
  const shortDescription =
    productRow?.short_description ?? fallback!.shortDescription;
  const priceGrosze = productRow?.price_grosze ?? fallback!.priceGrosze;
  const priceLabel = productRow
    ? formatPricePln(productRow.price_grosze)
    : fallback!.priceLabel;
  const compareAtGrosze =
    fallback?.compareAtGrosze ?? staticCompareAtGrosze(slug);
  const badge = productRow?.badge ?? fallback!.badge;
  const comingSoon =
    productRow?.coming_soon ?? fallback!.status === "coming_soon";
  const earlyBirdOpen =
    typeof productRow?.early_bird_open === "boolean"
      ? productRow.early_bird_open
      : (fallback?.earlyBirdOpen ?? staticEarlyBirdOpen(slug));
  const productId = productRow?.id ?? `fallback-${slug}`;
  const loginNext = `/sklep/${slug}`;
  const salesOpen = isShopSalesOpen();
  const showAsComingSoon = !salesOpen || comingSoon;

  // Allow buy UI only when sales are open and Stripe is ready.
  const buyReady =
    salesOpen &&
    stripeReady &&
    (Boolean(productRow) || productId.startsWith("fallback-"));
  const showEarlyBirdPrice =
    earlyBirdOpen && (!salesOpen || showAsComingSoon || !buyReady);

  return (
    <div className="bg-surface">
      <article className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <Link
          href="/sklep"
          className="inline-flex items-center gap-2 text-sm font-medium text-sky-700 transition-colors hover:text-sky-900"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Wróć do sklepu
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start lg:gap-14">
          <div className="space-y-4 lg:sticky lg:top-24">
            <ShopEbookCover
              slug={slug}
              title={title}
              badge={badge}
              size="detail"
            />

            <div className="hidden space-y-3 rounded-2xl border border-slate-200 bg-white p-5 lg:block">
              <ShopPrice
                priceGrosze={priceGrosze}
                priceLabel={priceLabel}
                compareAtGrosze={compareAtGrosze}
                showEarlyBird={showEarlyBirdPrice}
                size="detail"
              />
              {offer ? (
                <p className="text-sm text-muted">{offer.editionNote}</p>
              ) : null}
              <ShopProductCta
                product={{
                  id: productId,
                  owned,
                  comingSoon: showAsComingSoon,
                  earlyBirdOpen,
                  slug,
                  title,
                }}
                stripeReady={buyReady}
                loggedIn={loggedIn}
                salesOpen={salesOpen}
                showWaitlistHint
                className="w-full"
                loginNext={loginNext}
              />
            </div>
          </div>

          <div className="space-y-8">
            <header className="space-y-3">
              <p className="text-sm font-bold uppercase tracking-wide text-sky-600">
                {slug === "start-bez-stresu-feedback-vip"
                  ? "Oferta pakietu"
                  : "Oferta e-booka"}
              </p>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                {title}
              </h1>
              <p className="max-w-2xl text-[0.975rem] leading-relaxed text-muted sm:text-base">
                {offer?.subtitle ?? shortDescription}
              </p>
              {slug === "start-z-gitara-bez-stresu" ? (
                <p className="text-sm leading-relaxed text-slate-600">
                  Chcesz najpierw krótki, darmowy tekst o starcie bez bólu
                  palców?{" "}
                  <Link
                    href="/pobierz-poradnik"
                    className="font-medium text-sky-700 underline-offset-2 hover:underline"
                  >
                    Pobierz Gitarowy Falstart
                  </Link>
                </p>
              ) : null}
              <div className="space-y-1 lg:hidden">
                <ShopPrice
                  priceGrosze={priceGrosze}
                  priceLabel={priceLabel}
                  compareAtGrosze={compareAtGrosze}
                  showEarlyBird={showEarlyBirdPrice}
                  size="detail"
                />
                {offer ? (
                  <p className="text-sm text-muted">{offer.editionNote}</p>
                ) : null}
              </div>
              <div className="lg:hidden">
                <ShopProductCta
                  product={{
                    id: productId,
                    owned,
                    comingSoon: showAsComingSoon,
                    earlyBirdOpen,
                    slug,
                    title,
                  }}
                  stripeReady={buyReady}
                  loggedIn={loggedIn}
                  salesOpen={salesOpen}
                  showWaitlistHint
                  className="w-full"
                  loginNext={loginNext}
                />
              </div>
            </header>

            {offer ? (
              <ShopProductOfferBody
                offer={offer}
                priceLabel={priceLabel}
                priceGrosze={priceGrosze}
                compareAtGrosze={compareAtGrosze}
                showEarlyBirdPrice={showEarlyBirdPrice}
                productId={productId}
                productSlug={slug}
                productTitle={title}
                owned={owned}
                comingSoon={showAsComingSoon}
                earlyBirdOpen={earlyBirdOpen}
                stripeReady={buyReady}
                loggedIn={loggedIn}
                salesOpen={salesOpen}
                loginNext={loginNext}
              />
            ) : productRow?.description ? (
              <section className="space-y-2">
                <h2 className="text-base font-bold text-slate-900">Opis</h2>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                  {productRow.description}
                </p>
              </section>
            ) : null}
          </div>
        </div>
      </article>
    </div>
  );
}
