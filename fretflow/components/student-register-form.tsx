"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { registerStudent } from "@/app/actions/student-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function StudentRegisterForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <div className="mx-auto w-full max-w-md space-y-6 rounded-2xl border border-sky-100 bg-white p-6 shadow-sm sm:p-8">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-sky-600">
          Strefa ucznia
        </p>
        <h1 className="text-[1.375rem] font-bold leading-snug text-slate-900">
          Załóż hasło
        </h1>
        <p className="text-[0.9375rem] leading-relaxed text-muted">
          Działa tylko gdy nauczyciel dodał już Twój e-mail do listy uczniów.
          Ustaw własne hasło (min. 8 znaków).
        </p>
      </div>

      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          startTransition(async () => {
            const result = await registerStudent(
              email,
              password,
              passwordConfirm,
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
          <Label htmlFor="reg-email">E-mail u nauczyciela</Label>
          <Input
            id="reg-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="reg-password">Hasło</Label>
          <Input
            id="reg-password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="reg-password2">Powtórz hasło</Label>
          <Input
            id="reg-password2"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Tworzenie…" : "Utwórz konto"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted">
        Masz już hasło?{" "}
        <Link
          href="/moje-kursy/login"
          className="font-semibold text-sky-700 hover:underline"
        >
          Zaloguj się
        </Link>
      </p>
    </div>
  );
}
