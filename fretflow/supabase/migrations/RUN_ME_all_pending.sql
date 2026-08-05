-- =============================================================================
-- GrygielGitara — BEZPIECZNY SQL (idempotentny)
-- Supabase → SQL Editor → New query → wklej CAŁY plik → Run
--
-- Co robi:
--   • tworzy brakujące tabele / kolumny / indeksy
--   • dopina granty i polityki RLS (drop + create policy)
--   • seeduje 3 e-booki tylko jeśli slug jeszcze nie istnieje
--
-- Czego NIE robi:
--   • nie kasuje tabel ani wierszy
--   • nie nadpisuje Twoich uczniów, lekcji, ustawień admina
--   • nie nadpisuje tytułów/cen e-booków, jeśli już istnieją (tylko dopina brakujące)
-- =============================================================================

create extension if not exists "pgcrypto";

-- ========== Phase 1: kontakt / rezerwacje / newsletter ==========
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

grant usage on schema public to anon, authenticated, service_role;

grant insert on table public.contact_messages to anon, authenticated, service_role;
grant insert on table public.bookings to anon, authenticated, service_role;
grant insert on table public.newsletter_subscribers to anon, authenticated, service_role;

grant select, update, delete on table public.contact_messages to service_role;
grant select, update, delete on table public.bookings to service_role;
grant select, update, delete on table public.newsletter_subscribers to service_role;

-- ========== Uczniowie / lekcje ==========
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

alter table public.students
  add column if not exists default_location text;

alter table public.students
  add column if not exists interest_package text;

alter table public.students
  add column if not exists user_id uuid;

alter table public.lessons
  add column if not exists series_id uuid;

alter table public.lessons
  add column if not exists reminder_sent boolean default false not null;

alter table public.lessons
  add column if not exists payment_status text;

alter table public.lessons
  add column if not exists price numeric(10, 2);

alter table public.lessons
  add column if not exists package_consumed boolean default false not null;

alter table public.bookings
  add column if not exists interest_package text;

-- Default payment_status for existing rows, then constrain safely
update public.lessons
set payment_status = 'unpaid'
where payment_status is null;

alter table public.lessons
  alter column payment_status set default 'unpaid';

do $$
begin
  begin
    alter table public.lessons
      alter column payment_status set not null;
  exception when others then
    null;
  end;

  if not exists (
    select 1 from pg_constraint where conname = 'lessons_payment_status_check'
  ) then
    alter table public.lessons
      add constraint lessons_payment_status_check
      check (payment_status in ('unpaid', 'paid'));
  end if;
end $$;

-- FK user_id → auth.users (tylko jeśli jeszcze nie ma)
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'students_user_id_fkey'
  ) then
    alter table public.students
      add constraint students_user_id_fkey
      foreign key (user_id) references auth.users (id) on delete set null;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'students_user_id_key'
  ) then
    alter table public.students
      add constraint students_user_id_key unique (user_id);
  end if;
end $$;

create index if not exists lessons_starts_at_idx on public.lessons (starts_at);
create index if not exists lessons_student_id_idx on public.lessons (student_id);
create index if not exists lessons_series_id_idx on public.lessons (series_id);
create index if not exists lessons_reminder_sent_idx on public.lessons (reminder_sent, starts_at);
create index if not exists students_user_id_idx on public.students (user_id);
create index if not exists students_email_lower_idx on public.students (lower(email));

alter table public.students enable row level security;
alter table public.lessons enable row level security;

grant all on table public.students to service_role;
grant all on table public.lessons to service_role;

comment on column public.bookings.interest_package is
  'pack_4_home | single_studio | single_home | single_online';
comment on column public.students.interest_package is
  'pack_4_home | single_studio | single_home | single_online';

-- ========== Admin ops ==========
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

-- consumed_package_id requires student_packages to exist
alter table public.lessons
  add column if not exists consumed_package_id uuid;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'lessons_consumed_package_id_fkey'
  ) then
    alter table public.lessons
      add constraint lessons_consumed_package_id_fkey
      foreign key (consumed_package_id)
      references public.student_packages(id)
      on delete set null;
  end if;
end $$;

create index if not exists lessons_consumed_package_id_idx
  on public.lessons (consumed_package_id);

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

-- ========== Portal ucznia (Auth + RLS read-own) ==========
grant select on table public.students to authenticated;
grant select on table public.lessons to authenticated;
grant select on table public.student_materials to authenticated;
grant select on table public.student_packages to authenticated;
grant select on table public.lesson_session_notes to authenticated;

