"use client";

import type { ReactNode } from "react";

import type {
  AdminShopStats,
  BookingRow,
  ContactRow,
  LessonRow,
  MonthBalance,
  ServiceOrderRow,
  ShopEarlyBirdRow,
} from "@/lib/admin-types";
import { lessonPackageLabel } from "@/lib/lesson-packages";

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

export function AdminOverviewTab({
  contacts,
  bookings,
  lessons,
  serviceOrders,
  shopStats,
  monthBalance,
  shopEarlyBird,
  leadsCount,
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
  onGo: (tab: string) => void;
}) {
  const unread = contacts.filter((c) => !c.is_read);
  const pendingBookings = bookings.filter((b) => b.status === "pending");
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

  const topProduct = shopStats.products.find(
    (p) => p.monthStripeSales > 0 || p.stripeSales > 0,
  );

  const todos: {
    title: string;
    detail: string;
    tab: string;
    urgent: boolean;
  }[] = [];

  if (pendingBookings.length > 0) {
    const packagesHint = pendingBookings
      .slice(0, 3)
      .map(
        (b) =>
          `${b.student_name}: ${lessonPackageLabel(b.interest_package) || "bez wyboru"}`,
      )
      .join(" · ");
    todos.push({
      title: `${pendingBookings.length} nowe prośby o lekcję`,
      detail: packagesHint || "Zobacz, jaki pakiet wybrali.",
      tab: "requests",
      urgent: true,
    });
  }
  if (unread.length > 0) {
    todos.push({
      title: `${unread.length} nieprzeczytane wiadomości`,
      detail: "Formularz kontaktowy — odpisz albo oznacz jako przeczytane.",
      tab: "requests",
      urgent: true,
    });
  }
  if (readyService.length > 0) {
    todos.push({
      title: `${readyService.length} gitar gotowych do odbioru`,
      detail: "Wyślij SMS/mail albo oznacz odbiór.",
      tab: "service",
      urgent: true,
    });
  }
  if (waitingList.length > 0) {
    todos.push({
      title: `${waitingList.length} osób na liście −30%`,
      detail: "Przy premierze wyślij kod z zakładki Zgłoszenia / Sklep.",
      tab: "shop",
      urgent: false,
    });
  }
  if (todaysLessons.length > 0) {
    todos.push({
      title: `Dziś ${todaysLessons.length} lekcji w planie`,
      detail: todaysLessons
        .slice(0, 3)
        .map(
          (l) =>
            `${formatTime(l.starts_at)} ${l.students?.full_name ?? "Uczeń"}`,
        )
        .join(" · "),
      tab: "calendar",
      urgent: false,
    });
  }
  if (openService.length > 0 && readyService.length === 0) {
    todos.push({
      title: `${openService.length} gitary w serwisie`,
      detail: "W toku / w kolejce — aktualizuj status.",
      tab: "service",
      urgent: false,
    });
  }

  const urgentCount = todos.filter((t) => t.urgent).length;

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <p className="text-sm font-medium capitalize text-sky-700">
          {todayLabel()}
        </p>
        <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          Centrum dnia
        </h2>
        <p className="max-w-2xl text-sm text-slate-600">
          Najpierw pilne sprawy i dzisiejszy plan, potem szybki podgląd biznesu
          miesiąca — lekcje, serwis i sklep w jednym miejscu.
        </p>
      </header>

      {/* Month business pulse */}
      <div className="rounded-2xl border border-slate-300 bg-slate-900 p-4 text-white sm:p-5">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Biznes · {monthBalance.monthLabel}
            </p>
            <p className="mt-1 text-3xl font-bold tracking-tight">
              {moneyExact.format(monthBalance.total)}
            </p>
          </div>
          <p className="text-sm text-slate-400">
            Suma lekcji + serwisu + sklepu w tym miesiącu
          </p>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          <PulseStat
            label="Lekcje"
            value={money.format(monthBalance.lessons)}
            onClick={() => onGo("calendar")}
          />
          <PulseStat
            label="Serwis"
            value={money.format(monthBalance.service)}
            onClick={() => onGo("service")}
          />
          <PulseStat
            label="Sklep"
            value={money.format(monthBalance.shop)}
            onClick={() => onGo("shop")}
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        {/* Todos — main column */}
        <div className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-4 sm:p-5 lg:col-span-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-lg font-semibold text-slate-900">
              Do zrobienia
            </h3>
            <p className="text-sm text-slate-600">
              {urgentCount > 0
                ? `${urgentCount} pilne`
                : todos.length > 0
                  ? `${todos.length} pozycje`
                  : "Spokojnie"}
            </p>
          </div>

          {todos.length === 0 ? (
            <p className="mt-4 rounded-xl bg-white/80 px-4 py-3 text-sm text-slate-700">
              Nic pilnego. Zaplanuj lekcję, sprawdź sklep albo dopisz notatkę
              uczniowi.
            </p>
          ) : (
            <ul className="mt-4 space-y-2">
              {todos.map((todo) => (
                <li key={todo.title}>
                  <button
                    type="button"
                    onClick={() => onGo(todo.tab)}
                    className={
                      todo.urgent
                        ? "flex w-full flex-col rounded-xl border border-sky-300 bg-white px-4 py-3 text-left hover:bg-sky-50"
                        : "flex w-full flex-col rounded-xl border border-slate-300 bg-white shadow-sm/90 px-4 py-3 text-left hover:bg-slate-50"
                    }
                  >
                    <span className="flex items-center gap-2 font-semibold text-slate-900">
                      {todo.urgent ? (
                        <span className="size-1.5 shrink-0 rounded-full bg-sky-500" />
                      ) : null}
                      {todo.title}
                    </span>
                    <span className="mt-0.5 text-sm text-slate-600">
                      {todo.detail}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <QuickBtn onClick={() => onGo("calendar")}>Zaplanuj lekcję</QuickBtn>
            <QuickBtn onClick={() => onGo("shop")} tone="secondary">
              Sklep
            </QuickBtn>
            <QuickBtn onClick={() => onGo("students")} tone="secondary">
              Uczniowie
            </QuickBtn>
            <QuickBtn onClick={() => onGo("requests")} tone="secondary">
              Zgłoszenia
            </QuickBtn>
          </div>
        </div>

        {/* Today schedule */}
        <div className="rounded-2xl border border-slate-300 bg-white p-4 shadow-sm sm:p-5 lg:col-span-2">
          <h3 className="font-semibold text-slate-900">Dziś w kalendarzu</h3>
          {todaysLessons.length === 0 ? (
            <p className="mt-3 text-sm text-slate-600">Brak lekcji na dziś.</p>
          ) : (
            <ul className="mt-3 space-y-2.5">
              {todaysLessons.map((lesson) => (
                <li
                  key={lesson.id}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
                >
                  <p className="font-semibold text-slate-900">
                    {formatTime(lesson.starts_at)}–{formatTime(lesson.ends_at)}
                  </p>
                  <p className="text-slate-700">
                    {lesson.students?.full_name ?? "Uczeń"}
                  </p>
                  <p className="text-slate-600">
                    {lesson.location || "miejsce do ustalenia"}
                    {lesson.payment_status === "unpaid" ? " · nieopłacone" : ""}
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

      {/* Shop + funnel snapshot */}
      <div className="grid gap-4 md:grid-cols-2">
        <button
          type="button"
          onClick={() => onGo("shop")}
          className="rounded-2xl border border-slate-300 bg-white p-4 text-left transition-colors hover:border-sky-200 hover:bg-sky-50/40 sm:p-5"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
            Sklep · {shopStats.monthLabel}
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {moneyExact.format(shopStats.monthRevenue)}
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Stripe {moneyExact.format(shopStats.monthStripeRevenue)} · ręcznie{" "}
            {moneyExact.format(shopStats.monthManualRevenue)}
            {" · "}
            {shopStats.monthStripeUnits} płatności online
          </p>
          {topProduct ? (
            <p className="mt-3 text-sm text-slate-700">
              Najmocniej:{" "}
              <span className="font-semibold">{topProduct.title}</span>
              {topProduct.monthStripeSales > 0
                ? ` (${topProduct.monthStripeSales} w tym mies.)`
                : ` (${topProduct.stripeSales} łącznie)`}
            </p>
          ) : (
            <p className="mt-3 text-sm text-slate-600">
              Brak sprzedaży Stripe — jak pójdzie pierwsza, zobaczysz ją tu.
            </p>
          )}
          <p className="mt-3 text-sm font-semibold text-sky-700">
            Otwórz panel sklepu →
          </p>
        </button>

        <div className="rounded-2xl border border-slate-300 bg-white p-4 shadow-sm sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
            Lejek i listy
          </p>
          <ul className="mt-3 space-y-2.5 text-sm">
            <SnapshotRow
              label="Lista e-mail (PDF / leady)"
              value={String(leadsCount)}
              onClick={() => onGo("leads")}
            />
            <SnapshotRow
              label="Early-bird −30% (czekają)"
              value={String(shopStats.earlyBirdWaitingTotal)}
              onClick={() => onGo("shop")}
            />
            <SnapshotRow
              label="Otwarte zgłoszenia lekcji"
              value={String(pendingBookings.length)}
              onClick={() => onGo("requests")}
            />
            <SnapshotRow
              label="Gitary w serwisie"
              value={String(openService.length)}
              onClick={() => onGo("service")}
            />
          </ul>
        </div>
      </div>
    </section>
  );
}

function PulseStat({
  label,
  value,
  onClick,
}: {
  label: string;
  value: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl bg-white/10 px-3 py-2.5 text-left transition-colors hover:bg-white/15"
    >
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-0.5 text-lg font-semibold text-white">{value}</p>
    </button>
  );
}

function SnapshotRow({
  label,
  value,
  onClick,
}: {
  label: string;
  value: string;
  onClick: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center justify-between gap-3 rounded-xl px-2 py-1.5 text-left hover:bg-slate-50"
      >
        <span className="text-slate-700">{label}</span>
        <span className="font-semibold text-slate-900">{value}</span>
      </button>
    </li>
  );
}

function QuickBtn({
  children,
  onClick,
  tone = "primary",
}: {
  children: ReactNode;
  onClick: () => void;
  tone?: "primary" | "secondary";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        tone === "primary"
          ? "rounded-xl bg-sky-500 px-3.5 py-2 text-sm font-semibold text-white hover:bg-sky-600"
          : "rounded-xl border border-sky-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-sky-50"
      }
    >
      {children}
    </button>
  );
}
