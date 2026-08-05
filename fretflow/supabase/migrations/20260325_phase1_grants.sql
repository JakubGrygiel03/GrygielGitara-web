-- Required when "Automatically expose new tables" is disabled in Supabase.
-- Grants Data API roles permission to use Phase 1 public tables.

grant usage on schema public to anon, authenticated, service_role;

grant insert on table public.contact_messages to anon, authenticated, service_role;
grant insert on table public.bookings to anon, authenticated, service_role;
grant insert on table public.newsletter_subscribers to anon, authenticated, service_role;

-- Admin / Server Actions use the service role key (bypasses RLS, still needs grants).
grant select, update, delete on table public.contact_messages to service_role;
grant select, update, delete on table public.bookings to service_role;
grant select, update, delete on table public.newsletter_subscribers to service_role;
