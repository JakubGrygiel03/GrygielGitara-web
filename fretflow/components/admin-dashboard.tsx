"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { logoutAdmin } from "@/app/actions/admin-auth";
import { AdminCalendarTab } from "@/components/admin/admin-calendar-tab";
import { AdminLeadsTab } from "@/components/admin/admin-leads-tab";
import { AdminOverviewTab } from "@/components/admin/admin-overview-tab";
import { AdminRequestsTab } from "@/components/admin/admin-requests-tab";
import { AdminServiceTab } from "@/components/admin/admin-service-tab";
import { AdminSettingsTab } from "@/components/admin/admin-settings-tab";
import { AdminShopTab } from "@/components/admin/admin-shop-tab";
import { AdminStudentsTab } from "@/components/admin/admin-students-tab";
import { Button } from "@/components/ui/button";
import type { AdminDashboardData } from "@/lib/admin-types";

type AdminDashboardProps = {
  data: AdminDashboardData;
};

type Tab =
  | "dashboard"
  | "requests"
  | "calendar"
  | "students"
  | "service"
  | "leads"
  | "shop"
  | "settings";

export function AdminDashboard({ data }: AdminDashboardProps) {
  const {
    contacts = [],
    bookings = [],
    students = [],
    lessons = [],
    serviceOrders = [],
    packages = [],
    materials = [],
    sessionNotes = [],
    leads = [],
    products = [],
    settings,
    calendarError,
    opsError,
  } = data;

  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState<Tab>("dashboard");
  const [moreOpen, setMoreOpen] = useState(false);

  const unreadCount = contacts.filter((c) => !c.is_read).length;
  const pendingBookings = bookings.filter((b) => b.status === "pending").length;
  const requestsBadge = unreadCount + pendingBookings;

  const primaryNav: { id: Tab; label: string; hint?: string }[] = [
    { id: "dashboard", label: "Start" },
    {
      id: "requests",
      label: requestsBadge > 0 ? `Zgłoszenia (${requestsBadge})` : "Zgłoszenia",
    },
    { id: "calendar", label: "Lekcje" },
    { id: "students", label: "Uczniowie" },
    { id: "service", label: "Serwis" },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 sm:py-12">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Panel GrygielGitara
          </h1>
          <p className="mt-1 max-w-xl text-sm text-muted">
            Start → co ogarnąć · Zgłoszenia → nowe osoby · Lekcje → plan ·
            Uczniowie → pakiety i notatki
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              await logoutAdmin();
              router.refresh();
            });
          }}
        >
          Wyloguj
        </Button>
      </div>

      <nav className="flex flex-wrap gap-2" aria-label="Główne menu">
        {primaryNav.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setTab(item.id);
              setMoreOpen(false);
            }}
            className={
              tab === item.id
                ? "rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white"
                : "rounded-xl border border-sky-100 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-sky-50"
            }
          >
            {item.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setMoreOpen((v) => !v)}
          className={
            tab === "leads" || tab === "shop" || tab === "settings"
              ? "rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white"
              : "rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          }
        >
          Więcej {moreOpen ? "▴" : "▾"}
        </button>
      </nav>

      {moreOpen ? (
        <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
          <button
            type="button"
            onClick={() => setTab("leads")}
            className={
              tab === "leads"
                ? "rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm"
                : "rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-white"
            }
          >
            Lista e-mail ({leads.length})
          </button>
          <button
            type="button"
            onClick={() => setTab("shop")}
            className={
              tab === "shop"
                ? "rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm"
                : "rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-white"
            }
          >
            Sklep — dostęp
          </button>
          <button
            type="button"
            onClick={() => setTab("settings")}
            className={
              tab === "settings"
                ? "rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm"
                : "rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-white"
            }
          >
            Ustawienia
          </button>
        </div>
      ) : null}

      {opsError ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {opsError}
        </p>
      ) : null}

      {tab === "dashboard" ? (
        <AdminOverviewTab
          contacts={contacts}
          bookings={bookings}
          lessons={lessons}
          serviceOrders={serviceOrders}
          onGo={(next) => setTab(next as Tab)}
        />
      ) : null}

      {tab === "requests" ? (
        <AdminRequestsTab contacts={contacts} bookings={bookings} />
      ) : null}

      {tab === "calendar" ? (
        <AdminCalendarTab
          students={students}
          lessons={lessons}
          calendarError={calendarError}
          onGoStudents={() => setTab("students")}
        />
      ) : null}

      {tab === "students" ? (
        <AdminStudentsTab
          students={students}
          packages={packages}
          materials={materials}
          sessionNotes={sessionNotes}
        />
      ) : null}

      {tab === "service" ? (
        <AdminServiceTab orders={serviceOrders} students={students} />
      ) : null}

      {tab === "leads" ? <AdminLeadsTab leads={leads} /> : null}

      {tab === "shop" ? <AdminShopTab products={products} /> : null}

      {tab === "settings" ? <AdminSettingsTab settings={settings} /> : null}
    </div>
  );
}
