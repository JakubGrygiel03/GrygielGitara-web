"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { signInStudent } from "@/app/actions/student-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function StudentLoginForm({
  initialError,
}: {
  initialError?: string | null;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <div className="mx-auto w-full max-w-md space-y-6 rounded-2xl border border-sky-100 bg-white p-6 shadow-sm sm:p-8">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-sky-600">
          Moje konto
        </p>
        <h1 className="text-[1.375rem] font-bold leading-snug text-slate-900">
          Zaloguj się
        </h1>
        <p className="text-[0.9375rem] leading-relaxed text-muted">
          Wejdź na konto e-mailem i hasłem. Jeśli dostałeś hasło tymczasowe od
          nauczyciela — po zalogowaniu zmień je w profilu.
        </p>
      </div>

      {initialError ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          Sesja wygasła — zaloguj się ponownie.
        </p>
      ) : null}

      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          startTransition(async () => {
            const result = await signInStudent(email, password);
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
        <div className="space-y-2">
          <Label htmlFor="student-password">Hasło</Label>
          <Input
            id="student-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Logowanie…" : "Zaloguj"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted">
        Nie masz konta?{" "}
        <Link
          href="/moje-kursy/register"
          className="font-semibold text-sky-700 hover:underline"
        >
          Załóż konto
        </Link>
      </p>
    </div>
  );
}
