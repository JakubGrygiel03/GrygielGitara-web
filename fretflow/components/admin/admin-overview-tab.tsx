"use client";

import type { ReactNode } from "react";

import type {
  BookingRow,
  ContactRow,
  LessonRow,
  ServiceOrderRow,
} from "@/lib/admin-types";
import { lessonPackageLabel } from "@/lib/lesson-packages";

function formatTime(value: string) {
  return new Intl.DateTimeFormat("pl-PL", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function AdminOverviewTab({
  contacts,
  bookings,
  lessons,
  serviceOrders,
  onGo,
}: {
  contacts: ContactRow[];
  bookings: BookingRow[];
  lessons: LessonRow[];
  serviceOrders: ServiceOrderRow[];
  onGo: (tab: string) => void;
}) {
  const unread = contacts.filter((c) => !c.is_read);
  const pendingBookings = bookings.filter((b) => b.status === "pending");
  const todayKey = new Date().toDateString();
  const todaysLessons = lessons
    .filter((l) => new Date(l.starts_at).toDateString() === todayKey)
    .sort(
      (a, b) =>
        new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime(),
    );
  const openService = serviceOrders.filter((o) => o.status !== "delivered");

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
      detail: "Z formularza kontaktowego.",
      tab: "requests",
      urgent: true,
    });
  }
  if (todaysLessons.length > 0) {
    todos.push({
      title: `Dziś masz ${todaysLessons.length} lekcji`,
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
  if (openService.length > 0) {
    todos.push({
      title: `${openService.length} gitary w serwisie`,
      detail: "Status albo powiadomienie o odbiorze.",
      tab: "service",
      urgent: false,
    });
  }

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-slate-900">Co ogarnąć</h2>
        <p className="mt-1 text-sm text-muted">
          Kliknij pozycję — przejdziesz do właściwej zakładki.
        </p>

        {todos.length === 0 ? (
          <p className="mt-4 rounded-xl bg-white/80 px-4 py-3 text-sm text-slate-700">
            Nic pilnego. Możesz zaplanować lekcję albo sprawdzić uczniów i ich
            wybrane pakiety.
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
                      : "flex w-full flex-col rounded-xl border border-slate-200 bg-white/90 px-4 py-3 text-left hover:bg-slate-50"
                  }
                >
                  <span className="font-semibold text-slate-900">
                    {todo.title}
                  </span>
                  <span className="mt-0.5 text-sm text-muted">{todo.detail}</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <QuickBtn onClick={() => onGo("calendar")}>Zaplanuj lekcję</QuickBtn>
          <QuickBtn onClick={() => onGo("students")}>Uczniowie / pakiety</QuickBtn>
          <QuickBtn onClick={() => onGo("requests")}>Zgłoszenia</QuickBtn>
        </div>
      </div>

      <div className="rounded-2xl border border-sky-100 bg-white p-4 sm:p-5">
        <p className="text-sm font-semibold text-slate-900">Dzisiejszy plan</p>
        {todaysLessons.length === 0 ? (
          <p className="mt-2 text-sm text-muted">Brak lekcji na dziś.</p>
        ) : (
          <ul className="mt-2 space-y-1.5 text-sm">
            {todaysLessons.map((lesson) => (
              <li key={lesson.id} className="text-slate-700">
                <span className="font-medium">{formatTime(lesson.starts_at)}</span>{" "}
                {lesson.students?.full_name ?? "Uczeń"}
                <span className="text-muted">
                  {" "}
                  · {lesson.location || "miejsce?"}
                </span>
              </li>
            ))}
          </ul>
        )}
        <button
          type="button"
          className="mt-3 text-sm font-semibold text-sky-700 hover:underline"
          onClick={() => onGo("calendar")}
        >
          Otwórz tydzień →
        </button>
      </div>
    </section>
  );
}

function QuickBtn({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl bg-sky-500 px-3.5 py-2 text-sm font-semibold text-white hover:bg-sky-600"
    >
      {children}
    </button>
  );
}
