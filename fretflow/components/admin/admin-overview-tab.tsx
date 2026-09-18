"use client";

import type { ReactNode } from "react";
import {
  CalendarDays,
  Inbox,
  Package,
  TrendingUp,
  Wrench,
} from "lucide-react";

import type {
  AdminShopStats,
  BookingRow,
  ContactRow,
  LessonRow,
  MonthBalance,
  ServiceOrderRow,
  ShopEarlyBirdRow,
} from "@/lib/admin-types";
import { adminCard, adminEyebrow, adminKpi } from "@/lib/admin-ui";
import { lessonPackageLabel } from "@/lib/lesson-packages";
import { cn } from "@/lib/utils";

const money = new Intl.NumberFormat("pl-PL", {
  style: "currency",
  currency: "PLN",
  maximumFractionDigits: 0,
});

const moneyExact = new Intl.NumberFormat("pl-PL", {
  style: "currency",
  currency: "PLN",
  maximumFractionDigits: 2,
});

function formatTime(value: string) {
  return new Intl.DateTimeFormat("pl-PL", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function todayLabel() {
  return new Intl.DateTimeFormat("pl-PL", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());
}

function bookingStatusLabel(status: string) {
  if (status === "pending") return "Oczekuje";
  if (status === "confirmed") return "Potwierdzona";
  if (status === "cancelled") return "Anulowana";
  if (status === "completed") return "Zakończona";
  return status;
}

function bookingStatusClass(status: string) {
  if (status === "pending") return "bg-slate-100 text-slate-700";
  if (status === "confirmed") return "bg-sky-100 text-sky-800";
  if (status === "cancelled") return "bg-rose-50 text-rose-700";
  if (status === "completed") return "bg-emerald-50 text-emerald-800";
  return "bg-slate-100 text-slate-700";
}

export function AdminOverviewTab({
  contacts,
  bookings,
  lessons,
  serviceOrders,
  shopStats,
  monthBalance,
  shopEarlyBird,
  leadsCount,
  studentsCount,
  productsCount,
  onGo,
}: {
  contacts: ContactRow[];
  bookings: BookingRow[];
  lessons: LessonRow[];
  serviceOrders: ServiceOrderRow[];
  shopStats: AdminShopStats;
  monthBalance: MonthBalance;
  shopEarlyBird: ShopEarlyBirdRow[];
  leadsCount: number;
  studentsCount: number;
  productsCount: number;
  onGo: (tab: string) => void;
}) {
  const unread = contacts.filter((c) => !c.is_read);
  const pendingBookings = bookings.filter((b) => b.status === "pending");
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed");
  const waitingList = shopEarlyBird.filter((s) => s.status === "waiting");
  const todayKey = new Date().toDateString();
  const todaysLessons = lessons
    .filter((l) => new Date(l.starts_at).toDateString() === todayKey)
    .sort(
      (a, b) =>
        new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime(),
    );
  const openService = serviceOrders.filter((o) => o.status !== "delivered");
  const readyService = serviceOrders.filter((o) => o.status === "ready");
  const recentBookings = [...bookings]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, 6);

  const aov =
    shopStats.monthStripeUnits > 0
      ? shopStats.monthStripeRevenue / shopStats.monthStripeUnits
      : 0;

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Pulpit
          </h1>
          <p className="mt-1 text-sm capitalize text-slate-500">
            {todayLabel()} — lekcje, zgłoszenia i sprzedaż
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onGo("calendar")}
            className="inline-flex min-h-10 items-center rounded-xl bg-sky-500 px-4 text-sm font-bold text-white hover:bg-sky-600"
          >
            + Zaplanuj lekcję
          </button>
          <button
            type="button"
            onClick={() => onGo("requests")}
            className="inline-flex min-h-10 items-center rounded-xl border border-sky-200 bg-white px-4 text-sm font-bold text-slate-800 shadow-sm hover:bg-sky-50"
          >
            Zgłoszenia
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Zgłoszenia"
          value={String(pendingBookings.length + unread.length)}
          hint={`${pendingBookings.length} rezerwacji · ${unread.length} wiadomości`}
          icon={<Inbox className="size-5" aria-hidden />}
          onClick={() => onGo("requests")}
        />
        <KpiCard
          label="Przychód miesiąca"
          value={money.format(monthBalance.total)}
          hint={
            aov > 0
              ? `Sklep AOV ${moneyExact.format(aov)}`
              : `Lekcje ${money.format(monthBalance.lessons)}`
          }
          icon={<TrendingUp className="size-5" aria-hidden />}
          onClick={() => onGo("shop")}
        />
        <KpiCard
          label="Uczniowie"
          value={String(studentsCount)}
          hint={`${todaysLessons.length} lekcji dziś`}
          icon={<CalendarDays className="size-5" aria-hidden />}
          onClick={() => onGo("students")}
        />
        <KpiCard
          label="Produkty / serwis"
          value={String(productsCount)}
          hint={
            openService.length > 0
              ? `${openService.length} gitar w serwisie`
              : `${leadsCount} leadów e-mail`
          }
          icon={
            openService.length > 0 ? (
              <Wrench className="size-5" aria-hidden />
            ) : (
              <Package className="size-5" aria-hidden />
            )
          }
          onClick={() => onGo(openService.length > 0 ? "service" : "shop")}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-5">
        <div className={cn(adminCard, "xl:col-span-3")}>
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-base font-bold text-slate-900">
              Ostatnie rezerwacje
            </h2>
            <button
              type="button"
              className="text-sm font-semibold text-sky-700 hover:underline"
              onClick={() => onGo("requests")}
            >
              Wszystkie →
            </button>
          </div>
          {recentBookings.length === 0 ? (
            <p className="mt-4 text-sm text-slate-600">
              Brak rezerwacji — pojawią się po zgłoszeniach z /rezerwacja.
            </p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[28rem] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
                    <th className="pb-2 font-semibold">Uczeń</th>
                    <th className="pb-2 font-semibold">Pakiet</th>
                    <th className="pb-2 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentBookings.map((b) => (
                    <tr key={b.id}>
                      <td className="py-3">
                        <p className="font-semibold text-slate-900">
                          {b.student_name}
                        </p>
                        <p className="text-xs text-slate-500">{b.email}</p>
                      </td>
                      <td className="py-3 text-slate-700">
                        {lessonPackageLabel(b.interest_package) || "—"}
                      </td>
                      <td className="py-3">
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2.5 py-1 text-xs font-bold",
                            bookingStatusClass(b.status),
                          )}
                        >
                          {bookingStatusLabel(b.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="space-y-4 xl:col-span-2">
          <div className={adminCard}>
            <p className={adminEyebrow}>Kolejka statusów</p>
            <ul className="mt-3 space-y-2.5 text-sm">
              <QueueRow
                label="Rezerwacje oczekujące"
                value={pendingBookings.length}
                onClick={() => onGo("requests")}
              />
              <QueueRow
                label="Potwierdzone"
                value={confirmedBookings.length}
                onClick={() => onGo("requests")}
              />
              <QueueRow
                label="Wiadomości nieprzeczytane"
                value={unread.length}
                onClick={() => onGo("requests")}
              />
              <QueueRow
                label="Serwis — gotowe do odbioru"
                value={readyService.length}
                onClick={() => onGo("service")}
              />
              <QueueRow
                label="Early-bird −30%"
                value={waitingList.length}
                onClick={() => onGo("shop")}
              />
            </ul>
          </div>

          <div className={adminCard}>
            <p className={adminEyebrow}>Dziś w kalendarzu</p>
            {todaysLessons.length === 0 ? (
              <p className="mt-3 text-sm text-slate-600">Brak lekcji na dziś.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {todaysLessons.slice(0, 4).map((lesson) => (
                  <li
                    key={lesson.id}
                    className="rounded-xl bg-slate-50 px-3 py-2.5 text-sm"
                  >
                    <p className="font-semibold text-slate-900">
                      {formatTime(lesson.starts_at)}–{formatTime(lesson.ends_at)}
                    </p>
                    <p className="text-slate-600">
                      {lesson.students?.full_name ?? "Uczeń"}
                    </p>
                  </li>
                ))}
              </ul>
            )}
            <button
              type="button"
              className="mt-3 text-sm font-semibold text-sky-700 hover:underline"
              onClick={() => onGo("calendar")}
            >
              Otwórz plan lekcji →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function KpiCard({
  label,
  value,
  hint,
  icon,
  onClick,
}: {
  label: string;
  value: string;
  hint: string;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className={cn(adminKpi, "text-left")}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <span className="rounded-xl bg-sky-50 p-2 text-sky-600">{icon}</span>
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
        {value}
      </p>
      <p className="mt-1 text-sm text-slate-500">{hint}</p>
    </button>
  );
}

function QueueRow({
  label,
  value,
  onClick,
}: {
  label: string;
  value: number;
  onClick: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center justify-between gap-3 rounded-lg px-1 py-0.5 text-left hover:bg-slate-50"
      >
        <span className="text-slate-600">{label}</span>
        <span className="font-bold text-slate-900">{value}</span>
      </button>
    </li>
  );
}
