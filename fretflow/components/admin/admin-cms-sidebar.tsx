"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  BookOpen,
  CalendarDays,
  ExternalLink,
  LayoutDashboard,
  Mail,
  Menu,
  MessageSquare,
  Settings,
  ShoppingBag,
  Users,
  Wrench,
  X,
} from "lucide-react";

import { cmsSidebar } from "@/lib/admin-ui";
import { cn } from "@/lib/utils";

export type CmsTab =
  | "dashboard"
  | "requests"
  | "calendar"
  | "students"
  | "shop"
  | "service"
  | "leads"
  | "settings";

type NavItem = {
  id: CmsTab;
  label: string;
  icon: ReactNode;
  badge?: number;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

export function AdminCmsSidebar({
  tab,
  onSelect,
  badges,
  mobileOpen,
  onCloseMobile,
}: {
  tab: CmsTab;
  onSelect: (id: CmsTab) => void;
  badges: {
    requests: number;
    service: number;
    leads: number;
  };
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  const groups: NavGroup[] = [
    {
      label: "Przegląd",
      items: [
        {
          id: "dashboard",
          label: "Pulpit",
          icon: <LayoutDashboard className="size-4" aria-hidden />,
        },
      ],
    },
    {
      label: "Praca",
      items: [
        {
          id: "requests",
          label: "Zgłoszenia",
          icon: <MessageSquare className="size-4" aria-hidden />,
          badge: badges.requests || undefined,
        },
        {
          id: "calendar",
          label: "Lekcje",
          icon: <CalendarDays className="size-4" aria-hidden />,
        },
        {
          id: "students",
          label: "Uczniowie",
          icon: <Users className="size-4" aria-hidden />,
        },
        {
          id: "service",
          label: "Serwis",
          icon: <Wrench className="size-4" aria-hidden />,
          badge: badges.service || undefined,
        },
      ],
    },
    {
      label: "Sklep",
      items: [
        {
          id: "shop",
          label: "Produkty i sprzedaż",
          icon: <ShoppingBag className="size-4" aria-hidden />,
        },
        {
          id: "leads",
          label: "Lista e-mail",
          icon: <Mail className="size-4" aria-hidden />,
          badge: badges.leads || undefined,
        },
      ],
    },
    {
      label: "System",
      items: [
        {
          id: "settings",
          label: "Ustawienia",
          icon: <Settings className="size-4" aria-hidden />,
        },
      ],
    },
  ];

  const nav = (
    <aside className={cn(cmsSidebar, "h-full min-h-0")}>
      <div className="flex items-center justify-between gap-2 border-b border-sky-100 px-4 py-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-sky-600">
            CMS
          </p>
          <p className="text-sm font-extrabold tracking-tight text-slate-900">
            Grygiel<span className="text-sky-500">Gitara</span>
          </p>
        </div>
        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-xl text-slate-700 hover:bg-sky-50 lg:hidden"
          aria-label="Zamknij menu"
          onClick={onCloseMobile}
        >
          <X className="size-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4" aria-label="CMS">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="mb-1.5 px-2 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = tab === item.id;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onSelect(item.id);
                        onCloseMobile();
                      }}
                      className={cn(
                        "flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-left text-sm font-semibold transition-colors",
                        active
                          ? "bg-sky-500 text-white shadow-sm"
                          : "text-slate-700 hover:bg-sky-50 hover:text-sky-900",
                      )}
                    >
                      <span className={active ? "text-white" : "text-sky-600"}>
                        {item.icon}
                      </span>
                      <span className="flex-1">{item.label}</span>
                      {item.badge ? (
                        <span
                          className={cn(
                            "inline-flex min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold",
                            active
                              ? "bg-white/25 text-white"
                              : "bg-sky-100 text-sky-800",
                          )}
                        >
                          {item.badge > 99 ? "99+" : item.badge}
                        </span>
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-sky-100 p-3">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl px-2.5 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-sky-50 hover:text-sky-800"
        >
          <ExternalLink className="size-4 text-sky-600" aria-hidden />
          Zobacz stronę
        </Link>
        <p className="mt-1 flex items-center gap-2 px-2.5 py-1 text-xs text-slate-500">
          <BookOpen className="size-3.5 text-sky-500" aria-hidden />
          Panel nauczyciela
        </p>
      </div>
    </aside>
  );

  return (
    <>
      <div className="hidden lg:block">{nav}</div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/30"
            aria-label="Zamknij menu"
            onClick={onCloseMobile}
          />
          <div className="absolute inset-y-0 left-0 w-[min(18rem,88vw)] shadow-2xl">
            {nav}
          </div>
        </div>
      ) : null}
    </>
  );
}

export function AdminCmsMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex size-10 items-center justify-center rounded-xl border border-sky-100 bg-white text-slate-800 shadow-sm hover:bg-sky-50 lg:hidden"
      aria-label="Otwórz menu CMS"
    >
      <Menu className="size-5" />
    </button>
  );
}
