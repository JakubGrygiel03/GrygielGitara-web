"use client";

import { useState, useTransition } from "react";

import { confirmNewsletterUnsubscribe } from "@/app/actions/newsletter";
import { Button } from "@/components/ui/button";

export function UnsubscribeForm({
  email,
  token,
}: {
  email: string;
  token: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onConfirm = () => {
    startTransition(async () => {
      const result = await confirmNewsletterUnsubscribe(email, token);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setDone(true);
    });
  };

  if (done) {
    return (
      <p className="text-[0.9375rem] leading-relaxed text-slate-700">
        Gotowe. Nie będę już wysyłał wiadomości na <strong>{email}</strong>.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-[0.9375rem] leading-relaxed text-slate-700">
        Wypisać adres <strong>{email}</strong> z listy mailingowej GrygielGitara?
      </p>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button type="button" onClick={onConfirm} disabled={isPending}>
        {isPending ? "Wypisuję..." : "Wypisz mnie z listy"}
      </Button>
    </div>
  );
}
