-- Which pricing option the student chose / prefers

alter table public.students
  add column if not exists interest_package text;

comment on column public.students.interest_package is
  'pack_4_home | single_studio | single_home | single_online';
