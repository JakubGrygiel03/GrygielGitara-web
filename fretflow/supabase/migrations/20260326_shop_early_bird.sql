-- Per-product early-bird waitlist (−30% locked at signup time).
-- Turn early_bird_open off when a title goes on full sale / is only a concept for feedback.

alter table public.products
  add column if not exists early_bird_open boolean not null default false;

-- Current catalog titles: waitlist open until you flip this off at premiere.
update public.products
set early_bird_open = true
where slug in (
  'start-z-gitara-bez-stresu',
  'setup-gitary-w-domu',
  'start-bez-stresu-feedback-vip'
);

create table if not exists public.shop_early_bird_signups (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  email text not null,
  phone text,
  product_slug text not null,
  product_title text not null,
  -- Frozen at signup — future products / closed offers won't change this row
  discount_percent integer not null check (discount_percent > 0 and discount_percent <= 100),
  claim_token text not null unique default encode(gen_random_bytes(16), 'hex'),
  status text not null default 'waiting'
    check (status in ('waiting', 'notified', 'redeemed', 'cancelled')),
  note text,
  unique (email, product_slug)
);

create index if not exists shop_early_bird_signups_product_slug_idx
  on public.shop_early_bird_signups (product_slug);

create index if not exists shop_early_bird_signups_created_at_idx
  on public.shop_early_bird_signups (created_at desc);

alter table public.shop_early_bird_signups enable row level security;

grant insert on table public.shop_early_bird_signups to anon, authenticated;
grant select on table public.shop_early_bird_signups to authenticated;

drop policy if exists "Anyone can join early bird waitlist" on public.shop_early_bird_signups;
create policy "Anyone can join early bird waitlist"
  on public.shop_early_bird_signups
  for insert
  to anon, authenticated
  with check (true);

-- No public select — admin uses service role
drop policy if exists "No public read early bird" on public.shop_early_bird_signups;
