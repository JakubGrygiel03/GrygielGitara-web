-- =============================================================================
-- TYLKO portal ucznia — kolumna students.user_id + odświeżenie API
-- Supabase → SQL Editor → wklej → Run
-- Potem w wyniku zapytania kontrolnego musisz zobaczyć: user_id | uuid
-- =============================================================================

alter table public.students
  add column if not exists user_id uuid;

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

create index if not exists students_user_id_idx on public.students (user_id);
create index if not exists students_email_lower_idx on public.students (lower(email));

alter table public.students enable row level security;

grant all on table public.students to service_role;
grant select on table public.students to authenticated;

drop policy if exists "Students read own profile" on public.students;
create policy "Students read own profile"
  on public.students
  for select
  to authenticated
  using (user_id = auth.uid());

-- Odśwież cache PostgREST (żeby API od razu widziało kolumnę)
notify pgrst, 'reload schema';

-- KONTROLA — w Results powinno być wiersz: user_id | uuid
select column_name, data_type
from information_schema.columns
where table_schema = 'public'
  and table_name = 'students'
  and column_name = 'user_id';
