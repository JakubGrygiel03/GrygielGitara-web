-- Preferred pricing package selected on /rezerwacja

alter table public.bookings
  add column if not exists interest_package text;

comment on column public.bookings.interest_package is
  'pack_4_home | single_studio | single_home | single_online';
