import type { Metadata } from "next";
import Link from "next/link";

import { UnsubscribeForm } from "@/components/unsubscribe-form";
import { verifyUnsubscribeToken } from "@/lib/newsletter-unsubscribe";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Wypisz się z listy",
    description: "Rezygnacja z newslettera GrygielGitara.",
    path: "/wypisz-sie",
  }),
  robots: { index: false, follow: false },
};

export default async function WypiszSiePage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; token?: string }>;
}) {
  const params = await searchParams;
  const email = params.email?.trim() ?? "";
  const token = params.token?.trim() ?? "";
  const valid = Boolean(email && token && verifyUnsubscribeToken(email, token));

  return (
    <section className="mx-auto w-full max-w-xl px-4 py-10 sm:px-6 sm:py-16">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">
        Wypisz się z listy
      </h1>
      <div className="mt-6">
        {valid ? (
          <UnsubscribeForm email={email.toLowerCase()} token={token} />
        ) : (
          <p className="text-[0.9375rem] leading-relaxed text-slate-700">
            Ten link jest niekompletny albo już nieważny. Żeby wypisać się z
            listy, użyj odnośnika z stopki maila albo napisz przez{" "}
            <Link
              href="/kontakt"
              className="font-medium text-sky-700 underline-offset-2 hover:underline"
            >
              Kontakt
            </Link>
            .
          </p>
        )}
      </div>
    </section>
  );
}
