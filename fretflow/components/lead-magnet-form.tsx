"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { submitLeadMagnet } from "@/app/actions/leads";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  email: z.email("Podaj poprawny adres e-mail."),
});

type FormValues = z.infer<typeof formSchema>;

export function LeadMagnetForm() {
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const result = await submitLeadMagnet(values.email);
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      setDone(true);
      toast.success(result.message);
    });
  });

  if (done) {
    return (
      <div className="rounded-2xl border border-sky-100 bg-sky-50/80 px-6 py-8">
        <h2 className="text-xl font-semibold text-slate-900">Jesteś na liście</h2>
        <p className="mt-2 text-muted">
          Dziękuję! Gdy poradnik PDF będzie gotowy do wysyłki, dostaniesz go na
          maila — razem z info o premierze materiałów.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="jan@email.pl"
          {...register("email")}
        />
        {errors.email ? (
          <p className="text-sm text-red-600">{errors.email.message}</p>
        ) : null}
      </div>
      <Button type="submit" size="lg" disabled={isPending} className="w-full sm:w-auto">
        {isPending ? "Zapisywanie..." : "Chcę darmowy poradnik"}
      </Button>
    </form>
  );
}
