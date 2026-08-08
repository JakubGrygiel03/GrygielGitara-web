import type {
  AdminShopProduct,
  AdminShopStats,
  ShopEarlyBirdRow,
  ShopEntitlementRow,
  ShopProductPerf,
  ShopRevenueEntry,
} from "@/lib/admin-types";

function monthBounds(d: Date) {
  const start = new Date(d.getFullYear(), d.getMonth(), 1);
  const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
  return { start, end };
}

function inRange(isoDate: string, start: Date, end: Date) {
  const t = new Date(isoDate).getTime();
  return t >= start.getTime() && t <= end.getTime();
}

function isStripeNote(note: string | null) {
  return Boolean(note && /stripe/i.test(note));
}

function isPrimarySale(row: ShopEntitlementRow) {
  if (row.source === "admin") return true;
  const sid = row.stripe_checkout_session_id ?? "";
  return !sid.includes(":bonus:");
}

export const EMPTY_ADMIN_SHOP_STATS: AdminShopStats = {
  monthLabel: "",
  monthRevenue: 0,
  lastMonthRevenue: 0,
  allTimeRevenue: 0,
  monthStripeRevenue: 0,
  monthManualRevenue: 0,
  allTimeStripeRevenue: 0,
  allTimeManualRevenue: 0,
  monthUnits: 0,
  allTimeUnits: 0,
  monthStripeUnits: 0,
  monthAdminGrants: 0,
  avgOrderValueMonth: 0,
  monthVsLastPct: null,
  earlyBirdWaitingTotal: 0,
  products: [],
  recentSales: [],
};

export function buildAdminShopStats(input: {
  products: AdminShopProduct[];
  revenue: ShopRevenueEntry[];
  entitlements: ShopEntitlementRow[];
  earlyBird: ShopEarlyBirdRow[];
  now?: Date;
}): AdminShopStats {
  const now = input.now ?? new Date();
  const { start: monthStart, end: monthEnd } = monthBounds(now);
  const lastRef = new Date(now.getFullYear(), now.getMonth() - 1, 15);
  const { start: lastStart, end: lastEnd } = monthBounds(lastRef);

  const monthLabel = new Intl.DateTimeFormat("pl-PL", {
    month: "long",
    year: "numeric",
  }).format(now);

  const shopRevenue = input.revenue.filter((r) => r.category === "shop");

  let monthRevenue = 0;
  let lastMonthRevenue = 0;
  let allTimeRevenue = 0;
  let monthStripeRevenue = 0;
  let monthManualRevenue = 0;
  let allTimeStripeRevenue = 0;
  let allTimeManualRevenue = 0;

  for (const row of shopRevenue) {
    const amount = Number(row.amount) || 0;
    allTimeRevenue += amount;
    const stripe = isStripeNote(row.note);
    if (stripe) allTimeStripeRevenue += amount;
    else allTimeManualRevenue += amount;

    if (inRange(row.occurred_on, monthStart, monthEnd)) {
      monthRevenue += amount;
      if (stripe) monthStripeRevenue += amount;
      else monthManualRevenue += amount;
    }
    if (inRange(row.occurred_on, lastStart, lastEnd)) {
      lastMonthRevenue += amount;
    }
  }

  const sales = input.entitlements.filter(isPrimarySale);
  const monthUnits = sales.filter((e) =>
    inRange(e.created_at, monthStart, monthEnd),
  ).length;
  const allTimeUnits = sales.length;
  const monthStripeUnits = sales.filter(
    (e) =>
      e.source === "stripe" && inRange(e.created_at, monthStart, monthEnd),
  ).length;
  const monthAdminGrants = sales.filter(
    (e) => e.source === "admin" && inRange(e.created_at, monthStart, monthEnd),
  ).length;

  const avgOrderValueMonth =
    monthStripeUnits > 0
      ? monthStripeRevenue / monthStripeUnits
      : monthUnits > 0
        ? monthRevenue / monthUnits
        : 0;

  let monthVsLastPct: number | null = null;
  if (lastMonthRevenue > 0) {
    monthVsLastPct =
      Math.round(((monthRevenue - lastMonthRevenue) / lastMonthRevenue) * 1000) /
      10;
  } else if (monthRevenue > 0) {
    monthVsLastPct = null;
  }

  const earlyBySlug = new Map<string, number>();
  let earlyBirdWaitingTotal = 0;
  for (const row of input.earlyBird) {
    if (row.status !== "waiting") continue;
    earlyBirdWaitingTotal += 1;
    earlyBySlug.set(
      row.product_slug,
      (earlyBySlug.get(row.product_slug) ?? 0) + 1,
    );
  }

  const productPerf: ShopProductPerf[] = input.products.map((p) => {
    const forProduct = sales.filter((e) => e.product_id === p.id);
    const stripeSales = forProduct.filter((e) => e.source === "stripe").length;
    const adminGrants = forProduct.filter((e) => e.source === "admin").length;
    const monthStripeSales = forProduct.filter(
      (e) =>
        e.source === "stripe" && inRange(e.created_at, monthStart, monthEnd),
    ).length;
    const monthAdminGrantsCount = forProduct.filter(
      (e) =>
        e.source === "admin" && inRange(e.created_at, monthStart, monthEnd),
    ).length;
    return {
      id: p.id,
      slug: p.slug,
      title: p.title,
      priceGrosze: p.price_grosze ?? 0,
      published: p.published,
      comingSoon: p.coming_soon,
      earlyBirdOpen: Boolean(p.early_bird_open),
      stripeSales,
      adminGrants,
      monthStripeSales,
      monthAdminGrants: monthAdminGrantsCount,
      earlyBirdWaiting: earlyBySlug.get(p.slug) ?? 0,
    };
  });

  productPerf.sort((a, b) => {
    const scoreA = a.monthStripeSales * 1000 + a.stripeSales;
    const scoreB = b.monthStripeSales * 1000 + b.stripeSales;
    return scoreB - scoreA || a.title.localeCompare(b.title, "pl");
  });

  const recentSales = [...shopRevenue]
    .sort(
      (a, b) =>
        new Date(b.occurred_on).getTime() - new Date(a.occurred_on).getTime() ||
        b.id.localeCompare(a.id),
    )
    .slice(0, 20);

  return {
    monthLabel,
    monthRevenue,
    lastMonthRevenue,
    allTimeRevenue,
    monthStripeRevenue,
    monthManualRevenue,
    allTimeStripeRevenue,
    allTimeManualRevenue,
    monthUnits,
    allTimeUnits,
    monthStripeUnits,
    monthAdminGrants,
    avgOrderValueMonth,
    monthVsLastPct,
    earlyBirdWaitingTotal,
    products: productPerf,
    recentSales,
  };
}
