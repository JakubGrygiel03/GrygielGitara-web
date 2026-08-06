import path from "node:path";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { staticEarlyBirdOpen } from "@/lib/shop-early-bird";
import { formatPricePln, isStripeConfigured } from "@/lib/stripe";
import type { Database } from "@/lib/supabase/types";

export type ProductRow = Database["public"]["Tables"]["products"]["Row"];

export type ShopCatalogItem = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  priceLabel: string;
  priceGrosze: number;
  badge: string;
  image: string;
  imageAlt: string;
  comingSoon: boolean;
  /** −30% waitlist open for this title only (frozen at signup). */
  earlyBirdOpen: boolean;
  owned: boolean;
};

export function resolveProductFileAbsolute(filePath: string): string {
  const safe = filePath.replace(/^\/+/, "").replace(/\.\./g, "");
  return path.join(process.cwd(), "public", safe);
}

export async function listPublishedProducts(): Promise<ProductRow[]> {
  // Public read via RLS — do not require service role for the catalog.
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("published", true)
    .order("price_grosze", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as ProductRow[];
}

export async function getOwnedProductIds(userId: string): Promise<Set<string>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_entitlements")
    .select("product_id")
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
  return new Set((data ?? []).map((row) => row.product_id as string));
}

export async function getPublishedProductBySlug(
  slug: string,
): Promise<ProductRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data as ProductRow | null) ?? null;
}

export async function loadShopCatalog(): Promise<{
  items: ShopCatalogItem[];
  stripeReady: boolean;
  userId: string | null;
}> {
  const stripeReady = isStripeConfigured();
  const products = await listPublishedProducts();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let owned = new Set<string>();
  if (user) {
    try {
      owned = await getOwnedProductIds(user.id);
    } catch {
      owned = new Set();
    }
  }

  return {
    stripeReady,
    userId: user?.id ?? null,
    items: products.map((product) => ({
      id: product.id,
      slug: product.slug,
      title: product.title,
      shortDescription: product.short_description,
      description: product.description,
      priceLabel: formatPricePln(product.price_grosze),
      priceGrosze: product.price_grosze,
      badge: product.badge,
      image: product.image_path,
      imageAlt: `Okładka: ${product.title}`,
      comingSoon: product.coming_soon,
      earlyBirdOpen:
        typeof product.early_bird_open === "boolean"
          ? product.early_bird_open
          : staticEarlyBirdOpen(product.slug),
      owned: owned.has(product.id),
    })),
  };
}

export type OwnedPurchase = {
  entitlementId: string;
  productId: string;
  slug: string;
  title: string;
  shortDescription: string;
  priceLabel: string;
  badge: string;
  image: string;
  imageAlt: string;
  purchasedAt: string;
};

export async function loadOwnedPurchases(
  userId: string,
): Promise<OwnedPurchase[]> {
  const admin = createAdminClient();
  const { data: entitlements, error } = await admin
    .from("user_entitlements")
    .select("id, product_id, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  if (!entitlements?.length) return [];

  const productIds = entitlements.map((row) => row.product_id as string);
  const { data: products } = await admin
    .from("products")
    .select(
      "id, title, short_description, price_grosze, badge, image_path, slug",
    )
    .in("id", productIds);

  type ProductMeta = {
    id: string;
    slug: string;
    title: string;
    short_description: string;
    price_grosze: number;
    badge: string;
    image_path: string;
  };

  const byId = new Map(
    (products ?? []).map((p) => [p.id as string, p as ProductMeta]),
  );

  return entitlements.map((row) => {
    const product = byId.get(row.product_id as string);
    const title = product?.title ?? "Produkt";
    return {
      entitlementId: row.id as string,
      productId: row.product_id as string,
      slug: product?.slug ?? row.product_id as string,
      title,
      shortDescription: product?.short_description ?? "Twój zakupiony e-book.",
      priceLabel: product
        ? formatPricePln(product.price_grosze)
        : "Opłacone",
      badge: product?.badge ?? "E-book",
      image: product?.image_path ?? "/images/shop/ebook-start-cover.svg",
      imageAlt: `Okładka: ${title}`,
      purchasedAt: row.created_at as string,
    };
  });
}