drop policy if exists "Students read own profile" on public.students;
create policy "Students read own profile"
  on public.students
  for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "Students read own lessons" on public.lessons;
create policy "Students read own lessons"
  on public.lessons
  for select
  to authenticated
  using (
    student_id in (
      select id from public.students where user_id = auth.uid()
    )
  );

drop policy if exists "Students read own materials" on public.student_materials;
create policy "Students read own materials"
  on public.student_materials
  for select
  to authenticated
  using (
    student_id in (
      select id from public.students where user_id = auth.uid()
    )
  );

drop policy if exists "Students read own packages" on public.student_packages;
create policy "Students read own packages"
  on public.student_packages
  for select
  to authenticated
  using (
    student_id in (
      select id from public.students where user_id = auth.uid()
    )
  );

drop policy if exists "Students read own session notes" on public.lesson_session_notes;
create policy "Students read own session notes"
  on public.lesson_session_notes
  for select
  to authenticated
  using (
    student_id in (
      select id from public.students where user_id = auth.uid()
    )
  );

-- ========== Sklep (produkty + uprawnienia po Stripe) ==========
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  slug text not null unique,
  title text not null,
  short_description text not null default '',
  description text not null default '',
  price_grosze integer not null check (price_grosze >= 0),
  currency text not null default 'pln',
  badge text not null default 'E-book',
  image_path text not null,
  file_path text not null,
  published boolean not null default true,
  coming_soon boolean not null default false
);

create table if not exists public.user_entitlements (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  stripe_checkout_session_id text unique,
  source text not null default 'stripe',
  unique (user_id, product_id)
);

create index if not exists user_entitlements_user_id_idx
  on public.user_entitlements (user_id);

alter table public.products enable row level security;
alter table public.user_entitlements enable row level security;

grant select on table public.products to anon, authenticated;
grant select on table public.user_entitlements to authenticated;
grant all on table public.products to service_role;
grant all on table public.user_entitlements to service_role;

drop policy if exists "Anyone can read published products" on public.products;
create policy "Anyone can read published products"
  on public.products
  for select
  to anon, authenticated
  using (published = true);

drop policy if exists "Users read own entitlements" on public.user_entitlements;
create policy "Users read own entitlements"
  on public.user_entitlements
  for select
  to authenticated
  using (user_id = auth.uid());

-- Seed tylko brakujących slugów (nie nadpisuje istniejących produktów)
insert into public.products (
  slug, title, short_description, description, price_grosze, badge,
  image_path, file_path, published, coming_soon
) values
  (
    'start-z-gitara-bez-stresu',
    'Start z gitarą bez stresu',
    'Pierwsze tygodnie gry: postawa, strojenie i proste melodie bez szkolnego rygoru.',
    'Praktyczny e-book na start. Po zakupie PDF dostępny w koncie i na e-mailu.',
    4900,
    'E-book',
    '/images/shop/ebook-start-cover.svg',
    'products/start-z-gitara-bez-stresu.pdf',
    true,
    false
  ),
  (
    'setup-gitary-w-domu',
    'Setup gitary w domu',
    'Wymiana strun, czyszczenie i podstawowa regulacja — bez warsztatu.',
    'Krótki przewodnik po opiece nad instrumentem.',
    3900,
    'E-book',
    '/images/shop/ebook-setup-cover.svg',
    'products/setup-gitary-w-domu.pdf',
    true,
    false
  ),
  (
    'rytm-i-timing-na-start',
    'Rytm i timing na start',
    'Ćwiczenia rytmiczne, które słychać — metronom bez frustracji.',
    'Materiał o rytmie i timing dla początkujących.',
    5900,
    'E-book',
    '/images/shop/ebook-rytm-cover.svg',
    'products/rytm-i-timing-na-start.pdf',
    true,
    false
  )
on conflict (slug) do nothing;

-- Jeśli produkt seed był oznaczony „wkrótce”, odblokuj kupno (tylko te 3 slugi)
update public.products
set coming_soon = false, published = true
where slug in (
  'start-z-gitara-bez-stresu',
  'setup-gitary-w-domu',
  'rytm-i-timing-na-start'
)
and (coming_soon = true or published = false);

-- Odśwież cache PostgREST (API od razu widzi nowe kolumny)
notify pgrst, 'reload schema';

-- =============================================================================
-- Gotowe. Odśwież /admin i /sklep.
-- =============================================================================
