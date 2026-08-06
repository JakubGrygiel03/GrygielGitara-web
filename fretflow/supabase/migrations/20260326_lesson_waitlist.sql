-- Private lesson waitlist (when slots are full / concert schedule).

create table if not exists public.lesson_waitlist (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  email text not null,
  phone text,
  note text,
  status text not null default 'waiting'
    check (status in ('waiting', 'contacted', 'booked', 'closed')),
  unique (email)
);

alter table public.lesson_waitlist enable row level security;

grant insert on table public.lesson_waitlist to anon, authenticated, service_role;
grant select, update, delete on table public.lesson_waitlist to service_role;

drop policy if exists "Allow public to join lesson waitlist" on public.lesson_waitlist;
create policy "Allow public to join lesson waitlist"
  on public.lesson_waitlist
  for insert
  to anon, authenticated
  with check (true);

notify pgrst, 'reload schema';
