-- Preferred lesson location per student (suggested in calendar form)

alter table public.students
  add column if not exists default_location text;
