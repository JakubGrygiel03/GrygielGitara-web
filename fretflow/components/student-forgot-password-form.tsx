"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { requestStudentPasswordReset } from "@/app/actions/student-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function StudentForgotPasswordForm({
  initialEmail = "",
}: {
  initialEmail?: string;
}) {
  const [email, setEmail] = useState(initialEmail);
  const [sent, setSent] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="mx-auto w-full max-w-md space-y-6 rounded-2xl border border-sky-100 bg-white p-6 shadow-sm sm:p-8">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-sky-600">
          Moje konto
        </p>
        <h1 className="text-[1.375rem] font-bold leading-snug text-slate-900">
          Zapomniałem hasła
        </h1>
        <p className="text-[0.9375rem] leading-relaxed text-muted">
          Podaj e-mail konta — wyślemy link do ustawienia nowego hasła. Sprawdź
          też folder spam.
        </p>
      </div>

      {sent ? (
        <div className="space-y-4">
          <p className="rounded-xl border border-sky-100 bg-sky-50 px-3 py-3 text-sm text-sky-950">
            Jeśli konto z adresem <strong>{email}</strong> istnieje, link jest
            w drodze. Po kliknięciu ustawisz nowe hasło.
          </p>
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            disabled={isPending}
            onClick={() => {
              startTransition(async () => {
                const result = await requestStudentPasswordReset(email);
                if (!result.ok) {
                  toast.error(result.message);
                  return;
                }
                toast.success("Wysłano ponownie.");
              });
            }}
          >
            {isPending ? "Wysyłanie…" : "Wyślij link jeszcze raz"}
          </Button>
        </div>
      ) : (
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            startTransition(async () => {
              const result = await requestStudentPasswordReset(email);
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
            <Label htmlFor="forgot-email">E-mail</Label>
            <Input
              id="forgot-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jan@email.pl"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Wysyłanie…" : "Wyślij link do resetu"}
          </Button>
        </form>
      )}

      <p className="text-center text-sm text-muted">
        Masz hasło?{" "}
        <Link
          href="/moje-kursy/login"
          className="font-semibold text-sky-700 hover:underline"
        >
          Wróć do logowania
        </Link>
      </p>
    </div>
  );
}
