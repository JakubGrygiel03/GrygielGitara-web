-- Recurring series + day-before reminder flag

alter table public.lessons
  add column if not exists series_id uuid;

alter table public.lessons
  add column if not exists reminder_sent boolean default false not null;

create index if not exists lessons_series_id_idx on public.lessons (series_id);
create index if not exists lessons_reminder_sent_idx on public.lessons (reminder_sent, starts_at);
