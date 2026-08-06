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
import {
  FREE_GUIDE_CTA_LABEL,
  FREE_GUIDE_FORM_INTRO,
  FREE_GUIDE_SUCCESS,
} from "@/lib/free-guide-copy";
import { MARKETING_CONSENT_LABEL } from "@/lib/validations/lead";

const formSchema = z.object({
  email: z.email("Podaj poprawny adres e-mail."),
  marketingConsent: z.boolean(),
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
    defaultValues: { email: "", marketingConsent: false },
  });

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const result = await submitLeadMagnet(
        values.email,
        values.marketingConsent === true,
      );
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
        <h2 className="text-xl font-semibold text-slate-900">PDF w drodze</h2>
        <p className="mt-2 text-muted">{FREE_GUIDE_SUCCESS}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <p className="text-sm leading-relaxed text-slate-700 sm:text-base">
        {FREE_GUIDE_FORM_INTRO}
      </p>

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

      <label className="flex cursor-pointer items-start gap-2.5 text-sm leading-snug text-slate-600">
        <input
          type="checkbox"
          className="mt-1 size-4 shrink-0 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
          {...register("marketingConsent")}
        />
        <span>{MARKETING_CONSENT_LABEL}</span>
      </label>

      <Button type="submit" size="lg" disabled={isPending} className="w-full sm:w-auto">
        {isPending ? "Wysyłanie..." : FREE_GUIDE_CTA_LABEL}
      </Button>
    </form>
  );
}
