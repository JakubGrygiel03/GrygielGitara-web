-- Link students to Supabase Auth + RLS so pupils can read own lessons & materials

alter table public.students
  add column if not exists user_id uuid unique references auth.users (id) on delete set null;

create index if not exists students_user_id_idx on public.students (user_id);
create index if not exists students_email_lower_idx on public.students (lower(email));

-- Authenticated students: read own profile / lessons / materials
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
