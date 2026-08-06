"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";
import { toast } from "sonner";

import {
  convertBookingToStudent,
  markContactRead,
  updateBookingInterestPackage,
  updateBookingStatus,
} from "@/app/actions/admin-data";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type {
  BookingRow,
  ContactRow,
  ShopEarlyBirdRow,
  WaitlistRow,
} from "@/lib/admin-types";
import { lessonPackageIds, lessonPackageLabel } from "@/lib/lesson-packages";
import { bookingLocationLabels } from "@/lib/validations/booking";
import { contactTopicLabels } from "@/lib/validations/contact";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pl-PL", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

type Sub = "rezerwacje" | "wiadomosci" | "waitlist" | "sklep";

export function AdminRequestsTab({
  contacts,
  bookings,
  waitlist,
  shopEarlyBird,
}: {
  contacts: ContactRow[];
  bookings: BookingRow[];
  waitlist: WaitlistRow[];
  shopEarlyBird: ShopEarlyBirdRow[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const unread = contacts.filter((c) => !c.is_read);
  const read = contacts.filter((c) => c.is_read);
  const pendingBookings = bookings.filter((b) => b.status === "pending");
  const handledBookings = bookings.filter((b) => b.status !== "pending");
  const waiting = waitlist.filter((w) => w.status === "waiting");
  const earlyWaiting = shopEarlyBird.filter((s) => s.status === "waiting");
  const earlyByProduct = earlyWaiting.reduce<Record<string, number>>(
    (acc, row) => {
      acc[row.product_title] = (acc[row.product_title] ?? 0) + 1;
      return acc;
    },
    {},
  );

  const defaultSub: Sub =
    pendingBookings.length > 0
      ? "rezerwacje"
      : earlyWaiting.length > 0
        ? "sklep"
        : waiting.length > 0
          ? "waitlist"
          : unread.length === 0
            ? "rezerwacje"
            : "wiadomosci";
  const [sub, setSub] = useState<Sub>(defaultSub);
  const [readOpen, setReadOpen] = useState(false);
  const [handledOpen, setHandledOpen] = useState(false);

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Zgłoszenia</h2>
        <p className="mt-1 text-sm text-muted">
          Prośby o lekcję, lista oczekujących, zainteresowanie e-bookami i
          wiadomości z kontaktu.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 rounded-xl bg-slate-100 p-1">
        <SubTab
          active={sub === "rezerwacje"}
          onClick={() => setSub("rezerwacje")}
          label={`Prośby o lekcję (${pendingBookings.length})`}
        />
        <SubTab
          active={sub === "sklep"}
          onClick={() => setSub("sklep")}
          label={`E-booki −30% (${earlyWaiting.length})`}
        />
        <SubTab
          active={sub === "waitlist"}
          onClick={() => setSub("waitlist")}
          label={`Lista lekcji (${waiting.length})`}
        />
        <SubTab
          active={sub === "wiadomosci"}
          onClick={() => setSub("wiadomosci")}
          label={`Wiadomości (${unread.length})`}
        />
      </div>

      {sub === "rezerwacje" ? (
        <div className="space-y-4">
          {pendingBookings.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-muted">
              Brak nowych próśb. Jak ktoś wypełni /rezerwacja — pojawi się tutaj.
            </p>
          ) : (
            <ul className="space-y-3">
              {pendingBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  isPending={isPending}
                  onStatusChange={(status) => {
                    startTransition(async () => {
                      const result = await updateBookingStatus(
                        booking.id,
                        status,
                      );
                      if (!result.ok) {
                        toast.error("Nie udało się zmienić statusu.");
                        return;
                      }
                      toast.success("Zapisane — przeniesiono do archiwum.");
                      router.refresh();
                    });
                  }}
                />
              ))}
            </ul>
          )}

          <Collapsible
            title={`Archiwum rezerwacji (${handledBookings.length})`}
            open={handledOpen}
            onToggle={() => setHandledOpen((v) => !v)}
          >
            {handledBookings.length === 0 ? (
              <p className="text-sm text-muted">Pusto.</p>
            ) : (
              <ul className="space-y-3">
                {handledBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    isPending={isPending}
                    muted
                    onStatusChange={(status) => {
                      startTransition(async () => {
                        const result = await updateBookingStatus(
                          booking.id,
                          status,
                        );
                        if (!result.ok) {
                          toast.error("Nie udało się zmienić statusu.");
                          return;
                        }
                        toast.success("Zapisane.");
                        router.refresh();
                      });
                    }}
                  />
                ))}
              </ul>
            )}
          </Collapsible>
        </div>
      ) : null}

      {sub === "waitlist" ? (
        <div className="space-y-4">
          {waitlist.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-muted">
              Lista pusta. Wpisy pojawią się, gdy ktoś dopisze się na stronie.
            </p>
          ) : (
            <ul className="divide-y divide-sky-100 rounded-2xl border border-sky-100 bg-white">
              {waitlist.map((entry) => (
                <li
                  key={entry.id}
                  className="flex flex-wrap items-start justify-between gap-2 px-4 py-3 text-sm"
                >
                  <div>
                    <p className="font-semibold text-slate-900">
                      {entry.full_name}
                    </p>
                    <p className="text-muted">
                      <a
                        href={`mailto:${entry.email}`}
                        className="text-sky-700 underline-offset-2 hover:underline"
                      >
                        {entry.email}
                      </a>
                      {entry.phone ? ` · ${entry.phone}` : ""}
                    </p>
                    {entry.note ? (
                      <p className="mt-1 text-slate-700">{entry.note}</p>
                    ) : null}
                    <p className="mt-1 text-xs text-muted">
                      {formatDate(entry.created_at)} · {entry.status}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}

      {sub === "sklep" ? (
        <div className="space-y-4">
          <p className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm leading-relaxed text-sky-950">
            Lista early-bird: zapis na konkretny slug + −% zamrożone w momencie
            zgłoszenia. Przy premierze wyłącz{" "}
            <code className="rounded bg-white px-1">early_bird_open</code> dla
            tytułu i wyślij kod Stripe osobom z listy.
          </p>
          {Object.keys(earlyByProduct).length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {Object.entries(earlyByProduct).map(([title, count]) => (
                <li
                  key={title}
                  className="rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-900"
                >
                  {title}: {count}
                </li>
              ))}
            </ul>
          ) : null}
          {earlyWaiting.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-muted">
              Brak zapisów. Po odpaleniu SQL early-bird i kliknięciu CTA w sklepie
              pojawią się tutaj.
            </p>
          ) : (
            <ul className="space-y-3">
              {earlyWaiting.map((row) => (
                <li
                  key={row.id}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-4"
                >
                  <p className="font-semibold text-slate-900">{row.full_name}</p>
                  <p className="text-sm text-slate-700">
                    {row.email}
                    {row.phone ? ` · ${row.phone}` : ""}
                  </p>
                  <p className="mt-1 text-sm font-medium text-sky-800">
                    {row.product_title}{" "}
                    <span className="text-slate-500">({row.product_slug})</span>{" "}
                    · −{row.discount_percent}%
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {formatDate(row.created_at)} · token {row.claim_token.slice(0, 8)}…
                  </p>
                  {row.note ? (
                    <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                      {row.note}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}

      {sub === "wiadomosci" ? (
        <div className="space-y-4">
          {unread.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-muted">
              Brak nowych wiadomości z /kontakt.
            </p>
          ) : (
            <ul className="space-y-3">
              {unread.map((contact) => (
                <ContactCard
                  key={contact.id}
                  contact={contact}
                  isPending={isPending}
                  onRead={() => {
                    startTransition(async () => {
                      const result = await markContactRead(contact.id);
                      if (!result.ok) {
                        toast.error("Nie udało się oznaczyć.");
                        return;
                      }
                      router.refresh();
                    });
                  }}
                />
              ))}
            </ul>
          )}

          <Collapsible
            title={`Przeczytane (${read.length})`}
            open={readOpen}
            onToggle={() => setReadOpen((v) => !v)}
          >
            {read.length === 0 ? (
              <p className="text-sm text-muted">Pusto.</p>
            ) : (
              read.map((contact) => (
                <ContactCard key={contact.id} contact={contact} readOnly />
              ))
            )}
          </Collapsible>
        </div>
      ) : null}
    </section>
  );
}

function SubTab({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "flex-1 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm"
          : "flex-1 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
      }
    >
      {label}
    </button>
  );
}

function Collapsible({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
        onClick={onToggle}
      >
        <span className="font-semibold text-slate-900">{title}</span>
        {open ? (
          <ChevronDown className="size-5 text-slate-500" />
        ) : (
          <ChevronRight className="size-5 text-slate-500" />
        )}
      </button>
      {open ? (
        <div className="space-y-3 border-t border-slate-100 px-4 py-4">
          {children}
        </div>
      ) : null}
    </div>
  );
}

const statusLabels: Record<BookingRow["status"], string> = {
  pending: "do ogarnięcia",
  confirmed: "dogadane",
  cancelled: "odpadło",
  completed: "załatwione",
};

function BookingCard({
  booking,
  isPending,
  muted,
  onStatusChange,
}: {
  booking: BookingRow;
  isPending?: boolean;
  muted?: boolean;
  onStatusChange: (status: BookingRow["status"]) => void;
}) {
  const router = useRouter();
  const [pendingLocal, startLocal] = useTransition();
  const busy = isPending || pendingLocal;

  return (
    <li
      className={
        muted
          ? "rounded-2xl border border-slate-100 bg-slate-50/80 p-4"
          : "rounded-2xl border border-sky-100 bg-white p-4"
      }
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-slate-900">{booking.student_name}</p>
          <p className="text-sm text-muted">
            {booking.email}
            {booking.phone ? ` · ${booking.phone}` : ""}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {formatDate(booking.created_at)}
          </p>
        </div>
        <select
          className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm"
          value={booking.status}
          disabled={busy}
          onChange={(e) =>
            onStatusChange(e.target.value as BookingRow["status"])
          }
        >
          <option value="pending">{statusLabels.pending}</option>
          <option value="confirmed">{statusLabels.confirmed}</option>
          <option value="cancelled">{statusLabels.cancelled}</option>
          <option value="completed">{statusLabels.completed}</option>
        </select>
      </div>

      <div className="mt-3 space-y-1 text-sm">
        <Label htmlFor={`pkg-${booking.id}`}>Interesujący pakiet</Label>
        <select
          id={`pkg-${booking.id}`}
          className="flex h-10 w-full max-w-md rounded-xl border border-slate-200 bg-white px-3 text-sm"
          disabled={busy}
          value={booking.interest_package ?? ""}
          onChange={(event) => {
            const value = event.target.value as
              | (typeof lessonPackageIds)[number]
              | "";
            startLocal(async () => {
              const result = await updateBookingInterestPackage(
                booking.id,
                value,
              );
              if (!result.ok) {
                toast.error(result.message);
                return;
              }
              toast.success("Pakiet zapisany.");
              router.refresh();
            });
          }}
        >
          <option value="">— nie wybrano —</option>
          {lessonPackageIds.map((id) => (
            <option key={id} value={id}>
              {lessonPackageLabel(id)}
            </option>
          ))}
        </select>
      </div>

      <dl className="mt-3 grid gap-1 text-sm text-slate-700 sm:grid-cols-2">
        <div>
          <dt className="inline text-muted">Miejsce: </dt>
          <dd className="inline">
            {booking.location_type
              ? bookingLocationLabels[booking.location_type]
              : "—"}
          </dd>
        </div>
        <div>
          <dt className="inline text-muted">Termin: </dt>
          <dd className="inline">{booking.preferred_day || "—"}</dd>
        </div>
      </dl>
      {booking.message ? (
        <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
          {booking.message}
        </p>
      ) : null}

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <Button
          type="button"
          size="sm"
          disabled={busy}
          onClick={() => {
            startLocal(async () => {
              const result = await convertBookingToStudent(booking.id);
              if (!result.ok) {
                toast.error(result.message);
                return;
              }
              toast.success(result.message);
              router.refresh();
            });
          }}
        >
          Dodaj jako ucznia
          {booking.interest_package?.startsWith("pack_")
            ? " + pakiet"
            : ""}
        </Button>
        {!muted ? (
          <p className="text-xs text-muted sm:max-w-sm">
            Przepisuje dane do „Uczniowie”, przy pakiecie 4 lekcji zakłada
            karnet, status → dogadane. Potem ustaw termin w „Lekcje”.
          </p>
        ) : (
          <p className="text-xs text-muted">
            Możesz dodać ponownie — przy tym samym e-mailu uzupełni istniejącego
            ucznia.
          </p>
        )}
      </div>
    </li>
  );
}

function ContactCard({
  contact,
  onRead,
  isPending,
  readOnly,
}: {
  contact: ContactRow;
  onRead?: () => void;
  isPending?: boolean;
  readOnly?: boolean;
}) {
  return (
    <li
      className={
        contact.is_read
          ? "rounded-2xl border border-slate-100 bg-slate-50/80 p-4"
          : "rounded-2xl border border-sky-200 bg-sky-50/50 p-4"
      }
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-slate-900">{contact.sender_name}</p>
          <p className="text-sm text-muted">
            {contact.email}
            {contact.phone ? ` · ${contact.phone}` : ""}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {formatDate(contact.created_at)} ·{" "}
            {contactTopicLabels[contact.topic] ?? contact.topic}
          </p>
        </div>
        {!readOnly && onRead ? (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={isPending}
            onClick={onRead}
          >
            Oznacz jako przeczytane
          </Button>
        ) : null}
      </div>
      <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">
        {contact.message}
      </p>
    </li>
  );
}
