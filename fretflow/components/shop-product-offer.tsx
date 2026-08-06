import Link from "next/link";
import { Check } from "lucide-react";

import { ShopPrice } from "@/components/shop-price";
import { ShopProductCta } from "@/components/shop-product-cta";
import type { ShopProductOffer } from "@/lib/shop-product-details";

type ShopProductOfferBodyProps = {
  offer: ShopProductOffer;
  priceLabel: string;
  priceGrosze: number;
  showEarlyBirdPrice?: boolean;
  productId: string;
  productSlug: string;
  productTitle: string;
  owned: boolean;
  comingSoon: boolean;
  earlyBirdOpen: boolean;
  stripeReady: boolean;
  loggedIn: boolean;
  salesOpen?: boolean;
  loginNext: string;
};

export function ShopProductOfferBody({
  offer,
  priceLabel,
  priceGrosze,
  showEarlyBirdPrice = false,
  productId,
  productSlug,
  productTitle,
  owned,
  comingSoon,
  earlyBirdOpen,
  stripeReady,
  loggedIn,
  salesOpen = true,
  loginNext,
}: ShopProductOfferBodyProps) {
  return (
    <div className="space-y-10">
      {/* WHY */}
      <section className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-wide text-sky-600">
          Dlaczego to powstało
        </p>
        <p className="text-lg font-semibold leading-snug text-slate-900 sm:text-xl">
          {offer.whyHook}
        </p>
        <div className="space-y-3 text-[0.9375rem] leading-relaxed text-slate-700">
          {offer.whyBody.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
        </div>
      </section>

      {/* O — Obietnica */}
      <section className="rounded-2xl border border-sky-100 bg-sky-50/70 px-5 py-5">
        <p className="text-xs font-bold uppercase tracking-wide text-sky-700">
          Obietnica
        </p>
        <p className="mt-2 text-base font-semibold leading-snug text-slate-900 sm:text-lg">
          {offer.promise}
        </p>
      </section>

      {/* Dla kogo */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">Dla kogo</h2>
        <ul className="space-y-2.5">
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

      {/* F — Fundament */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-base font-bold text-slate-900">
            Fundament — co kupujesz i po co
          </h2>
          <p className="text-sm text-muted">
            Nie sucha teoria — logiczny plan działania krok po kroku:
          </p>
        </div>
        <ul className="space-y-4">
          {offer.modules.map((mod) => (
            <li
              key={mod.title}
              className="rounded-xl border border-slate-200 bg-white px-4 py-4"
            >
              <p className="font-semibold text-slate-900">{mod.title}</p>
              <p className="mt-2 text-sm text-slate-700">
                <span className="font-medium text-slate-900">Fakt: </span>
                {mod.fact}
              </p>
              <p className="mt-1.5 text-sm text-slate-700">
                <span className="font-medium text-sky-800">Po co Ci to: </span>
                {mod.why}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* E — Emocje */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">
          Korzyści — trzy piętra
        </h2>
        <div className="space-y-3">
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Parter — funkcja
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-700">
              {offer.emotionFunctional}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              I piętro — obraz
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-700">
              {offer.emotionImage}
            </p>
          </div>
          <div className="rounded-xl border border-sky-100 bg-sky-50/60 px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-wide text-sky-700">
              II piętro — emocje
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-800">
              {offer.emotionFeeling}
            </p>
          </div>
        </div>
      </section>

      {/* Wada / nie dla kogo */}
      <section className="space-y-2 rounded-2xl border border-amber-100 bg-amber-50/50 px-5 py-4">
        <h2 className="text-base font-bold text-slate-900">
          Szczere przyznanie — czego tu nie ma
        </h2>
        <p className="text-sm leading-relaxed text-slate-700">{offer.notForYou}</p>
      </section>

      <section className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50/80 px-5 py-4">
        <h2 className="text-base font-bold text-slate-900">
          {offer.guaranteeTitle}
        </h2>
        <p className="text-sm leading-relaxed text-slate-700">
          {offer.guaranteeBody}{" "}
          <Link
            href="/regulamin-sklepu"
            className="font-semibold text-sky-700 underline-offset-2 hover:underline"
          >
            przeczytaj Regulamin sklepu
          </Link>
          .
        </p>
      </section>

      {/* T — Turbo */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">Bonusy turbo</h2>
        <p className="text-sm text-muted">{offer.bonusesIntro}</p>
        <ul className="space-y-3">
          {offer.bonuses.map((bonus) => (
            <li
              key={bonus.title}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3"
            >
              <p className="text-sm font-semibold text-slate-900">
                {bonus.title}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-700">
                {bonus.description}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* A — Akcja / cena */}
      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white px-5 py-5">
        <h2 className="text-base font-bold text-slate-900">Cena i decyzja</h2>
        <p className="text-sm leading-relaxed text-slate-700">
          {offer.priceStory}
        </p>
        <div className="space-y-1">
          <ShopPrice
            priceGrosze={priceGrosze}
            priceLabel={priceLabel}
            showEarlyBird={showEarlyBirdPrice}
            size="detail"
          />
          <p className="text-sm text-muted">{offer.editionNote}</p>
        </div>
        <ShopProductCta
          product={{
            id: productId,
            owned,
            comingSoon,
            earlyBirdOpen,
            slug: productSlug,
            title: productTitle,
          }}
          stripeReady={stripeReady}
          loggedIn={loggedIn}
          salesOpen={salesOpen}
          className="w-full sm:w-auto sm:min-w-[14rem]"
          loginNext={loginNext}
        />
        <p className="text-sm leading-relaxed text-muted">
          {offer.ctaNote}{" "}
          <Link
            href="/moje-kursy#zakupy"
            className="font-medium text-sky-700 underline-offset-2 hover:underline"
          >
            Moje zakupy
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
