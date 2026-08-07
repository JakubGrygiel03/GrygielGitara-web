"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { submitContactForm } from "@/app/actions/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trackGoogleConversion } from "@/lib/gtag";
import {
  SHOP_EARLY_BIRD_PERCENT,
  SHOP_INTEREST_FORM_HINT,
} from "@/lib/shop-products";
import {
  contactFormSchema,
  contactTopicLabels,
  contactTopics,
  LESSON_WAITLIST_SUCCESS,
  type ContactFormValues,
} from "@/lib/validations/contact";

type ContactFormProps = {
  defaultTopic?: ContactFormValues["topic"];
  defaultMessage?: string;
  defaultProductSlug?: string;
  defaultProductTitle?: string;
};

export function ContactForm({
  defaultTopic = "other",
  defaultMessage = "",
  defaultProductSlug = "",
  defaultProductTitle = "",
}: ContactFormProps) {
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);
  const [wasWaitlist, setWasWaitlist] = useState(false);
  const [wasShopInterest, setWasShopInterest] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      senderName: "",
      email: "",
      phone: "",
      topic: defaultTopic,
      message: defaultMessage,
      productSlug: defaultProductSlug,
      productTitle: defaultProductTitle,
    },
  });

  const topic = watch("topic");
  const isWaitlist = topic === "lesson_waitlist";
  const isShopInterest = topic === "shop_support";

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const result = await submitContactForm(values);

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      setWasWaitlist(values.topic === "lesson_waitlist");
      setWasShopInterest(values.topic === "shop_support");
      setSubmitted(true);
      trackGoogleConversion();
      reset({
        senderName: "",
        email: "",
        phone: "",
        topic: defaultTopic,
        message: defaultMessage,
        productSlug: defaultProductSlug,
        productTitle: defaultProductTitle,
      });
      toast.success(result.message);
    });
  });

  if (submitted) {
    return (
      <div className="rounded-2xl border border-sky-100 bg-sky-50/80 px-6 py-8">
        <h2 className="text-xl font-semibold text-slate-900">Dzięki!</h2>
        <p className="mt-2 text-slate-700">
          {wasWaitlist
            ? LESSON_WAITLIST_SUCCESS
            : wasShopInterest
              ? `Zapis na listę przyjęty. Przy premierze tego e-booka odezwę się z kodem −${SHOP_EARLY_BIRD_PERCENT}% (dotyczy tylko tego tytułu).`
              : "Wiadomość jest u mnie. Na podany e-mail leci potwierdzenie. Sprawdź też folder spam."}
        </p>
        <Button className="mt-6" type="button" onClick={() => setSubmitted(false)}>
          {wasWaitlist || wasShopInterest
            ? "Wyślij kolejną wiadomość"
            : "Napisz kolejną wiadomość"}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <input type="hidden" {...register("productSlug")} />
      <input type="hidden" {...register("productTitle")} />

      <Field label="Imię" htmlFor="senderName" error={errors.senderName?.message}>
        <Input
          id="senderName"
          autoComplete="name"
          placeholder="Jak masz na imię?"
          {...register("senderName")}
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

      <Field label="Telefon (opcjonalnie)" htmlFor="phone" error={errors.phone?.message}>
        <Input
          id="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+48 ..."
          {...register("phone")}
        />
      </Field>

      <Field label="Temat" htmlFor="topic" error={errors.topic?.message}>
        <select
          id="topic"
          className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-base text-slate-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          {...register("topic")}
        >
          {contactTopics.map((item) => (
            <option key={item} value={item}>
              {contactTopicLabels[item]}
            </option>
          ))}
        </select>
      </Field>

      {isWaitlist ? (
        <p className="text-sm leading-relaxed text-slate-700">
          Dopiszesz się do prywatnej listy oczekujących na lekcję. Jak zwolni się
          stałe okienko, odezwę się w pierwszej kolejności.
        </p>
      ) : null}

      {isShopInterest ? (
        <p className="text-sm leading-relaxed text-slate-700">
          {SHOP_INTEREST_FORM_HINT}
        </p>
      ) : null}

      <Field
        label={isWaitlist ? "Preferencja / wiadomość" : "Wiadomość"}
        htmlFor="message"
        error={errors.message?.message}
      >
        <Textarea
          id="message"
          placeholder={
            isWaitlist
              ? "np. wtorki po 17, dojazd / Forum / online…"
              : isShopInterest
                ? "np. interesuje mnie Start z gitarą / Setup / wszystkie…"
                : "Napisz, czego szukasz — serwis, materiały, lekcje online..."
          }
          {...register("message")}
        />
      </Field>

      <Button type="submit" size="lg" disabled={isPending} className="w-full sm:w-auto">
        {isPending
          ? "Wysyłanie..."
          : isWaitlist
            ? "Dopisz mnie do listy oczekujących"
            : "Wyślij wiadomość"}
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
