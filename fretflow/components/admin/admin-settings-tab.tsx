"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { updateAdminSettingsAction } from "@/app/actions/admin-settings";
import { addRevenueEntry } from "@/app/actions/admin-students-extra";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { AdminSettings } from "@/lib/admin-settings";

export function AdminSettingsTab({ settings }: { settings: AdminSettings }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState(settings);
  const [cash, setCash] = useState({
    amount: "",
    note: "",
    occurredOn: new Date().toISOString().slice(0, 10),
  });

  return (
    <section className="space-y-6">
      <form
        className="space-y-4 rounded-2xl border border-sky-100 bg-white p-4 sm:p-5"
        onSubmit={(event) => {
          event.preventDefault();
          startTransition(async () => {
            const result = await updateAdminSettingsAction(form);
            if (!result.ok) {
              toast.error(result.message);
              return;
            }
            toast.success(result.message);
            router.refresh();
          });
        }}
      >
        <h2 className="text-lg font-semibold text-slate-900">Ustawienia</h2>
        <p className="text-sm text-muted">
          Proste przełączniki — bez grzebania w kodzie.
        </p>

        <label className="flex items-start gap-3 text-sm text-slate-800">
          <input
            type="checkbox"
            className="mt-0.5 size-4 rounded border-slate-300 text-sky-600"
            checked={form.smsEnabled}
            onChange={(e) =>
              setForm((p) => ({ ...p, smsEnabled: e.target.checked }))
            }
          />
          <span>
            <strong>SMS włączone</strong> — wyłącz, żeby nie zużywać kredytów
            Brevo (zostaje e-mail).
          </span>
        </label>

        <label className="flex items-start gap-3 text-sm text-slate-800">
          <input
            type="checkbox"
            className="mt-0.5 size-4 rounded border-slate-300 text-sky-600"
            checked={form.bookingPaused}
            onChange={(e) =>
              setForm((p) => ({ ...p, bookingPaused: e.target.checked }))
            }
          />
          <span>
            <strong>Brak wolnych miejsc</strong> — ukryj formularz rezerwacji i
            pokaż listę oczekujących (np. pełny semestr / trasa koncertowa).
          </span>
        </label>

        {form.bookingPaused ? (
          <div className="space-y-1">
            <Label htmlFor="pauseMsg">Komunikat na stronie rezerwacji</Label>
            <Textarea
              id="pauseMsg"
              className="min-h-20"
              value={form.bookingPausedMessage}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  bookingPausedMessage: e.target.value,
                }))
              }
            />
          </div>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="notifyEmail">E-mail odbiorczy (awaryjny)</Label>
            <Input
              id="notifyEmail"
              type="email"
              placeholder="grygielgitara@gmail.com"
              value={form.notifyEmail}
              onChange={(e) =>
                setForm((p) => ({ ...p, notifyEmail: e.target.value }))
              }
            />
            <p className="text-xs text-muted">
              Główny adres to <code className="font-mono">CONTACT_TO_EMAIL</code>{" "}
              na Vercel. To pole używane tylko, gdy env jest puste.
            </p>
          </div>
          <div className="space-y-1">
            <Label htmlFor="teacherPhone">Twój telefon (SMS przypomnienia)</Label>
            <Input
              id="teacherPhone"
              placeholder="+48…"
              value={form.teacherPhone}
              onChange={(e) =>
                setForm((p) => ({ ...p, teacherPhone: e.target.value }))
              }
            />
          </div>
        </div>

        <Button type="submit" disabled={isPending}>
          Zapisz ustawienia
        </Button>
      </form>

      <form
        className="space-y-3 rounded-2xl border border-sky-100 bg-white p-4 sm:p-5"
        onSubmit={(event) => {
          event.preventDefault();
          startTransition(async () => {
            const result = await addRevenueEntry({
              category: "shop",
              amount: cash.amount,
              note: cash.note,
              occurredOn: cash.occurredOn,
            });
            if (!result.ok) {
              toast.error(result.message);
              return;
            }
            toast.success(result.message);
            setCash((p) => ({ ...p, amount: "", note: "" }));
            router.refresh();
          });
        }}
      >
        <h2 className="text-lg font-semibold text-slate-900">
          Sprzedaż ze sklepu
        </h2>
        <p className="text-sm text-muted">
          Lekcje prowadzisz w Google Sheets — tu tylko szybka notatka z e-booków /
          kursów, jeśli chcesz.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="cashAmount">Kwota (zł)</Label>
            <Input
              id="cashAmount"
              required
              value={cash.amount}
              onChange={(e) => setCash((p) => ({ ...p, amount: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="cashDate">Data</Label>
            <Input
              id="cashDate"
              type="date"
              required
              value={cash.occurredOn}
              onChange={(e) =>
                setCash((p) => ({ ...p, occurredOn: e.target.value }))
              }
            />
          </div>
        </div>
        <div className="space-y-1">
          <Label htmlFor="cashNote">Co sprzedane</Label>
          <Input
            id="cashNote"
            placeholder="np. e-book strojenie"
            value={cash.note}
            onChange={(e) => setCash((p) => ({ ...p, note: e.target.value }))}
          />
        </div>
        <Button type="submit" disabled={isPending}>
          Zapisz sprzedaż sklepową
        </Button>
      </form>
    </section>
  );
}
