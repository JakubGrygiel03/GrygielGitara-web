import type { Metadata } from "next";
import { Gift } from "lucide-react";

import { ContactForm } from "@/components/contact-form";
import { contactTopics, type ContactFormValues } from "@/lib/validations/contact";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Zarezerwuj lekcję próbną w Gdańsku. Napisz przez formularz — odpiszę osobiście.",
};

type KontaktPageProps = {
  searchParams: Promise<{ temat?: string }>;
};

function resolveTopic(value?: string): ContactFormValues["topic"] {
  if (value && contactTopics.includes(value as ContactFormValues["topic"])) {
    return value as ContactFormValues["topic"];
  }
  return "lessons";
}

export default async function KontaktPage({ searchParams }: KontaktPageProps) {
  const params = await searchParams;
  const defaultTopic = resolveTopic(params.temat);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
      <div className="max-w-2xl space-y-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
          Zarezerwuj lekcję próbną / kontakt
        </h1>
        <p className="text-sm leading-relaxed text-muted sm:text-base lg:text-lg">
          Lekcje w Gdańsku, online, serwis instrumentu albo materiały — napisz,
          czego potrzebujesz. Odpiszę osobiście. Pierwsza lekcja z gwarancją
          satysfakcji.
        </p>

        <div className="flex gap-3 rounded-2xl border border-sky-200 bg-sky-50/90 px-4 py-4 sm:px-5">
          <Gift className="mt-0.5 size-5 shrink-0 text-sky-600" aria-hidden />
          <p className="text-sm leading-relaxed text-slate-700 sm:text-base">
            <span className="font-semibold text-slate-900">Po wysłaniu:</span>{" "}
            dostajesz potwierdzenie na maila. Poradnik PDF o strojeniu gitary
            dołączymy automatycznie, gdy plik będzie gotowy.
          </p>
        </div>
      </div>

      <div className="mt-8 w-full max-w-xl sm:mt-10">
        <ContactForm defaultTopic={defaultTopic} />
      </div>
    </section>
  );
}
