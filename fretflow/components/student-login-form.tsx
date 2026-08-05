"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { requestStudentMagicLink } from "@/app/actions/student-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function StudentLoginForm({
  initialError,
}: {
  initialError?: string | null;
}) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="mx-auto w-full max-w-md space-y-6 rounded-2xl border border-sky-100 bg-white p-6 shadow-sm sm:p-8">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-sky-600">
          Strefa ucznia
        </p>
        <h1 className="text-[1.375rem] font-bold leading-snug text-slate-900">
          Zaloguj się bez hasła
        </h1>
        <p className="text-[0.9375rem] leading-relaxed text-muted">
          Podaj e-mail, na który jesteś zapisany u nauczyciela. Dostaniesz
          jednorazowy link — materiały, najbliższa lekcja i historia zajęć.
        </p>
      </div>

      {initialError ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          Link wygasł albo był nieprawidłowy. Poproś o nowy poniżej.
        </p>
      ) : null}

      {sent ? (
        <p className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-3 text-sm text-sky-900">
          Sprawdź skrzynkę (i spam). Kliknij link z maila na tym urządzeniu.
        </p>
      ) : (
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            startTransition(async () => {
              const result = await requestStudentMagicLink(email);
              if (!result.ok) {
                toast.error(result.message);
                return;
              }
              setSent(true);
              toast.success(result.message);
            });
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="student-email">E-mail</Label>
            <Input
              id="student-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jan@email.pl"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Wysyłanie…" : "Wyślij link do logowania"}
          </Button>
        </form>
      )}
    </div>
  );
}
