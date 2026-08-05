-- GrygielGitara — wszystkie migracje (bezpieczne do ponownego uruchomienia)
-- Supabase → SQL Editor → New query → wklej CAŁY plik → Run
-- Kolejność: phase1 → students/lessons → admin ops → kolumny pakietów

-- ========== 20260325_phase1_core ==========
create extension if not exists "pgcrypto";

create table if not exists public.contact_messages (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  sender_name text not null,
  email text not null,
  phone text,
  topic text not null check (topic in ('lessons', 'setup_service', 'shop_support', 'other')),
  message text not null,
  is_read boolean default false not null
);

create table if not exists public.bookings (
  id uuid default gen_random_uuid() primary key,
  token text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  student_name text not null,
  email text not null,
  phone text,
  location_type text check (location_type in ('student_home', 'studio_forum', 'online')),
  preferred_day text,
  favorite_song text,
  has_instrument boolean default true,
  status text default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  message text
);

create table if not exists public.newsletter_subscribers (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  email text unique not null,
  source text default 'tuning_pdf_lead_magnet'
);

create or replace function public.set_bookings_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

drop trigger if exists bookings_set_updated_at on public.bookings;
create trigger bookings_set_updated_at
  before update on public.bookings
  for each row
  execute function public.set_bookings_updated_at();

alter table public.contact_messages enable row level security;
alter table public.bookings enable row level security;
alter table public.newsletter_subscribers enable row level security;

drop policy if exists "Allow public to insert contact messages" on public.contact_messages;
create policy "Allow public to insert contact messages"
  on public.contact_messages for insert with check (true);

drop policy if exists "Allow public to insert bookings" on public.bookings;
create policy "Allow public to insert bookings"
  on public.bookings for insert with check (true);

drop policy if exists "Allow public to subscribe to newsletter" on public.newsletter_subscribers;
create policy "Allow public to subscribe to newsletter"
  on public.newsletter_subscribers for insert with check (true);

-- ========== 20260325_phase1_grants ==========
grant usage on schema public to anon, authenticated, service_role;

grant insert on table public.contact_messages to anon, authenticated, service_role;
grant insert on table public.bookings to anon, authenticated, service_role;
grant insert on table public.newsletter_subscribers to anon, authenticated, service_role;

grant select, update, delete on table public.contact_messages to service_role;
grant select, update, delete on table public.bookings to service_role;
grant select, update, delete on table public.newsletter_subscribers to service_role;

-- ========== 20260326_students_lessons ==========
create table if not exists public.students (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  full_name text not null,
  email text not null,
  phone text,
  default_location text,
  notes text
);

create table if not exists public.lessons (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  student_id uuid not null references public.students(id) on delete cascade,
  starts_at timestamp with time zone not null,
  ends_at timestamp with time zone not null,
  location text,
  notes text,
  notify_sent boolean default false not null,
  reminder_sent boolean default false not null,
  series_id uuid
);

create index if not exists lessons_starts_at_idx on public.lessons (starts_at);
create index if not exists lessons_student_id_idx on public.lessons (student_id);
create index if not exists lessons_series_id_idx on public.lessons (series_id);
create index if not exists lessons_reminder_sent_idx on public.lessons (reminder_sent, starts_at);

alter table public.students enable row level security;
alter table public.lessons enable row level security;

grant usage on schema public to service_role;
grant all on table public.students to service_role;
grant all on table public.lessons to service_role;

-- ========== 20260326_students_default_location / recurring_reminders ==========
alter table public.students
  add column if not exists default_location text;

alter table public.lessons
  add column if not exists series_id uuid;

alter table public.lessons
  add column if not exists reminder_sent boolean default false not null;

create index if not exists lessons_series_id_idx on public.lessons (series_id);
create index if not exists lessons_reminder_sent_idx on public.lessons (reminder_sent, starts_at);

-- ========== 20260326_admin_ops ==========
alter table public.lessons
  add column if not exists payment_status text default 'unpaid' not null;

alter table public.lessons
  add column if not exists price numeric(10, 2);

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'lessons_payment_status_check'
  ) then
    alter table public.lessons
      add constraint lessons_payment_status_check
      check (payment_status in ('unpaid', 'paid'));
  end if;
end $$;

create table if not exists public.admin_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.service_orders (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  student_id uuid references public.students(id) on delete set null,
  client_name text not null,
  email text,
  phone text,
  guitar_model text not null,
  received_at date not null default (timezone('utc'::text, now()))::date,
  condition_notes text,
  status text not null default 'queued'
    check (status in ('queued', 'in_progress', 'ready', 'delivered')),
  price numeric(10, 2),
  notify_ready_sent boolean default false not null,
  delivered_at timestamp with time zone
);

create index if not exists service_orders_status_idx on public.service_orders (status);
create index if not exists service_orders_received_at_idx on public.service_orders (received_at);

create table if not exists public.student_packages (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  student_id uuid not null references public.students(id) on delete cascade,
  label text not null default 'Pakiet lekcji',
  total_lessons integer not null check (total_lessons > 0),
  remaining_lessons integer not null check (remaining_lessons >= 0),
  active boolean default true not null
);

create index if not exists student_packages_student_id_idx
  on public.student_packages (student_id);

create table if not exists public.student_materials (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  student_id uuid not null references public.students(id) on delete cascade,
  title text not null,
  url text not null
);

create index if not exists student_materials_student_id_idx
  on public.student_materials (student_id);

create table if not exists public.lesson_session_notes (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  student_id uuid not null references public.students(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete set null,
  body text not null
);

create index if not exists lesson_session_notes_student_id_idx
  on public.lesson_session_notes (student_id, created_at desc);

create table if not exists public.revenue_entries (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  occurred_on date not null default (timezone('utc'::text, now()))::date,
  category text not null check (category in ('lesson', 'service', 'shop')),
  amount numeric(10, 2) not null,
  note text
);

create index if not exists revenue_entries_occurred_on_idx
  on public.revenue_entries (occurred_on);

alter table public.admin_settings enable row level security;
alter table public.service_orders enable row level security;
alter table public.student_packages enable row level security;
alter table public.student_materials enable row level security;
alter table public.lesson_session_notes enable row level security;
alter table public.revenue_entries enable row level security;

grant all on table public.admin_settings to service_role;
grant all on table public.service_orders to service_role;
grant all on table public.student_packages to service_role;
grant all on table public.student_materials to service_role;
grant all on table public.lesson_session_notes to service_role;
grant all on table public.revenue_entries to service_role;

insert into public.admin_settings (key, value)
values
  ('sms_enabled', 'true'::jsonb),
  ('booking_paused', 'false'::jsonb),
  (
    'booking_paused_message',
    '"Chwilowo wstrzymane zapisy na nowe lekcje. Napisz na kontakt — odpiszę, gdy wrócę."'::jsonb
  ),
  ('notify_email', '""'::jsonb),
  ('teacher_phone', '""'::jsonb)
on conflict (key) do nothing;

-- ========== booking / student package + lesson consume ==========
alter table public.bookings
  add column if not exists interest_package text;

comment on column public.bookings.interest_package is
  'pack_4_home | single_studio | single_home | single_online';

alter table public.lessons
  add column if not exists package_consumed boolean default false not null;

alter table public.lessons
  add column if not exists consumed_package_id uuid references public.student_packages(id) on delete set null;

create index if not exists lessons_consumed_package_id_idx
  on public.lessons (consumed_package_id);

alter table public.students
  add column if not exists interest_package text;

comment on column public.students.interest_package is
  'pack_4_home | single_studio | single_home | single_online';
