-- Clarify Start e-book short copy (customer-facing).
update public.products
set
  short_description =
    'Pierwsze tygodnie gry w jednym handbooku (ok. 40 stron + wideo): postawa, strojenie, melodie i plan 15 minut dziennie.',
  description =
    'Kompletny e-book na start. Po zakupie PDF w koncie i na e-mailu.'
where slug = 'start-z-gitara-bez-stresu';
