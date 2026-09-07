create schema if not exists private;

create table if not exists public.stamps (
  id uuid primary key default gen_random_uuid(),
  number int unique,
  slug text not null unique,
  creator_name text not null,
  creator_location text,
  message text not null,
  template text not null,
  denomination text not null,
  composition_json jsonb not null,
  preview_path text,
  source_photo_path text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'hidden')),
  created_at timestamptz not null default now(),
  approved_at timestamptz,
  opened_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists public.site_state (
  id int primary key default 1,
  birthday_mode boolean not null default false,
  updated_at timestamptz not null default now()
);

insert into public.site_state (id, birthday_mode)
values (1, false)
on conflict (id) do nothing;

create index if not exists stamps_status_idx on public.stamps (status);
create index if not exists stamps_number_idx on public.stamps (number);

alter table public.stamps enable row level security;
alter table public.site_state enable row level security;

create policy "Public can read approved stamps"
on public.stamps
for select
to anon, authenticated
using (status = 'approved');

create policy "Public can read site state"
on public.site_state
for select
to anon, authenticated
using (true);

create policy "Authenticated admins can read all stamps"
on public.stamps
for select
to authenticated
using (true);

insert into storage.buckets (id, name, public)
values
  ('stamp-originals', 'stamp-originals', false),
  ('stamp-submissions', 'stamp-submissions', false),
  ('stamps', 'stamps', true)
on conflict (id) do nothing;

create policy "Public can read approved stamp images"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'stamps');
