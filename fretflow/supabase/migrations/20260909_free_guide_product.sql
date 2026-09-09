-- Catalog row so Gitarowy Reset can sit in Konto → Zakupy (0 zł, not sold via Stripe).

insert into public.products (
  slug,
  title,
  short_description,
  description,
  price_grosze,
  badge,
  image_path,
  file_path,
  published,
  coming_soon,
  early_bird_open
)
values (
  'gitarowy-reset',
  'Gitarowy Reset',
  'Darmowy PDF na start (101 stron): ściana akordów, dłonie, sprzęt i nawyki.',
  'Nieodpłatny e-book. Po zostawieniu e-maila PDF jest na skrzynce i — gdy masz konto na ten sam adres — w Konto → Zakupy.',
  0,
  'PDF gratis',
  '/images/shop/ebook-gitarowy-reset-cover.png',
  'products/gitarowy-reset.pdf',
  true,
  false,
  false
)
on conflict (slug) do update
set
  title = excluded.title,
  short_description = excluded.short_description,
  description = excluded.description,
  price_grosze = excluded.price_grosze,
  badge = excluded.badge,
  image_path = excluded.image_path,
  file_path = excluded.file_path,
  published = true,
  coming_soon = false,
  early_bird_open = false;
