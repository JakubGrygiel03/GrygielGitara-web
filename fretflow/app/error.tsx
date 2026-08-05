"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <section className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-slate-900">
        Coś poszło nie tak
      </h1>
      <p className="text-sm leading-relaxed text-muted">
        Odśwież stronę. Jeśli błąd wraca — napisz przez kontakt.
      </p>
      <Button type="button" onClick={() => reset()}>
        Spróbuj ponownie
      </Button>
    </section>
  );
}
