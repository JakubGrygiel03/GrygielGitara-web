/**
 * Manual Database types for Phase 1 tables.
 * Later: replace with `supabase gen types typescript` from the live schema.
 */

export type ContactTopic =
  | "lessons"
  | "lesson_waitlist"
  | "setup_service"
  | "shop_support"
  | "other";

export type BookingLocation = "student_home" | "studio_forum" | "online";

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      contact_messages: {
        Row: {
          id: string;
          created_at: string;
          sender_name: string;
          email: string;
          phone: string | null;
          topic: ContactTopic;
          message: string;
          is_read: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          sender_name: string;
          email: string;
          phone?: string | null;
          topic: ContactTopic;
          message: string;
          is_read?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          sender_name?: string;
          email?: string;
          phone?: string | null;
          topic?: ContactTopic;
          message?: string;
          is_read?: boolean;
        };
        Relationships: [];
      };
      bookings: {
        Row: {
          id: string;
          token: string;
          created_at: string;
          updated_at: string;
          student_name: string;
          email: string;
          phone: string | null;
          location_type: BookingLocation | null;
          interest_package: string | null;
          preferred_day: string | null;
          favorite_song: string | null;
          has_instrument: boolean | null;
          status: BookingStatus;
          message: string | null;
        };
        Insert: {
          id?: string;
          token: string;
          created_at?: string;
          updated_at?: string;
          student_name: string;
          email: string;
          phone?: string | null;
          location_type?: BookingLocation | null;
          interest_package?: string | null;
          preferred_day?: string | null;
          favorite_song?: string | null;
          has_instrument?: boolean | null;
          status?: BookingStatus;
          message?: string | null;
        };
        Update: {
          id?: string;
          token?: string;
          created_at?: string;
          updated_at?: string;
          student_name?: string;
          email?: string;
          phone?: string | null;
          location_type?: BookingLocation | null;
          interest_package?: string | null;
          preferred_day?: string | null;
          favorite_song?: string | null;
          has_instrument?: boolean | null;
          status?: BookingStatus;
          message?: string | null;
        };
        Relationships: [];
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          created_at: string;
          email: string;
          source: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          email: string;
          source?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          email?: string;
          source?: string | null;
        };
        Relationships: [];
      };
      students: {
        Row: {
          id: string;
          created_at: string;
          full_name: string;
          email: string;
          phone: string | null;
          default_location: string | null;
          interest_package: string | null;
          notes: string | null;
          user_id: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          full_name: string;
          email: string;
          phone?: string | null;
          default_location?: string | null;
          interest_package?: string | null;
          notes?: string | null;
          user_id?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          full_name?: string;
          email?: string;
          phone?: string | null;
          default_location?: string | null;
          interest_package?: string | null;
          notes?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      lessons: {
        Row: {
          id: string;
          created_at: string;
          student_id: string;
          starts_at: string;
          ends_at: string;
          location: string | null;
          notes: string | null;
          notify_sent: boolean;
          reminder_sent: boolean;
          series_id: string | null;
          payment_status: "paid" | "unpaid";
          price: number | null;
          package_consumed: boolean;
          consumed_package_id: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          student_id: string;
          starts_at: string;
          ends_at: string;
          location?: string | null;
          notes?: string | null;
          notify_sent?: boolean;
          reminder_sent?: boolean;
          series_id?: string | null;
          payment_status?: "paid" | "unpaid";
          price?: number | null;
          package_consumed?: boolean;
          consumed_package_id?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          student_id?: string;
          starts_at?: string;
          ends_at?: string;
          location?: string | null;
          notes?: string | null;
          notify_sent?: boolean;
          reminder_sent?: boolean;
          series_id?: string | null;
          payment_status?: "paid" | "unpaid";
          price?: number | null;
          package_consumed?: boolean;
          consumed_package_id?: string | null;
        };
        Relationships: [];
      };
      admin_settings: {
        Row: { key: string; value: Json; updated_at: string };
        Insert: { key: string; value: Json; updated_at?: string };
        Update: { key?: string; value?: Json; updated_at?: string };
        Relationships: [];
      };
      service_orders: {
        Row: {
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
          delivered_at: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          student_id?: string | null;
          client_name: string;
          email?: string | null;
          phone?: string | null;
          guitar_model: string;
          received_at?: string;
          condition_notes?: string | null;
          status?: "queued" | "in_progress" | "ready" | "delivered";
          price?: number | null;
          notify_ready_sent?: boolean;
          delivered_at?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          student_id?: string | null;
          client_name?: string;
          email?: string | null;
          phone?: string | null;
          guitar_model?: string;
          received_at?: string;
          condition_notes?: string | null;
          status?: "queued" | "in_progress" | "ready" | "delivered";
          price?: number | null;
          notify_ready_sent?: boolean;
          delivered_at?: string | null;
        };
        Relationships: [];
      };
      student_packages: {
        Row: {
          id: string;
          created_at: string;
          student_id: string;
          label: string;
          total_lessons: number;
          remaining_lessons: number;
          active: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          student_id: string;
          label?: string;
          total_lessons: number;
          remaining_lessons: number;
          active?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          student_id?: string;
          label?: string;
          total_lessons?: number;
          remaining_lessons?: number;
          active?: boolean;
        };
        Relationships: [];
      };
      student_materials: {
        Row: {
          id: string;
          created_at: string;
          student_id: string;
          title: string;
          url: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          student_id: string;
          title: string;
          url: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          student_id?: string;
          title?: string;
          url?: string;
        };
        Relationships: [];
      };
      lesson_session_notes: {
        Row: {
          id: string;
          created_at: string;
          student_id: string;
          lesson_id: string | null;
          body: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          student_id: string;
          lesson_id?: string | null;
          body: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          student_id?: string;
          lesson_id?: string | null;
          body?: string;
        };
        Relationships: [];
      };
      revenue_entries: {
        Row: {
          id: string;
          created_at: string;
          occurred_on: string;
          category: "lesson" | "service" | "shop";
          amount: number;
          note: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          occurred_on?: string;
          category: "lesson" | "service" | "shop";
          amount: number;
          note?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          occurred_on?: string;
          category?: "lesson" | "service" | "shop";
          amount?: number;
          note?: string | null;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          created_at: string;
          slug: string;
          title: string;
          short_description: string;
          description: string;
          price_grosze: number;
          currency: string;
          badge: string;
          image_path: string;
          file_path: string;
          published: boolean;
          coming_soon: boolean;
          early_bird_open: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          slug: string;
          title: string;
          short_description?: string;
          description?: string;
          price_grosze: number;
          currency?: string;
          badge?: string;
          image_path: string;
          file_path: string;
          published?: boolean;
          coming_soon?: boolean;
          early_bird_open?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          slug?: string;
          title?: string;
          short_description?: string;
          description?: string;
          price_grosze?: number;
          currency?: string;
          badge?: string;
          image_path?: string;
          file_path?: string;
          published?: boolean;
          coming_soon?: boolean;
          early_bird_open?: boolean;
        };
        Relationships: [];
      };
      shop_early_bird_signups: {
        Row: {
          id: string;
          created_at: string;
          full_name: string;
          email: string;
          phone: string | null;
          product_slug: string;
          product_title: string;
          discount_percent: number;
          claim_token: string;
          status: "waiting" | "notified" | "redeemed" | "cancelled";
          note: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          full_name: string;
          email: string;
          phone?: string | null;
          product_slug: string;
          product_title: string;
          discount_percent: number;
          claim_token?: string;
          status?: "waiting" | "notified" | "redeemed" | "cancelled";
          note?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          full_name?: string;
          email?: string;
          phone?: string | null;
          product_slug?: string;
          product_title?: string;
          discount_percent?: number;
          claim_token?: string;
          status?: "waiting" | "notified" | "redeemed" | "cancelled";
          note?: string | null;
        };
        Relationships: [];
      };
      user_entitlements: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          product_id: string;
          stripe_checkout_session_id: string | null;
          source: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          product_id: string;
          stripe_checkout_session_id?: string | null;
          source?: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          product_id?: string;
          stripe_checkout_session_id?: string | null;
          source?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type ContactMessage = Database["public"]["Tables"]["contact_messages"]["Row"];
export type Booking = Database["public"]["Tables"]["bookings"]["Row"];
export type NewsletterSubscriber =
  Database["public"]["Tables"]["newsletter_subscribers"]["Row"];
export type Student = Database["public"]["Tables"]["students"]["Row"];
export type Lesson = Database["public"]["Tables"]["lessons"]["Row"];
