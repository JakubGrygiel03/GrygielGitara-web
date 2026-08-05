-- Digital shop: catalog + ownership after Stripe payment

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  slug text not null unique,
  title text not null,
  short_description text not null default '',
  description text not null default '',
  price_grosze integer not null check (price_grosze >= 0),
  currency text not null default 'pln',
  badge text not null default 'E-book',
  image_path text not null,
  file_path text not null,
  published boolean not null default true,
  coming_soon boolean not null default false
);

create table if not exists public.user_entitlements (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  stripe_checkout_session_id text unique,
  source text not null default 'stripe',
  unique (user_id, product_id)
);

create index if not exists user_entitlements_user_id_idx
  on public.user_entitlements (user_id);

alter table public.products enable row level security;
alter table public.user_entitlements enable row level security;

grant select on table public.products to anon, authenticated;
grant select on table public.user_entitlements to authenticated;

drop policy if exists "Anyone can read published products" on public.products;
create policy "Anyone can read published products"
  on public.products
  for select
  to anon, authenticated
  using (published = true);

drop policy if exists "Users read own entitlements" on public.user_entitlements;
create policy "Users read own entitlements"
  on public.user_entitlements
  for select
  to authenticated
  using (user_id = auth.uid());

-- Seed showcase products (idempotent by slug)
insert into public.products (
  slug, title, short_description, description, price_grosze, badge,
  image_path, file_path, published, coming_soon
) values
  (
    'start-z-gitara-bez-stresu',
    'Start z gitarą bez stresu',
    'Pierwsze tygodnie gry: postawa, strojenie i proste melodie bez szkolnego rygoru.',
    'Praktyczny e-book na start. Po zakupie PDF dostępny w koncie i na e-mailu.',
    4900,
    'E-book',
    '/images/shop/ebook-start-cover.svg',
    'products/start-z-gitara-bez-stresu.pdf',
    true,
    false
  ),
  (
    'setup-gitary-w-domu',
    'Setup gitary w domu',
    'Wymiana strun, czyszczenie i podstawowa regulacja — bez warsztatu.',
    'Krótki przewodnik po opiece nad instrumentem.',
    3900,
    'E-book',
    '/images/shop/ebook-setup-cover.svg',
    'products/setup-gitary-w-domu.pdf',
    true,
    false
  ),
  (
    'rytm-i-timing-na-start',
    'Rytm i timing na start',
    'Ćwiczenia rytmiczne, które słychać — metronom bez frustracji.',
    'Materiał o rytmie i timing dla początkujących.',
    5900,
    'E-book',
    '/images/shop/ebook-rytm-cover.svg',
    'products/rytm-i-timing-na-start.pdf',
    true,
    false
  )
on conflict (slug) do update set
  title = excluded.title,
  short_description = excluded.short_description,
  description = excluded.description,
  price_grosze = excluded.price_grosze,
  badge = excluded.badge,
  image_path = excluded.image_path,
  file_path = excluded.file_path,
  published = excluded.published,
  coming_soon = excluded.coming_soon;
