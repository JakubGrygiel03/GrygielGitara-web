"use client";

import Link from "next/link";
import { useEffect, useId, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";

import { startProductCheckout } from "@/app/actions/checkout";
import { Button } from "@/components/ui/button";
import {
  digitalConsentCheckboxLabel,
  regulaminCheckboxLabel,
  SHOP_REGULAMIN_PATH,
} from "@/lib/shop-digital-terms";

type BuyProductButtonProps = {
  productId: string;
  label?: string;
  className?: string;
};

export function BuyProductButton({
  productId,
  label = "Kup teraz",
  className,
}: BuyProductButtonProps) {
  const titleId = useId();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [digitalConsent, setDigitalConsent] = useState(false);
  const [regulaminAccepted, setRegulaminAccepted] = useState(false);
  const [mounted, setMounted] = useState(false);

  const canPay = digitalConsent && regulaminAccepted;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !pending) {
        setOpen(false);
        setDigitalConsent(false);
        setRegulaminAccepted(false);
      }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, pending]);

  function closeModal() {
    if (pending) return;
    setOpen(false);
    setDigitalConsent(false);
    setRegulaminAccepted(false);
  }

  function startCheckout() {
    if (!digitalConsent || !regulaminAccepted) {
      toast.error(
        "Zaznacz obie zgody, żeby przejść dalej: natychmiastowe dostarczenie oraz Regulamin sklepu.",
      );
      return;
    }
    startTransition(async () => {
      try {
        const result = await startProductCheckout(
          productId,
          true,
          true,
        );
        if (!result.ok) {
          toast.error(result.message ?? "Nie udało się rozpocząć płatności.");
          return;
        }
        if (result.url) {
          window.location.assign(result.url);
          return;
        }
        toast.error("Brak linku do Stripe.");
      } catch (error) {
        console.error(error);
        toast.error("Nie udało się otworzyć płatności. Spróbuj ponownie.");
      }
    });
  }

  const modal =
    mounted && open
      ? createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center"
            role="presentation"
          >
            <button
              type="button"
              className="absolute inset-0 bg-slate-900/50"
              aria-label="Zamknij"
              onClick={closeModal}
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className="relative z-[101] flex max-h-[min(92vh,40rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-xl"
            >
              <div className="shrink-0 space-y-1 border-b border-sky-100 px-5 py-4 sm:px-6 sm:py-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-sky-600">
                  Sklep
                </p>
                <h2
                  id={titleId}
                  className="text-xl font-bold tracking-tight text-slate-900"
                >
                  Zanim przejdziesz do płatności
                </h2>
              </div>

              <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5 sm:px-6">
                <div className="rounded-xl bg-sky-50 px-4 py-4">
                  <p className="text-sm leading-relaxed text-slate-700 sm:text-[0.9375rem]">
                    Po opłaceniu e-book trafia do Ciebie od razu jako plik PDF —
                    zwykle na adres e-mail użyty przy zakupie. Ten sam materiał
                    znajdziesz też później w panelu: „Konto” → sekcja „Zakupy”,
                    skąd możesz pobrać go w każdej chwili.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-slate-400">
                    Wymagane zgody
                  </p>

                  <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-sky-100 bg-sky-50/60 px-2.5 py-1.5 text-xs font-medium text-slate-800">
                    <input
                      type="checkbox"
                      className="size-3.5 shrink-0 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                      checked={canPay}
                      ref={(el) => {
                        if (el) {
                          el.indeterminate =
                            (digitalConsent || regulaminAccepted) && !canPay;
                        }
                      }}
                      onChange={(e) => {
                        const next = e.target.checked;
                        setDigitalConsent(next);
                        setRegulaminAccepted(next);
                      }}
                    />
                    <span>Zaznacz wszystkie</span>
                  </label>

                  <label className="flex cursor-pointer items-start gap-2 rounded-lg border border-slate-100 bg-slate-50/50 px-2.5 py-2 text-left text-[0.75rem] leading-snug text-slate-600">
                    <input
                      type="checkbox"
                      className="mt-0.5 size-3.5 shrink-0 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                      checked={digitalConsent}
                      onChange={(e) => setDigitalConsent(e.target.checked)}
                    />
                    <span>{digitalConsentCheckboxLabel}</span>
                  </label>

                  <label className="flex cursor-pointer items-start gap-2 rounded-lg border border-slate-100 bg-slate-50/50 px-2.5 py-2 text-left text-[0.75rem] leading-snug text-slate-600">
                    <input
                      type="checkbox"
                      className="mt-0.5 size-3.5 shrink-0 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                      checked={regulaminAccepted}
                      onChange={(e) => setRegulaminAccepted(e.target.checked)}
                    />
                    <span>
                      {regulaminCheckboxLabel.replace(/\.$/, "")}{" "}
                      <Link
                        href={SHOP_REGULAMIN_PATH}
                        className="font-medium text-sky-700 underline-offset-2 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        otwórz regulamin
                      </Link>
                      .
                    </span>
                  </label>
                </div>
              </div>

              <div className="shrink-0 flex flex-col gap-2 border-t border-sky-100 bg-slate-50/80 px-5 py-4 sm:flex-row-reverse sm:px-6">
                <Button
                  type="button"
                  className="w-full sm:w-auto"
                  disabled={pending || !canPay}
                  onClick={startCheckout}
                >
                  {pending ? "Przekierowanie…" : "Przejdź do płatności"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full sm:w-auto"
                  disabled={pending}
                  onClick={closeModal}
                >
                  Anuluj
                </Button>
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <Button
        type="button"
        className={className}
        disabled={pending}
        onClick={() => setOpen(true)}
      >
        {label}
      </Button>
      {modal}
    </>
  );
}
