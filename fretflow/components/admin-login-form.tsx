"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { loginAdmin } from "@/app/actions/admin-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminLoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="mx-auto w-full max-w-sm space-y-4 rounded-2xl border border-sky-100 bg-white p-6 shadow-sm"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const password = String(formData.get("password") ?? "");

        startTransition(async () => {
          const result = await loginAdmin(password);
          if (!result.ok) {
            toast.error(result.message);
            return;
          }
          toast.success(result.message);
          router.refresh();
        });
      }}
    >
      <div>
        <h1 className="text-xl font-bold text-slate-900">Panel admina</h1>
        <p className="mt-1 text-sm text-muted">
          Podgląd wiadomości i rezerwacji GrygielGitara.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Hasło</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Logowanie..." : "Zaloguj"}
      </Button>
    </form>
  );
}
