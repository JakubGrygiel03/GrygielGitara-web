-- Hide test product from the shop catalog
update public.products
set published = false, coming_soon = true
where slug = 'test-emaila-zakupu';
