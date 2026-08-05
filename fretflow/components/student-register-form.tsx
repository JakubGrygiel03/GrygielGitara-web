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
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <div className="mx-auto w-full max-w-md space-y-6 rounded-2xl border border-sky-100 bg-white p-6 shadow-sm sm:p-8">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-sky-600">
          Moje konto
        </p>
        <h1 className="text-[1.375rem] font-bold leading-snug text-slate-900">
          Załóż konto
        </h1>
        <p className="text-[0.9375rem] leading-relaxed text-muted">
          Darmowe konto do materiałów, lekcji (jeśli uczysz się u mnie) i wkrótce
          zakupów (e-booki, kursy). Hasło min. 8 znaków.
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
              fullName,
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
          <Label htmlFor="reg-name">Imię i nazwisko</Label>
          <Input
            id="reg-name"
            type="text"
            autoComplete="name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Jan Kowalski"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="reg-email">E-mail</Label>
          <Input
            id="reg-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jan@email.pl"
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
          {isPending ? "Tworzenie konta…" : "Załóż konto"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted">
        Masz już konto?{" "}
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
