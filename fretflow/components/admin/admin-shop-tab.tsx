"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

import {
  grantShopProducts,
  lookupShopAccountByEmail,
  type ShopAccountLookup,
} from "@/app/actions/admin-shop";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AdminShopProduct } from "@/lib/admin-types";

export function AdminShopTab({ products }: { products: AdminShopProduct[] }) {
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [account, setAccount] = useState<ShopAccountLookup | null>(null);
  const [selected, setSelected] = useState<string[]>([]);

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

  function toggleProduct(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function runSearch() {
    startTransition(async () => {
      const result = await lookupShopAccountByEmail(email);
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
    });
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">
          Sklep — nadawanie dostępu
        </h2>
        <p className="mt-1 text-sm text-muted">
          Wyszukaj konto po e-mailu i przypisz wybrane e-booki / produkty z
          oferty (bez Stripe).
        </p>
      </div>

      <div className="space-y-3 rounded-2xl border border-sky-100 bg-white p-4 sm:p-5">
        <div className="space-y-1.5">
          <Label htmlFor="shop-email">E-mail konta</Label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              id="shop-email"
              type="email"
              autoComplete="email"
              placeholder="np. uczen@email.pl"
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
              onClick={runSearch}
            >
              Szukaj
            </Button>
          </div>
        </div>
      </div>

      {account ? (
        <div className="space-y-4 rounded-2xl border border-sky-100 bg-white p-4 sm:p-5">
          <div>
            <p className="font-semibold text-slate-900">{account.email}</p>
            <p className="text-sm text-muted">
              {account.studentName
                ? `Uczeń CRM: ${account.studentName}`
                : "Konto sklepowe (bez wpisu w Uczniowie)"}
              {" · "}
              ID: <span className="font-mono text-xs">{account.userId}</span>
            </p>
          </div>

          {searchableProducts.length === 0 ? (
            <p className="text-sm text-muted">
              Brak produktów w bazie. Odpal migrację sklepu w Supabase.
            </p>
          ) : (
            <ul className="overflow-hidden rounded-2xl border border-sky-100">
              {searchableProducts.map((product, index) => {
                const owned = ownedSet.has(product.id);
                return (
                  <li
                    key={product.id}
                    className={
                      index > 0
                        ? "border-t border-sky-100 px-4 py-3"
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
                        <span className="block text-sm text-muted">
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

          <Button
            type="button"
            disabled={isPending || selected.length === 0}
            onClick={runGrant}
          >
            Nadaj dostęp ({selected.length})
          </Button>
        </div>
      ) : null}
    </section>
  );
}
