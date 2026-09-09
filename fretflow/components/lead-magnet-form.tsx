"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
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
  FREE_GUIDE_DOWNLOAD_LABEL,
  FREE_GUIDE_FORM_INTRO,
  FREE_GUIDE_SUCCESS,
} from "@/lib/free-guide-copy";
import {
  FREE_GUIDE_DOWNLOAD_FILENAME,
  FREE_GUIDE_DOWNLOAD_HREF,
} from "@/lib/free-guide";
import {
  MARKETING_CONSENT_LABEL,
  MARKETING_CONSENT_REQUIRED,
  PRIVACY_CONSENT_REQUIRED,
} from "@/lib/validations/lead";

const formSchema = z.object({
  email: z.email("Podaj poprawny adres e-mail."),
  marketingConsent: z.boolean().refine((value) => value === true, {
    message: MARKETING_CONSENT_REQUIRED,
  }),
  privacyConsent: z.boolean().refine((value) => value === true, {
    message: PRIVACY_CONSENT_REQUIRED,
  }),
});

type FormValues = z.infer<typeof formSchema>;

/** Must run in the same click as submit — after await the browser blocks downloads. */
function startImmediateDownload() {
  const url = FREE_GUIDE_DOWNLOAD_HREF;
  const opened = window.open(url, "_blank", "noopener,noreferrer");
  if (opened) return;

  const link = document.createElement("a");
  link.href = url;
  link.download = FREE_GUIDE_DOWNLOAD_FILENAME;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function LeadMagnetForm() {
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      marketingConsent: false,
      privacyConsent: false,
    },
  });

  const marketingConsent = watch("marketingConsent");
  const privacyConsent = watch("privacyConsent");
  const allSelected = marketingConsent === true && privacyConsent === true;

  const onToggleAll = (checked: boolean) => {
    setValue("marketingConsent", checked, { shouldValidate: true, shouldDirty: true });
    setValue("privacyConsent", checked, { shouldValidate: true, shouldDirty: true });
  };

  const onSubmit = handleSubmit((values) => {
    startImmediateDownload();
    setDownloadUrl(FREE_GUIDE_DOWNLOAD_HREF);
    setDone(true);

    startTransition(async () => {
      try {
        const result = await submitLeadMagnet(
          values.email,
          values.marketingConsent === true,
          values.privacyConsent === true,
        );
        if (!result.ok) {
          toast.error(result.message);
          return;
        }
        toast.success(result.message);
      } catch (error) {
        console.error("submitLeadMagnet:", error);
        toast.error(
          "E-book powinien się pobierać. Mail mógł nie wyjść — spróbuj ponownie albo sprawdź skrzynkę za chwilę.",
        );
      }
    });
  });

  if (done) {
    return (
      <div className="rounded-2xl border border-sky-100 bg-sky-50/80 px-6 py-8 text-center">
        <h2 className="text-xl font-semibold text-slate-900">
          E-book jest gotowy
        </h2>
        <p className="mt-2 text-muted">{FREE_GUIDE_SUCCESS}</p>
        {downloadUrl ? (
          <Button asChild className="mt-5">
            <a
              href={downloadUrl}
              download={FREE_GUIDE_DOWNLOAD_FILENAME}
              target="_blank"
              rel="noopener noreferrer"
            >
              {FREE_GUIDE_DOWNLOAD_LABEL}
            </a>
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="space-y-3 text-sm leading-relaxed text-slate-700 sm:text-base">
        {FREE_GUIDE_FORM_INTRO.map((paragraph) => (
          <p key={paragraph.slice(0, 40)}>{paragraph}</p>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">
          Twój e-mail <span className="text-orange-700">*</span>
        </Label>
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

      <div className="space-y-3">
        <p className="text-xs font-medium text-slate-500">
          Pola oznaczone <span className="text-orange-700">*</span> są wymagane.
        </p>

        <label className="flex cursor-pointer items-start gap-2.5 text-sm font-medium leading-snug text-slate-800">
          <input
            type="checkbox"
            className="mt-1 size-4 shrink-0 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
            checked={allSelected}
            onChange={(event) => onToggleAll(event.target.checked)}
          />
          <span>Zaznacz wszystko</span>
        </label>

        <div className="space-y-3 pl-6 sm:pl-7">
          <label className="flex cursor-pointer items-start gap-2.5 text-sm leading-snug text-slate-600">
            <input
              type="checkbox"
              className="mt-1 size-4 shrink-0 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
              {...register("marketingConsent")}
            />
            <span>
              {MARKETING_CONSENT_LABEL}{" "}
              <span className="text-orange-700">*</span>
            </span>
          </label>
          {errors.marketingConsent ? (
            <p className="text-sm text-red-600">
              {errors.marketingConsent.message}
            </p>
          ) : null}

          <label className="flex cursor-pointer items-start gap-2.5 text-sm leading-snug text-slate-600">
            <input
              type="checkbox"
              className="mt-1 size-4 shrink-0 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
              {...register("privacyConsent")}
            />
            <span>
              Akceptuję{" "}
              <Link
                href="/regulamin-sklepu"
                className="font-medium text-sky-700 underline-offset-2 hover:underline"
                target="_blank"
              >
                Regulamin sklepu
              </Link>{" "}
              i{" "}
              <span className="whitespace-nowrap">
                <Link
                  href="/polityka-prywatnosci"
                  className="font-medium text-sky-700 underline-offset-2 hover:underline"
                  target="_blank"
                >
                  Politykę prywatności
                </Link>
                . <span className="text-orange-700">*</span>
              </span>
            </span>
          </label>
          {errors.privacyConsent ? (
            <p className="text-sm text-red-600">{errors.privacyConsent.message}</p>
          ) : null}
        </div>
      </div>

      <div className="flex justify-center">
        <Button type="submit" size="lg" disabled={isPending} className="w-full sm:w-auto">
          {isPending ? "Wysyłanie..." : FREE_GUIDE_CTA_LABEL}
        </Button>
      </div>
    </form>
  );
}
