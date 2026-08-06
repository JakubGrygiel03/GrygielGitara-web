-- Audit log: consent to immediate digital delivery + loss of withdrawal (art. 38 pkt 13)
-- Run in Supabase SQL Editor before relying on shop checkout in production.

create table if not exists public.shop_digital_consents (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  email text,
  immediate_delivery_consent boolean not null default true,
  regulamin_accepted boolean not null default true,
  consent_text text not null,
  stripe_checkout_session_id text,
  source text not null default 'checkout_start'
);

create index if not exists shop_digital_consents_user_id_idx
  on public.shop_digital_consents (user_id);

create index if not exists shop_digital_consents_created_at_idx
  on public.shop_digital_consents (created_at desc);

alter table public.shop_digital_consents enable row level security;

grant select on table public.shop_digital_consents to authenticated;
grant all on table public.shop_digital_consents to service_role;

drop policy if exists "Users read own shop consents" on public.shop_digital_consents;
create policy "Users read own shop consents"
  on public.shop_digital_consents
  for select
  to authenticated
  using (user_id = auth.uid());
