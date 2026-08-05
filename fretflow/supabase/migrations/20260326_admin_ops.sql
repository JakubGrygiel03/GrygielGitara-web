-- Admin ops: service orders, packages, materials, session notes, payments, settings

-- Lesson payment fields
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

-- Key/value settings (SMS toggle, vacation mode, notify contacts)
create table if not exists public.admin_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Guitar service / setup jobs
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

-- Lesson packages / karnety
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

-- Links / materials under student profile
create table if not exists public.student_materials (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  student_id uuid not null references public.students(id) on delete cascade,
  title text not null,
  url text not null
);

create index if not exists student_materials_student_id_idx
  on public.student_materials (student_id);

-- Short notes after a lesson (progress history)
create table if not exists public.lesson_session_notes (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  student_id uuid not null references public.students(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete set null,
  body text not null
);

create index if not exists lesson_session_notes_student_id_idx
  on public.lesson_session_notes (student_id, created_at desc);

-- Manual revenue rows (shop / extras) for monthly balance
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

-- Defaults (safe if re-run)
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
