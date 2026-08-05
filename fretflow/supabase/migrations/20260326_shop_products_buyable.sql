-- Quick fix: make seeded shop products buyable
update public.products
set coming_soon = false, published = true
where slug in (
  'start-z-gitara-bez-stresu',
  'setup-gitary-w-domu',
  'rytm-i-timing-na-start'
);
