import type { Metadata } from "next";

import { AdminDashboard } from "@/components/admin-dashboard";
import { AdminLoginForm } from "@/components/admin-login-form";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  DEFAULT_ADMIN_SETTINGS,
  getAdminSettings,
} from "@/lib/admin-settings";
import type { AdminDashboardData, LessonRow } from "@/lib/admin-types";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const authed = await isAdminAuthenticated();

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-16">
        <AdminLoginForm />
      </div>
    );
  }

  try {
    const data = await loadAdminData();
    return <AdminDashboard data={data} />;
  } catch (error) {
    console.error("admin data load failed:", error);
    return (
      <div className="mx-auto max-w-xl px-4 py-16">
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          Nie udało się pobrać danych. Sprawdź SUPABASE_SERVICE_ROLE_KEY i
          grants.
        </p>
      </div>
    );
  }
}

async function loadAdminData(): Promise<AdminDashboardData> {
  const supabase = createAdminClient();

  const [contactsResult, leadsResult, settings] = await Promise.all([
    supabase
      .from("contact_messages")
      .select(
        "id, created_at, sender_name, email, phone, topic, message, is_read",
      )
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("newsletter_subscribers")
      .select("id, created_at, email, source")
      .order("created_at", { ascending: false })
      .limit(500),
    getAdminSettings(),
  ]);

  if (contactsResult.error) throw new Error(contactsResult.error.message);

  const bookingsResult = await supabase
    .from("bookings")
    .select(
      "id, created_at, student_name, email, phone, location_type, interest_package, preferred_day, favorite_song, has_instrument, status, message",
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (bookingsResult.error) throw new Error(bookingsResult.error.message);

  let students: AdminDashboardData["students"] = [];
  let lessons: LessonRow[] = [];
  let serviceOrders: AdminDashboardData["serviceOrders"] = [];
  let packages: AdminDashboardData["packages"] = [];
  let materials: AdminDashboardData["materials"] = [];
  let sessionNotes: AdminDashboardData["sessionNotes"] = [];
  let calendarError: string | null = null;
  let opsError: string | null = null;

  const studentsWithAuth = await supabase
    .from("students")
    .select(
      "id, full_name, email, phone, default_location, interest_package, notes, user_id",
    )
    .order("full_name", { ascending: true });

  const studentsResult = studentsWithAuth.error?.message.includes("user_id")
    ? await supabase
        .from("students")
        .select(
          "id, full_name, email, phone, default_location, interest_package, notes",
        )
        .order("full_name", { ascending: true })
    : studentsWithAuth;

  if (studentsResult.error) {
    calendarError =
      "Kalendarz wymaga migracji SQL: supabase/migrations/20260326_students_lessons.sql";
  } else {
    students = (studentsResult.data ?? []).map((row) => ({
      id: row.id,
      full_name: row.full_name,
      email: row.email,
      phone: row.phone,
      default_location: row.default_location,
      interest_package: row.interest_package,
      notes: row.notes,
      user_id:
        "user_id" in row
          ? ((row as { user_id?: string | null }).user_id ?? null)
          : null,
    }));

    const from = new Date();
    from.setDate(from.getDate() - 14);
    const to = new Date();
    to.setDate(to.getDate() + 200);

    const lessonsResult = await supabase
      .from("lessons")
      .select(
        "id, starts_at, ends_at, location, notes, notify_sent, reminder_sent, series_id, student_id, payment_status, price, package_consumed, students(full_name, email, phone)",
      )
      .gte("starts_at", from.toISOString())
      .lte("starts_at", to.toISOString())
      .order("starts_at", { ascending: true });

    if (lessonsResult.error) {
      // Fallback without payment columns if migration not run yet
      const fallback = await supabase
        .from("lessons")
        .select(
          "id, starts_at, ends_at, location, notes, notify_sent, reminder_sent, series_id, student_id, students(full_name, email, phone)",
        )
        .gte("starts_at", from.toISOString())
        .lte("starts_at", to.toISOString())
        .order("starts_at", { ascending: true });

      if (fallback.error) {
        calendarError = lessonsResult.error.message;
      } else {
        calendarError =
          "Odpal migrację 20260326_admin_ops.sql (płatności lekcji).";
        lessons = mapLessons(fallback.data as unknown[]);
      }
    } else {
      lessons = mapLessons(lessonsResult.data as unknown[]);
    }
  }

  const [svc, pkgs, mats, notes, revenue] = await Promise.all([
    supabase
      .from("service_orders")
      .select(
        "id, created_at, student_id, client_name, email, phone, guitar_model, received_at, condition_notes, status, price, notify_ready_sent",
      )
      .order("received_at", { ascending: false })
      .limit(100),
    supabase
      .from("student_packages")
      .select("id, student_id, label, total_lessons, remaining_lessons, active")
      .order("created_at", { ascending: false }),
    supabase
      .from("student_materials")
      .select("id, student_id, title, url, created_at")
      .order("created_at", { ascending: false })
      .limit(300),
    supabase
      .from("lesson_session_notes")
      .select("id, student_id, lesson_id, body, created_at")
      .order("created_at", { ascending: false })
      .limit(300),
    supabase
      .from("revenue_entries")
      .select("id, occurred_on, category, amount")
      .order("occurred_on", { ascending: false })
      .limit(200),
  ]);

  if (svc.error || pkgs.error || mats.error || notes.error) {
    opsError =
      "Nowe moduły wymagają migracji supabase/migrations/20260326_admin_ops.sql";
  } else {
    serviceOrders = svc.data ?? [];
    packages = pkgs.data ?? [];
    materials = mats.data ?? [];
    sessionNotes = notes.data ?? [];
  }

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  const monthLabel = new Intl.DateTimeFormat("pl-PL", {
    month: "long",
    year: "numeric",
  }).format(now);

  const lessonsSum = lessons
    .filter(
      (l) =>
        l.payment_status === "paid" &&
        l.price != null &&
        new Date(l.starts_at) >= monthStart &&
        new Date(l.starts_at) <= monthEnd,
    )
    .reduce((sum, l) => sum + Number(l.price ?? 0), 0);

  const serviceSum = serviceOrders
    .filter((o) => {
      if (o.status !== "delivered" || o.price == null) return false;
      const d = new Date(o.received_at);
      return d >= monthStart && d <= monthEnd;
    })
    .reduce((sum, o) => sum + Number(o.price ?? 0), 0);

  const shopSum = (revenue.data ?? [])
    .filter((row) => {
      const d = new Date(row.occurred_on);
      return d >= monthStart && d <= monthEnd;
    })
    .reduce((sum, row) => {
      if (row.category === "shop") return sum + Number(row.amount);
      if (row.category === "lesson") return sum + Number(row.amount);
      if (row.category === "service") return sum + Number(row.amount);
      return sum;
    }, 0);

  // Attribute manual entries into categories for display
  let shopOnly = 0;
  let lessonManual = 0;
  let serviceManual = 0;
  for (const row of revenue.data ?? []) {
    const d = new Date(row.occurred_on);
    if (d < monthStart || d > monthEnd) continue;
    if (row.category === "shop") shopOnly += Number(row.amount);
    if (row.category === "lesson") lessonManual += Number(row.amount);
    if (row.category === "service") serviceManual += Number(row.amount);
  }

  const monthBalance = {
    lessons: lessonsSum + lessonManual,
    service: serviceSum + serviceManual,
    shop: shopOnly,
    total: lessonsSum + serviceSum + shopSum,
    monthLabel,
  };

  return {
    contacts: contactsResult.data ?? [],
    bookings: bookingsResult.data ?? [],
    students,
    lessons,
    serviceOrders,
    packages,
    materials,
    sessionNotes,
    leads: leadsResult.error ? [] : (leadsResult.data ?? []),
    monthBalance,
    settings: settings ?? DEFAULT_ADMIN_SETTINGS,
    calendarError,
    opsError,
  };
}

function mapLessons(rows: unknown[]): LessonRow[] {
  type LessonJoin = {
    id: string;
    starts_at: string;
    ends_at: string;
    location: string | null;
    notes: string | null;
    notify_sent: boolean;
    reminder_sent: boolean;
    series_id: string | null;
    student_id: string;
    payment_status?: "paid" | "unpaid";
    price?: number | null;
    package_consumed?: boolean;
    students:
      | { full_name: string; email: string; phone: string | null }
      | { full_name: string; email: string; phone: string | null }[]
      | null;
  };

  return (rows as LessonJoin[]).map((row) => ({
    id: row.id,
    starts_at: row.starts_at,
    ends_at: row.ends_at,
    location: row.location,
    notes: row.notes,
    notify_sent: row.notify_sent,
    reminder_sent: row.reminder_sent ?? false,
    series_id: row.series_id,
    student_id: row.student_id,
    payment_status: row.payment_status ?? "unpaid",
    price: row.price ?? null,
    package_consumed: row.package_consumed ?? false,
    students: Array.isArray(row.students)
      ? (row.students[0] ?? null)
      : row.students,
  }));
}
