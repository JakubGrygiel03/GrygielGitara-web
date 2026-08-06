-- Align admin_settings with business Gmail (optional; CONTACT_TO_EMAIL on Vercel wins anyway)
update public.admin_settings
set value = '"grygielgitara@gmail.com"'::jsonb,
    updated_at = timezone('utc'::text, now())
where key = 'notify_email';

insert into public.admin_settings (key, value)
select 'notify_email', '"grygielgitara@gmail.com"'::jsonb
where not exists (
  select 1 from public.admin_settings where key = 'notify_email'
);
