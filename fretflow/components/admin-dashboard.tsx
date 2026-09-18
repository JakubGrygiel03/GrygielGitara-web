"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, Search } from "lucide-react";
import Link from "next/link";

import { logoutAdmin } from "@/app/actions/admin-auth";
import {
  AdminCmsMenuButton,
  AdminCmsSidebar,
  type CmsTab,
} from "@/components/admin/admin-cms-sidebar";
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
import { adminShell, cmsCanvas, cmsMain, cmsTopBar } from "@/lib/admin-ui";
import type { AdminDashboardData, MonthBalance } from "@/lib/admin-types";

type AdminDashboardProps = {
  data: AdminDashboardData;
};

const EMPTY_MONTH_BALANCE: MonthBalance = {
  lessons: 0,
  service: 0,
  shop: 0,
  total: 0,
  monthLabel: "",
};

const TAB_TITLES: Record<CmsTab, string> = {
  dashboard: "Pulpit",
  requests: "Zgłoszenia",
  calendar: "Lekcje",
  students: "Uczniowie",
  shop: "Sklep",
  service: "Serwis",
  leads: "Lista e-mail",
  settings: "Ustawienia",
};

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
  const [tab, setTab] = useState<CmsTab>("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");

  const unreadCount = contacts.filter((c) => !c.is_read).length;
  const pendingBookings = bookings.filter((b) => b.status === "pending").length;
  const requestsBadge = unreadCount + pendingBookings;
  const openService = serviceOrders.filter(
    (o) => o.status !== "delivered",
  ).length;
  const toCheck = requestsBadge + openService;

  return (
    <div data-admin className={adminShell}>
      <AdminCmsSidebar
        tab={tab}
        onSelect={setTab}
        badges={{
          requests: requestsBadge,
          service: openService,
          leads: leads.length,
        }}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className={cmsMain}>
        <header className={cmsTopBar}>
          <AdminCmsMenuButton onClick={() => setMobileOpen(true)} />
          <label className="relative min-w-0 flex-1 max-w-md">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
              aria-hidden
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Szukaj w panelu…"
              className="h-10 w-full rounded-full border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-800 shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              aria-label="Szukaj w panelu"
            />
          </label>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            {toCheck > 0 ? (
              <button
                type="button"
                onClick={() => setTab("requests")}
                className="hidden rounded-full bg-sky-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-sky-600 sm:inline-flex"
              >
                {toCheck} do sprawdzenia
              </button>
            ) : null}
            <Link
              href="/sklep"
              className="hidden items-center gap-1.5 rounded-full border border-sky-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm hover:bg-sky-50 sm:inline-flex"
            >
              Zobacz sklep
              <ExternalLink className="size-3.5" aria-hidden />
            </Link>
            <Button
              type="button"
              variant="secondary"
              size="sm"
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
        </header>

        <div className={cmsCanvas}>
          {tab !== "dashboard" ? (
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {TAB_TITLES[tab]}
            </h1>
          ) : null}

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
              studentsCount={students.length}
              productsCount={products.length}
              onGo={(next) => setTab(next as CmsTab)}
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

          {tab === "settings" ? (
            <AdminSettingsTab settings={settings} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
