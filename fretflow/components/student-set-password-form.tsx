"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import { setStudentPasswordAfterRecovery } from "@/app/actions/student-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export function StudentSetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    // Implicit-flow recovery links put tokens in the URL hash
    const supabase = createClient();
    void supabase.auth.getSession();
  }, []);

  return (
    <div className="mx-auto w-full max-w-md space-y-6 rounded-2xl border border-sky-100 bg-white p-6 shadow-sm sm:p-8">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-sky-600">
          Moje konto
        </p>
        <h1 className="text-[1.375rem] font-bold leading-snug text-slate-900">
          Ustaw nowe hasło
        </h1>
        <p className="text-[0.9375rem] leading-relaxed text-muted">
          Wpisz hasło po kliknięciu w link z maila (albo po zalogowaniu sesją
          odzyskiwania).
        </p>
      </div>

      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          startTransition(async () => {
            const result = await setStudentPasswordAfterRecovery(
              password,
              password2,
            );
            if (!result.ok) {
              toast.error(result.message);
              return;
            }
            toast.success(result.message);
            router.push("/moje-kursy");
            router.refresh();
          });
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="new-pass">Nowe hasło</Label>
          <Input
            id="new-pass"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="new-pass2">Powtórz hasło</Label>
          <Input
            id="new-pass2"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Zapisywanie…" : "Zapisz hasło"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted">
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
