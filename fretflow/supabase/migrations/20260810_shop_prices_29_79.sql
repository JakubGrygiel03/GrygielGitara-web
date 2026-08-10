-- Restore catalog list prices: Setup 29 zł, Start 79 zł (VIP unchanged).

update public.products
set price_grosze = 2900
where slug = 'setup-gitary-w-domu';

update public.products
set price_grosze = 7900
where slug = 'start-z-gitara-bez-stresu';

notify pgrst, 'reload schema';
