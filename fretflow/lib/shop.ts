import path from "node:path";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
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
  owned: boolean;
};

export function resolveProductFileAbsolute(filePath: string): string {
  const safe = filePath.replace(/^\/+/, "").replace(/\.\./g, "");
  return path.join(process.cwd(), "public", safe);
}

export async function listPublishedProducts(): Promise<ProductRow[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("products")
    .select("*")
    .eq("published", true)
    .order("price_grosze", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as ProductRow[];
}

export async function getOwnedProductIds(userId: string): Promise<Set<string>> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("user_entitlements")
    .select("product_id")
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
  return new Set((data ?? []).map((row) => row.product_id as string));
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

  const owned = user ? await getOwnedProductIds(user.id) : new Set<string>();

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
      owned: owned.has(product.id),
    })),
  };
}

export async function loadOwnedPurchases(userId: string): Promise<
  {
    entitlementId: string;
    productId: string;
    title: string;
    purchasedAt: string;
  }[]
> {
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
    .select("id, title")
    .in("id", productIds);

  const titleById = new Map(
    (products ?? []).map((p) => [p.id as string, p.title as string]),
  );

  return entitlements.map((row) => ({
    entitlementId: row.id as string,
    productId: row.product_id as string,
    title: titleById.get(row.product_id as string) ?? "Produkt",
    purchasedAt: row.created_at as string,
  }));
}
