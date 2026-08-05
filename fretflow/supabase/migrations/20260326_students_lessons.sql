-- Students + scheduled lessons for admin calendar

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

-- No public policies — admin uses service_role only.

grant usage on schema public to service_role;
grant all on table public.students to service_role;
grant all on table public.lessons to service_role;
