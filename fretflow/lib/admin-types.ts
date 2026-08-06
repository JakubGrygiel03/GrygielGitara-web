import type { AdminSettings } from "@/lib/admin-settings";
import type { bookingLocations } from "@/lib/validations/booking";
import type { contactTopics } from "@/lib/validations/contact";

export type ContactRow = {
  id: string;
  created_at: string;
  sender_name: string;
  email: string;
  phone: string | null;
  topic: (typeof contactTopics)[number];
  message: string;
  is_read: boolean;
};

export type BookingRow = {
  id: string;
  created_at: string;
  student_name: string;
  email: string;
  phone: string | null;
  location_type: (typeof bookingLocations)[number] | null;
  interest_package: string | null;
  preferred_day: string | null;
  favorite_song: string | null;
  has_instrument: boolean | null;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  message: string | null;
};

export type StudentRow = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  default_location: string | null;
  interest_package: string | null;
  notes: string | null;
  user_id: string | null;
};

export type LessonRow = {
  id: string;
  starts_at: string;
  ends_at: string;
  location: string | null;
  notes: string | null;
  notify_sent: boolean;
  reminder_sent: boolean;
  series_id: string | null;
  student_id: string;
  payment_status: "paid" | "unpaid";
  price: number | null;
  package_consumed: boolean;
  students: { full_name: string; email: string; phone: string | null } | null;
};

export type ServiceOrderRow = {
  id: string;
  created_at: string;
  student_id: string | null;
  client_name: string;
  email: string | null;
  phone: string | null;
  guitar_model: string;
  received_at: string;
  condition_notes: string | null;
  status: "queued" | "in_progress" | "ready" | "delivered";
  price: number | null;
  notify_ready_sent: boolean;
};

export type PackageRow = {
  id: string;
  student_id: string;
  label: string;
  total_lessons: number;
  remaining_lessons: number;
  active: boolean;
};

export type MaterialRow = {
  id: string;
  student_id: string;
  title: string;
  url: string;
  created_at: string;
};

export type SessionNoteRow = {
  id: string;
  student_id: string;
  lesson_id: string | null;
  body: string;
  created_at: string;
};

export type LeadRow = {
  id: string;
  created_at: string;
  email: string;
  source: string | null;
};

export type AdminShopProduct = {
  id: string;
  slug: string;
  title: string;
  published: boolean;
  coming_soon: boolean;
};

export type MonthBalance = {
  lessons: number;
  service: number;
  shop: number;
  total: number;
  monthLabel: string;
};

export type AdminDashboardData = {
  contacts: ContactRow[];
  bookings: BookingRow[];
  students: StudentRow[];
  lessons: LessonRow[];
  serviceOrders: ServiceOrderRow[];
  packages: PackageRow[];
  materials: MaterialRow[];
  sessionNotes: SessionNoteRow[];
  leads: LeadRow[];
  products: AdminShopProduct[];
  monthBalance: MonthBalance;
  settings: AdminSettings;
  calendarError?: string | null;
  opsError?: string | null;
};
