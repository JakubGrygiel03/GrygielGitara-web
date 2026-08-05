-- Track whether a lesson consumed one credit from a student package

alter table public.lessons
  add column if not exists package_consumed boolean default false not null;

alter table public.lessons
  add column if not exists consumed_package_id uuid references public.student_packages(id) on delete set null;

create index if not exists lessons_consumed_package_id_idx
  on public.lessons (consumed_package_id);
