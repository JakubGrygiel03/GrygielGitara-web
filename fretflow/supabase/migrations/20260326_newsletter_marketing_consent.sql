-- Marketing consent for free lead magnet (newsletter_subscribers)

alter table public.newsletter_subscribers
  add column if not exists marketing_consent boolean not null default false;

alter table public.newsletter_subscribers
  add column if not exists marketing_consent_text text;

alter table public.newsletter_subscribers
  add column if not exists marketing_consent_at timestamptz;

notify pgrst, 'reload schema';
