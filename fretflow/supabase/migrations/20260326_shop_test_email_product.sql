-- Cheap test product to verify Stripe → Resend purchase e-mail (Setup clone)

insert into public.products (
  slug, title, short_description, description, price_grosze, badge,
  image_path, file_path, published, coming_soon
) values (
  'test-emaila-zakupu',
  'Test e-maila: Setup gitary',
  '1 zł w Stripe Test — ten sam mail i PDF co Setup, żeby sprawdzić skrzynkę.',
  'Produkt testowy. Po teście możesz ustawić published = false.',
  100,
  'Test',
  '/images/shop/ebook-setup-cover.svg',
  'products/test-emaila-zakupu.pdf',
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
  published = true,
  coming_soon = false;
