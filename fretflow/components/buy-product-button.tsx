"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { startProductCheckout } from "@/app/actions/checkout";
import { Button } from "@/components/ui/button";

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
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      className={className}
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          const result = await startProductCheckout(productId);
          if (result && !result.ok) {
            toast.error(result.message ?? "Nie udało się rozpocząć płatności.");
          }
        });
      }}
    >
      {pending ? "Przekierowanie…" : label}
    </Button>
  );
}
