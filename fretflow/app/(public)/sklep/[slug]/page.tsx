import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";

import { ShopProductCta } from "@/components/shop-product-cta";
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
  try {
    const product = await getPublishedProductBySlug(slug);
    if (product) {
      return {
        title: `${product.title} — sklep`,
        description: product.short_description,
      };
    }
  } catch {
    // ignore
  }
  const fallback = fallbackProducts.find((p) => p.slug === slug);
  return {
    title: fallback ? `${fallback.title} — sklep` : "Produkt — sklep",
    description: fallback?.shortDescription,
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
  const comingSoon = productRow?.coming_soon ?? fallback!.status === "coming_soon";
  const productId = productRow?.id ?? `fallback-${slug}`;

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

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-14">
          <div className="relative flex aspect-[5/4] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-slate-100 to-sky-50/80 px-8 py-10 shadow-[0_1px_0_rgba(15,23,42,0.04),0_12px_32px_-16px_rgba(14,165,233,0.35)] lg:sticky lg:top-24">
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

          <div className="space-y-8">
            <header className="space-y-3">
              <p className="text-sm font-bold uppercase tracking-wide text-sky-600">
                Oferta e-booka
              </p>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                {title}
              </h1>
              <p className="max-w-xl text-[0.975rem] leading-relaxed text-muted sm:text-base">
                {offer?.lead ?? shortDescription}
              </p>
              <p className="text-xl font-semibold tabular-nums text-slate-900">
                {priceLabel}
              </p>
            </header>

            <ShopProductCta
              product={{ id: productId, owned, comingSoon }}
              stripeReady={stripeReady && Boolean(productRow)}
              loggedIn={loggedIn}
              className="w-full sm:w-auto sm:min-w-[12rem]"
              loginNext={`/sklep/${slug}`}
            />

            {offer ? (
              <>
                <section className="space-y-3">
                  <h2 className="text-base font-bold text-slate-900">
                    Dla kogo
                  </h2>
                  <ul className="space-y-2">
                    {offer.forWhom.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2.5 text-sm leading-relaxed text-slate-700"
                      >
                        <Check
                          className="mt-0.5 size-4 shrink-0 text-sky-600"
                          aria-hidden
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="space-y-3">
                  <h2 className="text-base font-bold text-slate-900">
                    Co dostajesz
                  </h2>
                  <ul className="space-y-2">
                    {offer.youGet.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2.5 text-sm leading-relaxed text-slate-700"
                      >
                        <Check
                          className="mt-0.5 size-4 shrink-0 text-sky-600"
                          aria-hidden
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="space-y-3">
                  <h2 className="text-base font-bold text-slate-900">
                    Co jest w środku
                  </h2>
                  <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-slate-700">
                    {offer.topics.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ol>
                </section>

                <p className="text-sm text-muted">{offer.formatNote}</p>
              </>
            ) : productRow?.description ? (
              <section className="space-y-2">
                <h2 className="text-base font-bold text-slate-900">Opis</h2>
                <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                  {productRow.description}
                </p>
              </section>
            ) : null}

            <p className="text-sm text-muted">
              Po zakupie PDF znajdziesz w{" "}
              <Link
                href="/moje-kursy#zakupy"
                className="font-medium text-sky-700 underline-offset-2 hover:underline"
              >
                Zakupach
              </Link>{" "}
              w koncie.
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}
