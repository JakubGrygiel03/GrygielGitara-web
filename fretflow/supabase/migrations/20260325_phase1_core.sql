-- Phase 1: public lead + booking tables (contact, newsletter, bookings)
-- Run in Supabase SQL Editor or via `supabase db push`

create extension if not exists "pgcrypto";

-- Contact Form Messages
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

-- Lesson Bookings & Student Consultation Requests
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

-- Email Leads / Newsletter List
create table if not exists public.newsletter_subscribers (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  email text unique not null,
  source text default 'tuning_pdf_lead_magnet'
);

-- Keep bookings.updated_at fresh on every update
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

-- Row Level Security
alter table public.contact_messages enable row level security;
alter table public.bookings enable row level security;
alter table public.newsletter_subscribers enable row level security;

-- Public can submit; only service role / authenticated admin will read later
drop policy if exists "Allow public to insert contact messages" on public.contact_messages;
create policy "Allow public to insert contact messages"
  on public.contact_messages
  for insert
  with check (true);

drop policy if exists "Allow public to insert bookings" on public.bookings;
create policy "Allow public to insert bookings"
  on public.bookings
  for insert
  with check (true);

-- No public SELECT/UPDATE on bookings: tokens + PII stay private.
-- Tokenized booking pages will read/update via Server Actions + service role.

drop policy if exists "Allow public to subscribe to newsletter" on public.newsletter_subscribers;
create policy "Allow public to subscribe to newsletter"
  on public.newsletter_subscribers
  for insert
  with check (true);
