import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { ShopProductCta } from "@/components/shop-product-cta";
import { ShopProductOfferBody } from "@/components/shop-product-offer";
import {
  getOwnedProductIds,
  getPublishedProductBySlug,
  listPublishedProducts,
} from "@/lib/shop";
import { getShopProductOffer } from "@/lib/shop-product-details";
import { shopProducts as fallbackProducts } from "@/lib/shop-products";
import { formatPricePln, isStripeConfigured } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  try {
    const products = await listPublishedProducts();
    if (products.length) {
      return products.map((p) => ({ slug: p.slug }));
    }
  } catch {
    // fallback below
  }
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
  const priceLabel = productRow
    ? formatPricePln(productRow.price_grosze)
    : fallback!.priceLabel;
  const badge = productRow?.badge ?? fallback!.badge;
  const image = productRow?.image_path ?? fallback!.image;
  const imageAlt = `Okładka: ${title}`;
  const comingSoon =
    productRow?.coming_soon ?? fallback!.status === "coming_soon";
  const productId = productRow?.id ?? `fallback-${slug}`;
  const loginNext = `/sklep/${slug}`;

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
            <div className="relative flex aspect-[5/4] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-slate-100 to-sky-50/80 px-8 py-10 shadow-[0_1px_0_rgba(15,23,42,0.04),0_12px_32px_-16px_rgba(14,165,233,0.35)]">
              <div className="relative aspect-[3/4] w-[48%] max-w-[11rem] rotate-[-2deg] shadow-[0_18px_40px_-12px_rgba(15,23,42,0.45)]">
                {image.endsWith(".svg") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={image}
                    alt={imageAlt}
                    className="h-full w-full rounded-sm object-cover"
                  />
                ) : (
                  <Image
                    src={image}
                    alt={imageAlt}
                    fill
                    sizes="11rem"
                    className="rounded-sm object-cover"
                    priority
                  />
                )}
              </div>
              <span className="absolute left-4 top-4 rounded-md bg-slate-900/90 px-2 py-1 text-[0.65rem] font-bold uppercase tracking-[0.08em] text-white">
                {badge}
              </span>
            </div>

            <div className="hidden space-y-3 rounded-2xl border border-slate-200 bg-white p-5 lg:block">
              <p className="text-sm text-muted line-through">
                {offer?.regularValueLabel}
              </p>
              <p className="text-2xl font-bold tabular-nums text-slate-900">
                {priceLabel}
              </p>
              <ShopProductCta
                product={{ id: productId, owned, comingSoon }}
                stripeReady={stripeReady && Boolean(productRow)}
                loggedIn={loggedIn}
                className="w-full"
                loginNext={loginNext}
              />
            </div>
          </div>

          <div className="space-y-8">
            <header className="space-y-3">
              <p className="text-sm font-bold uppercase tracking-wide text-sky-600">
                Oferta e-booka
              </p>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                {title}
              </h1>
              <p className="max-w-2xl text-[0.975rem] leading-relaxed text-muted sm:text-base">
                {offer?.subtitle ?? shortDescription}
              </p>
              <div className="flex flex-wrap items-baseline gap-3 lg:hidden">
                {offer ? (
                  <p className="text-sm text-muted line-through">
                    {offer.regularValueLabel}
                  </p>
                ) : null}
                <p className="text-xl font-semibold tabular-nums text-slate-900">
                  {priceLabel}
                </p>
              </div>
              <div className="lg:hidden">
                <ShopProductCta
                  product={{ id: productId, owned, comingSoon }}
                  stripeReady={stripeReady && Boolean(productRow)}
                  loggedIn={loggedIn}
                  className="w-full"
                  loginNext={loginNext}
                />
              </div>
            </header>

            {offer ? (
              <ShopProductOfferBody
                offer={offer}
                priceLabel={priceLabel}
                productId={productId}
                owned={owned}
                comingSoon={comingSoon}
                stripeReady={stripeReady && Boolean(productRow)}
                loggedIn={loggedIn}
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
