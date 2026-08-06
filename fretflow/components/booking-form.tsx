"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { submitBookingForm } from "@/app/actions/booking";
import { PackageChoiceCards } from "@/components/package-choice-cards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trackGoogleAdsContactConversion } from "@/lib/google-ads";
import { lessonPackageById } from "@/lib/lesson-packages";
import {
  bookingFormSchema,
  bookingLocationLabels,
  bookingLocations,
  type BookingFormValues,
} from "@/lib/validations/booking";

export function BookingForm() {
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      studentName: "",
      email: "",
      phone: "",
      locationType: "student_home",
      interestPackage: "pack_4_home",
      preferredDay: "",
      favoriteSong: "",
      hasInstrument: true,
      acceptsGuarantee: false,
      message: "",
    },
  });

  const interestPackage = watch("interestPackage");

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const result = await submitBookingForm(values);

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      setSubmitted(true);
      trackGoogleAdsContactConversion();
      reset();
      toast.success(result.message);
    });
  });

  if (submitted) {
    return (
      <div className="rounded-2xl border border-sky-100 bg-sky-50/80 px-6 py-8">
        <h2 className="text-xl font-semibold text-slate-900">Zgłoszenie wysłane</h2>
        <p className="mt-2 text-muted">
          Dostałem Twoje dane. Na maila leci potwierdzenie — odezwę się, żeby
          ustalić dokładny termin lekcji próbnej.
        </p>
        <Button
          className="mt-6"
          type="button"
          onClick={() => setSubmitted(false)}
        >
          Złóż kolejne zgłoszenie
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <Field
        label="Imię"
        htmlFor="studentName"
        error={errors.studentName?.message}
      >
        <Input
          id="studentName"
          autoComplete="name"
          placeholder="Jak masz na imię?"
          {...register("studentName")}
        />
      </Field>

      <Field label="E-mail" htmlFor="email" error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="jan@email.pl"
          {...register("email")}
        />
      </Field>

      <Field label="Telefon" htmlFor="phone" error={errors.phone?.message}>
        <Input
          id="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+48 ..."
          {...register("phone")}
        />
      </Field>

      <PackageChoiceCards
        value={interestPackage}
        error={errors.interestPackage?.message}
        onChange={(id) => {
          setValue("interestPackage", id, { shouldValidate: true });
          const pkg = lessonPackageById[id];
          if (pkg) {
            setValue("locationType", pkg.locationType, {
              shouldValidate: true,
            });
          }
        }}
      />

      <Field
        label="Miejsce lekcji"
        htmlFor="locationType"
        error={errors.locationType?.message}
      >
        <select
          id="locationType"
          className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-base text-slate-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          {...register("locationType")}
        >
          {bookingLocations.map((location) => (
            <option key={location} value={location}>
              {bookingLocationLabels[location]}
            </option>
          ))}
        </select>
      </Field>

      <Field
        label="Preferowany dzień / godzina (opcjonalnie)"
        htmlFor="preferredDay"
        error={errors.preferredDay?.message}
      >
        <Input
          id="preferredDay"
          placeholder="np. wtorki po 17:00"
          {...register("preferredDay")}
        />
      </Field>

      <Field
        label="Ulubiony utwór na start (opcjonalnie)"
        htmlFor="favoriteSong"
        error={errors.favoriteSong?.message}
      >
        <Input
          id="favoriteSong"
          placeholder="np. Wonderwall, Something..."
          {...register("favoriteSong")}
        />
      </Field>

      <div className="space-y-3 rounded-xl border border-sky-100 bg-white/80 px-4 py-4">
        <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-800 sm:text-base">
          <input
            type="checkbox"
            className="mt-1 size-4 rounded border-slate-300 text-sky-600 focus:ring-sky-400"
            {...register("hasInstrument")}
          />
          <span>Mam własną gitarę (albo dostęp do instrumentu na lekcje)</span>
        </label>
        {errors.hasInstrument?.message ? (
          <p className="text-sm text-red-600">{errors.hasInstrument.message}</p>
        ) : null}

        <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-800 sm:text-base">
          <input
            type="checkbox"
            className="mt-1 size-4 rounded border-slate-300 text-sky-600 focus:ring-sky-400"
            {...register("acceptsGuarantee")}
          />
          <span>
            Akceptuję gwarancję pierwszej lekcji — jeśli nie złapiemy wspólnego
            języka, nie płacę za te zajęcia.
          </span>
        </label>
        {errors.acceptsGuarantee?.message ? (
          <p className="text-sm text-red-600">
            {errors.acceptsGuarantee.message}
          </p>
        ) : null}
      </div>

      <Field
        label="Dodatkowa wiadomość (opcjonalnie)"
        htmlFor="message"
        error={errors.message?.message}
      >
        <Textarea
          id="message"
          placeholder="Cel nauki, doświadczenie, pytania..."
          {...register("message")}
        />
      </Field>

      <Button
        type="submit"
        size="lg"
        disabled={isPending}
        className="w-full sm:w-auto"
      >
        {isPending ? "Wysyłanie..." : "Zarezerwuj lekcję próbną"}
      </Button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
