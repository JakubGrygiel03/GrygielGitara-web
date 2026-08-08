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
import { EMPTY_ADMIN_SHOP_STATS } from "@/lib/admin-shop-stats";
import {
  adminInner,
  adminNavTrack,
  adminShell,
} from "@/lib/admin-ui";
import type { AdminDashboardData, MonthBalance } from "@/lib/admin-types";
import { cn } from "@/lib/utils";

type AdminDashboardProps = {
  data: AdminDashboardData;
};

type Tab =
  | "dashboard"
  | "requests"
  | "calendar"
  | "students"
  | "shop"
  | "service"
  | "leads"
  | "settings";

const EMPTY_MONTH_BALANCE: MonthBalance = {
  lessons: 0,
  service: 0,
  shop: 0,
  total: 0,
  monthLabel: "",
};

function navBtn(active: boolean) {
  return cn(
    "rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors sm:px-4",
    active
      ? "bg-sky-600 text-white shadow-sm"
      : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900",
  );
}

function navBtnMuted(active: boolean) {
  return cn(
    "rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors",
    active
      ? "bg-slate-800 text-white"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
  );
}

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
    waitlist = [],
    shopEarlyBird = [],
    products = [],
    shopAccounts = [],
    shopStats = EMPTY_ADMIN_SHOP_STATS,
    monthBalance = EMPTY_MONTH_BALANCE,
    settings,
    calendarError,
    opsError,
  } = data;

  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState<Tab>("dashboard");

  const unreadCount = contacts.filter((c) => !c.is_read).length;
  const pendingBookings = bookings.filter((b) => b.status === "pending").length;
  const requestsBadge = unreadCount + pendingBookings;
  const openService = serviceOrders.filter(
    (o) => o.status !== "delivered",
  ).length;

  const workNav: { id: Tab; label: string }[] = [
    { id: "dashboard", label: "Start" },
    {
      id: "requests",
      label: requestsBadge > 0 ? `Zgłoszenia (${requestsBadge})` : "Zgłoszenia",
    },
    { id: "calendar", label: "Lekcje" },
    { id: "students", label: "Uczniowie" },
    { id: "shop", label: "Sklep" },
    {
      id: "service",
      label: openService > 0 ? `Serwis (${openService})` : "Serwis",
    },
  ];

  return (
    <div data-admin className={adminShell}>
      <div className={adminInner}>
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-300 pb-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Panel GrygielGitara
            </h1>
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

        <div className={cn(adminNavTrack, "space-y-2")}>
          <nav className="flex flex-wrap gap-1.5" aria-label="Praca dzienna">
            {workNav.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={navBtn(tab === item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div className="flex flex-wrap items-center gap-1 border-t border-slate-200 pt-2">
            <span className="mr-1 px-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Inne
            </span>
            <button
              type="button"
              onClick={() => setTab("leads")}
              className={navBtnMuted(tab === "leads")}
            >
              Lista e-mail ({leads.length})
            </button>
            <button
              type="button"
              onClick={() => setTab("settings")}
              className={navBtnMuted(tab === "settings")}
            >
              Ustawienia
            </button>
          </div>
        </div>

        {opsError ? (
          <p className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-950">
            {opsError}
          </p>
        ) : null}

        {tab === "dashboard" ? (
          <AdminOverviewTab
            contacts={contacts}
            bookings={bookings}
            lessons={lessons}
            serviceOrders={serviceOrders}
            shopStats={shopStats}
            monthBalance={monthBalance}
            shopEarlyBird={shopEarlyBird}
            leadsCount={leads.length}
            onGo={(next) => setTab(next as Tab)}
          />
        ) : null}

        {tab === "requests" ? (
          <AdminRequestsTab
            contacts={contacts}
            bookings={bookings}
            waitlist={waitlist}
            shopEarlyBird={shopEarlyBird}
          />
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

        {tab === "shop" ? (
          <AdminShopTab
            products={products}
            shopAccounts={shopAccounts}
            shopStats={shopStats}
          />
        ) : null}

        {tab === "service" ? (
          <AdminServiceTab orders={serviceOrders} students={students} />
        ) : null}

        {tab === "leads" ? <AdminLeadsTab leads={leads} /> : null}

        {tab === "settings" ? <AdminSettingsTab settings={settings} /> : null}
      </div>
    </div>
  );
}
