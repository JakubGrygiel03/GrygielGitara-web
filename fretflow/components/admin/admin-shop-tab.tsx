"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  grantShopProducts,
  lookupShopAccountByEmail,
  type ShopAccountLookup,
} from "@/app/actions/admin-shop";
import { addRevenueEntry } from "@/app/actions/admin-students-extra";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type {
  AdminShopAccountOption,
  AdminShopProduct,
  AdminShopStats,
} from "@/lib/admin-types";

const money = new Intl.NumberFormat("pl-PL", {
  style: "currency",
  currency: "PLN",
  maximumFractionDigits: 2,
});

const datePl = new Intl.DateTimeFormat("pl-PL", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

/** Hide long Stripe session ids from the sales list label. */
function formatShopSaleNote(note: string | null) {
  const raw = note?.trim();
  if (!raw) return "Sprzedaż sklepowa";
  const cleaned = raw
    .replace(/\s*·\s*Stripe\s+cs_(test|live)_[A-Za-z0-9]+/gi, " · Stripe")
    .replace(/\bcs_(test|live)_[A-Za-z0-9]+\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s*·\s*$/g, "")
    .trim();
  return cleaned || "Sprzedaż sklepowa";
}

type ShopPanel = "overview" | "access" | "manual";

function KpiCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={
        accent
          ? "rounded-2xl border border-sky-400 bg-gradient-to-br from-sky-100 to-white p-4 shadow-sm sm:p-5"
          : "rounded-2xl border border-slate-300 bg-white p-4 shadow-sm sm:p-5"
      }
    >
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900">
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs leading-snug text-slate-600">{hint}</p> : null}
    </div>
  );
}

