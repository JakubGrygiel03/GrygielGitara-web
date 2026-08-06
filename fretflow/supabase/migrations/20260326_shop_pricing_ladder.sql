-- Price ladder: entry 19 → bestseller 59 (anchor 79) → VIP 119
-- Replaces "Rytm i timing" in the public catalog with Feedback VIP package.

update public.products
set
  title = 'Setup i dbanie o gitarę w domu',
  short_description = 'Wymiana strun, czyszczenie i podstawowa regulacja — konkret lutniczy bez warsztatu. Kwota jak za kawę — bez długiego namysłu.',
  description = 'Poradnik domowej opieki nad gitarą. Po zakupie PDF w koncie i na e-mailu.',
  price_grosze = 1900,
  badge = 'E-book',
  published = true,
  coming_soon = false,
  early_bird_open = true
where slug = 'setup-gitary-w-domu';

update public.products
set
  title = 'Start z gitarą bez stresu',
  short_description = 'Pierwsze tygodnie gry w jednym handbooku (ok. 40 stron + wideo): postawa, strojenie, melodie i plan 15 minut dziennie — gotowy plan zamiast chaosu w internecie.',
  description = 'Praktyczny e-book na start. Po zakupie PDF dostępny w koncie i na e-mailu.',
  price_grosze = 5900,
  badge = 'E-book',
  published = true,
  coming_soon = false,
  early_bird_open = true
where slug = 'start-z-gitara-bez-stresu';

update public.products
set
  published = false,
  coming_soon = true,
  early_bird_open = false
where slug = 'rytm-i-timing-na-start';

insert into public.products (
  slug, title, short_description, description, price_grosze, badge,
  image_path, file_path, published, coming_soon, early_bird_open
) values (
  'start-bez-stresu-feedback-vip',
  'Start bez stresu + Feedback VIP',
  'E-book „Start z gitarą bez stresu” plus moja analiza wideo Twojej postawy i ułożenia dłoni — personalny komentarz w przystępnej cenie.',
  'Pakiet: handbook PDF + Feedback VIP (analiza nagrania). Po zakupie e-book w koncie / na e-mailu; instrukcję feedbacku wysyłam osobno.',
  11900,
  'Pakiet',
  '/images/shop/ebook-start-cover.svg',
  'products/start-z-gitara-bez-stresu.pdf',
  true,
  false,
  true
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
  coming_soon = excluded.coming_soon,
  early_bird_open = excluded.early_bird_open;

notify pgrst, 'reload schema';
