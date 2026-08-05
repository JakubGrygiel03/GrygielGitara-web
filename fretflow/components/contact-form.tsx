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
import {
  contactFormSchema,
  contactTopicLabels,
  contactTopics,
  type ContactFormValues,
} from "@/lib/validations/contact";

type ContactFormProps = {
  defaultTopic?: ContactFormValues["topic"];
};

export function ContactForm({ defaultTopic = "lessons" }: ContactFormProps) {
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      senderName: "",
      email: "",
      phone: "",
      topic: defaultTopic,
      message: "",
    },
  });

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const result = await submitContactForm(values);

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      setSubmitted(true);
      reset();
      toast.success(result.message);
    });
  });

  if (submitted) {
    return (
      <div className="rounded-2xl border border-sky-100 bg-sky-50/80 px-6 py-8">
        <h2 className="text-xl font-semibold text-slate-900">Dzięki!</h2>
        <p className="mt-2 text-muted">
          Wiadomość jest u mnie. Na podany e-mail leci potwierdzenie. Sprawdź też
          folder spam.
        </p>
        <Button className="mt-6" type="button" onClick={() => setSubmitted(false)}>
          Napisz kolejną wiadomość
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
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
          {contactTopics.map((topic) => (
            <option key={topic} value={topic}>
              {contactTopicLabels[topic]}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Wiadomość" htmlFor="message" error={errors.message?.message}>
        <Textarea
          id="message"
          placeholder="Napisz, czego szukasz — lekcje, setup, pytania o materiały..."
          {...register("message")}
        />
      </Field>

      <Button type="submit" size="lg" disabled={isPending} className="w-full sm:w-auto">
        {isPending ? "Wysyłanie..." : "Wyślij wiadomość"}
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