export function AdminShopTab({
  products,
  shopAccounts,
  shopStats,
}: {
  products: AdminShopProduct[];
  shopAccounts: AdminShopAccountOption[];
  shopStats: AdminShopStats;
}) {
  const router = useRouter();
  const [panel, setPanel] = useState<ShopPanel>("overview");
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [account, setAccount] = useState<ShopAccountLookup | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [cash, setCash] = useState({
    amount: "",
    note: "",
    occurredOn: new Date().toISOString().slice(0, 10),
  });

  const ownedSet = useMemo(
    () => new Set(account?.ownedProductIds ?? []),
    [account],
  );

  const searchableProducts = useMemo(
    () =>
      [...products].sort((a, b) =>
        a.title.localeCompare(b.title, "pl", { sensitivity: "base" }),
      ),
    [products],
  );

  const filteredAccounts = useMemo(() => {
    const q = email.trim().toLowerCase();
    const list = !q
      ? shopAccounts
      : shopAccounts.filter((item) => {
          const hay = `${item.email} ${item.label ?? ""}`.toLowerCase();
          return hay.includes(q);
        });
    return list.slice(0, 40);
  }, [email, shopAccounts]);

  const vsLastHint =
    shopStats.monthVsLastPct == null
      ? shopStats.lastMonthRevenue > 0
        ? `Poprzedni miesiąc: ${money.format(shopStats.lastMonthRevenue)}`
        : shopStats.monthRevenue > 0
          ? "Brak sprzedaży w poprzednim miesiącu"
          : "Brak porównania z poprzednim miesiącem"
      : `${shopStats.monthVsLastPct > 0 ? "+" : ""}${shopStats.monthVsLastPct}% vs poprzedni miesiąc (${money.format(shopStats.lastMonthRevenue)})`;

  function toggleProduct(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function runSearch(emailOverride?: string) {
    const query = (emailOverride ?? email).trim();
    if (emailOverride) setEmail(emailOverride);

    startTransition(async () => {
      const result = await lookupShopAccountByEmail(query);
      if (!result.ok || !result.account) {
        setAccount(null);
        setSelected([]);
        toast.error(result.message);
        return;
      }
      setAccount(result.account);
      setSelected([]);
      toast.success(result.message);
    });
  }

  function runGrant() {
    if (!account) return;
    startTransition(async () => {
      const result = await grantShopProducts({
        userId: account.userId,
        productIds: selected,
        notifyEmail,
      });
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      const refreshed = await lookupShopAccountByEmail(account.email);
      if (refreshed.ok && refreshed.account) {
        setAccount(refreshed.account);
        setSelected([]);
      }
      router.refresh();
    });
  }

  const panels: { id: ShopPanel; label: string }[] = [
    { id: "overview", label: "Przegląd" },
    { id: "access", label: "Nadaj dostęp" },
    { id: "manual", label: "Ręczna sprzedaż" },
  ];

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Sklep</h2>
          <p className="mt-1 text-sm text-slate-600">
            Przegląd = liczby i sprzedaż. Nadaj dostęp / Ręczna sprzedaż =
            operacje bez Stripe.
          </p>
        </div>
        <nav
          className="flex flex-wrap gap-1 rounded-xl border border-slate-300 bg-slate-50 p-1"
          aria-label="Panel sklepu"
        >
          {panels.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setPanel(item.id)}
              className={
                panel === item.id
                  ? "rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-slate-900 shadow-sm"
                  : "rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-white/70"
              }
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {panel === "overview" ? (
        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              accent
              label={`Przychód · ${shopStats.monthLabel}`}
              value={money.format(shopStats.monthRevenue)}
              hint={vsLastHint}
            />
            <KpiCard
              label="Przychód łącznie"
              value={money.format(shopStats.allTimeRevenue)}
              hint={`Stripe ${money.format(shopStats.allTimeStripeRevenue)} · ręcznie ${money.format(shopStats.allTimeManualRevenue)}`}
            />
            <KpiCard
              label="Sprzedaże w tym miesiącu"
              value={String(shopStats.monthUnits)}
              hint={`Stripe: ${shopStats.monthStripeUnits} · nadania admin: ${shopStats.monthAdminGrants}`}
            />
            <KpiCard
              label="Śr. koszyk (miesiąc)"
              value={
                shopStats.avgOrderValueMonth > 0
                  ? money.format(shopStats.avgOrderValueMonth)
                  : "—"
              }
              hint={`Jednostki łącznie: ${shopStats.allTimeUnits}`}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <KpiCard
              label="Stripe w tym miesiącu"
              value={money.format(shopStats.monthStripeRevenue)}
              hint={`${shopStats.monthStripeUnits} płatności online`}
            />
            <KpiCard
              label="Ręcznie w tym miesiącu"
              value={money.format(shopStats.monthManualRevenue)}
              hint="Wpisy kasowe spoza Stripe"
            />
            <KpiCard
              label="Lista −30% (czekają)"
              value={String(shopStats.earlyBirdWaitingTotal)}
              hint="Osoby waiting na kod przy premierze"
            />
          </div>

          <div className="rounded-2xl border border-slate-300 bg-white">
            <div className="border-b border-slate-300 px-4 py-3 sm:px-5">
              <h3 className="font-semibold text-slate-900">
                Produkty — wyniki
              </h3>
              <p className="text-sm text-slate-600">
                Sprzedaże Stripe, nadania ręczne i lista early-bird per tytuł.
              </p>
            </div>
            {shopStats.products.length === 0 ? (
              <p className="px-4 py-6 text-sm text-slate-600 sm:px-5">
                Brak produktów w bazie.
              </p>
            ) : (
              <ul className="divide-y divide-slate-200">
                {shopStats.products.map((p) => (
                  <li
                    key={p.id}
                    className="flex flex-col gap-2 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900">{p.title}</p>
                      <p className="text-sm text-slate-600">
                        {money.format(p.priceGrosze / 100)}
                        {!p.published ? " · ukryty" : ""}
                        {p.comingSoon ? " · wkrótce" : ""}
                        {p.earlyBirdOpen ? " · lista −30% otwarta" : ""}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-700">
                      <span>
                        <span className="font-semibold text-slate-900">
                          {p.monthStripeSales}
                        </span>{" "}
                        Stripe / mies.
                      </span>
                      <span>
                        <span className="font-semibold text-slate-900">
                          {p.stripeSales}
                        </span>{" "}
                        Stripe łącznie
                      </span>
                      <span>
                        <span className="font-semibold text-slate-900">
                          {p.adminGrants}
                        </span>{" "}
                        admin
                      </span>
                      <span>
                        <span className="font-semibold text-slate-900">
                          {p.earlyBirdWaiting}
                        </span>{" "}
                        na −30%
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-2xl border border-slate-300 bg-white">
            <div className="border-b border-slate-300 px-4 py-3 sm:px-5">
              <h3 className="font-semibold text-slate-900">
                Ostatnie wpływy sklepowe
              </h3>
              <p className="text-sm text-slate-600">
                Wpisy kasowe sklepu (Stripe + ręczne).
              </p>
            </div>
            {shopStats.recentSales.length === 0 ? (
              <p className="px-4 py-6 text-sm text-slate-600 sm:px-5">
                Brak wpisów sprzedaży. Pierwsza płatność Stripe albo ręczny wpis
                pojawi się tutaj.
              </p>
            ) : (
              <ul className="divide-y divide-slate-200">
                {shopStats.recentSales.map((row) => {
                  const stripe = Boolean(
                    row.note && /stripe/i.test(row.note),
                  );
                  return (
                    <li
                      key={row.id}
                      className="flex items-start justify-between gap-4 px-4 py-3 sm:items-center sm:px-5"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-slate-900">
                          {formatShopSaleNote(row.note)}
                        </p>
                        <p className="text-sm text-slate-600">
                          {datePl.format(new Date(row.occurred_on))} ·{" "}
                          {stripe ? "Stripe" : "Ręcznie"}
                        </p>
                      </div>
                      <p className="shrink-0 whitespace-nowrap text-right text-base font-semibold tabular-nums text-slate-900">
                        {money.format(Number(row.amount))}
                      </p>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      ) : null}

      {panel === "access" ? (
        <div className="space-y-6">
          <p className="text-sm text-slate-600">
            Wyszukaj konto i przypisz e-booki bez Stripe (np. prezent, reklamacja,
            sprzedaż poza stroną).
          </p>

          <div className="space-y-3 rounded-2xl border border-slate-300 bg-white p-4 shadow-sm sm:p-5">
            <div className="space-y-1.5">
              <Label htmlFor="shop-email">E-mail konta</Label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  id="shop-email"
                  type="search"
                  autoComplete="off"
                  placeholder="Filtruj: e-mail lub imię…"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      runSearch();
                    }
                  }}
                />
                <Button
                  type="button"
                  disabled={isPending || !email.trim()}
                  onClick={() => runSearch()}
                >
                  Szukaj
                </Button>
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
                Konta ({filteredAccounts.length}
                {shopAccounts.length > filteredAccounts.length
                  ? ` z ${shopAccounts.length}`
                  : ""}
                )
              </p>
              {shopAccounts.length === 0 ? (
                <p className="text-sm text-slate-600">
                  Brak kont do podpowiedzi. Jak ktoś się zarejestruje albo dodasz
                  ucznia — pojawi się tu.
                </p>
              ) : filteredAccounts.length === 0 ? (
                <p className="text-sm text-slate-600">
                  Nic nie pasuje do „{email.trim()}”.
                </p>
              ) : (
                <ul className="max-h-64 overflow-y-auto rounded-2xl border border-slate-300">
                  {filteredAccounts.map((item, index) => (
                    <li
                      key={item.email}
                      className={index > 0 ? "border-t border-slate-300" : ""}
                    >
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => runSearch(item.email)}
                        className="flex w-full items-start justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-sky-50"
                      >
                        <span className="min-w-0">
                          <span className="block font-semibold text-slate-900">
                            {item.email}
                          </span>
                          {item.label ? (
                            <span className="block text-sm text-slate-600">
                              {item.label}
                            </span>
                          ) : null}
                        </span>
                        <span className="shrink-0 text-sm font-semibold text-sky-700">
                          Wybierz
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {account ? (
            <div className="space-y-4 rounded-2xl border border-slate-300 bg-white p-4 shadow-sm sm:p-5">
              <div>
                <p className="font-semibold text-slate-900">{account.email}</p>
                <p className="text-sm text-slate-600">
                  {account.studentName
                    ? `Uczeń CRM: ${account.studentName}`
                    : "Konto sklepowe (bez wpisu w Uczniowie)"}
                  {" · "}
                  ID:{" "}
                  <span className="font-mono text-xs">{account.userId}</span>
                </p>
              </div>

              {searchableProducts.length === 0 ? (
                <p className="text-sm text-slate-600">
                  Brak produktów w bazie. Odpal migrację sklepu w Supabase.
                </p>
              ) : (
                <ul className="overflow-hidden rounded-2xl border border-slate-300">
                  {searchableProducts.map((product, index) => {
                    const owned = ownedSet.has(product.id);
                    return (
                      <li
                        key={product.id}
                        className={
                          index > 0
                            ? "border-t border-slate-300 px-4 py-3"
                            : "px-4 py-3"
                        }
                      >
                        <label className="flex cursor-pointer items-start gap-3">
                          <input
                            type="checkbox"
                            className="mt-1 size-4 accent-sky-500"
                            checked={selected.includes(product.id)}
                            disabled={owned || isPending}
                            onChange={() => toggleProduct(product.id)}
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block font-semibold text-slate-900">
                              {product.title}
                            </span>
                            <span className="block text-sm text-slate-600">
                              {product.slug}
                              {!product.published ? " · ukryty w sklepie" : ""}
                              {product.coming_soon ? " · wkrótce" : ""}
                              {owned ? " · już na koncie" : ""}
                            </span>
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              )}

              <label className="flex items-start gap-2 text-sm text-slate-800">
                <input
                  type="checkbox"
                  checked={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.checked)}
                  className="mt-0.5 size-4 rounded border-slate-300 text-sky-600"
                />
                <span>
                  Wyślij e-mail o przypisaniu materiału do konta (inna treść niż
                  po zakupie Stripe; z PDF jeśli dostępny)
                </span>
              </label>

              <Button
                type="button"
                disabled={isPending || selected.length === 0}
                onClick={runGrant}
              >
                {notifyEmail
                  ? `Nadaj dostęp i wyślij mail (${selected.length})`
                  : `Nadaj dostęp (${selected.length})`}
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}

      {panel === "manual" ? (
        <form
          className="space-y-3 rounded-2xl border border-slate-300 bg-white p-4 shadow-sm sm:p-5"
          onSubmit={(event) => {
            event.preventDefault();
            startTransition(async () => {
              const result = await addRevenueEntry({
                category: "shop",
                amount: cash.amount,
                note: cash.note,
                occurredOn: cash.occurredOn,
              });
              if (!result.ok) {
                toast.error(result.message);
                return;
              }
              toast.success(result.message);
              setCash((p) => ({ ...p, amount: "", note: "" }));
              router.refresh();
              setPanel("overview");
            });
          }}
        >
          <h3 className="text-lg font-semibold text-slate-900">
            Ręczna sprzedaż sklepowa
          </h3>
          <p className="text-sm text-slate-600">
            Gdy ktoś kupił poza Stripe (przelew, gotówka, barter z kwotą). Wpis
            trafia do przychodu miesiąca i listy „Ostatnie wpływy”.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="shopCashAmount">Kwota (zł)</Label>
              <Input
                id="shopCashAmount"
                required
                inputMode="decimal"
                placeholder="59"
                value={cash.amount}
                onChange={(e) =>
                  setCash((p) => ({ ...p, amount: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="shopCashDate">Data</Label>
              <Input
                id="shopCashDate"
                type="date"
                required
                value={cash.occurredOn}
                onChange={(e) =>
                  setCash((p) => ({ ...p, occurredOn: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="shopCashNote">Co sprzedane</Label>
            <Input
              id="shopCashNote"
              placeholder="np. Start z gitarą bez stresu · przelew"
              value={cash.note}
              onChange={(e) => setCash((p) => ({ ...p, note: e.target.value }))}
            />
          </div>
          <Button type="submit" disabled={isPending}>
            Zapisz sprzedaż sklepową
          </Button>
        </form>
      ) : null}
    </section>
  );
}
