-- Public bucket for the free 37 MB PDF (Gitarowy Reset).
-- Do not put this file in git or e-mail attachments.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'free-guides',
  'free-guides',
  true,
  52428800,
  array['application/pdf']::text[]
)
on conflict (id) do update
set
  public = true,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public read free-guides" on storage.objects;
create policy "Public read free-guides"
on storage.objects
for select
to public
using (bucket_id = 'free-guides');
