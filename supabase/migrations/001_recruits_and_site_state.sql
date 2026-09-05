-- Live schema for kenzie-pickle-army. Applied through Supabase MCP.

create schema if not exists private;

create table if not exists public.recruits (
  id uuid primary key default gen_random_uuid(),
  creator_name text not null,
  pickle_name text not null,
  body text not null,
  eyes text not null,
  mouth text not null,
  hat text,
  accessory text,
  color text not null,
  effect text,
  division text not null,
  battle_cry text not null,
  message text not null,
  is_visible boolean not null default true,
  favorite_by_kenzie boolean not null default false,
  commander_title text,
  medal text,
  viewed_by_kenzie boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_state (
  id int primary key default 1,
  commander_has_arrived boolean not null default false,
  parade_triggered boolean not null default false,
  birthday_mode boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists public.authorized_officers (
  email text primary key,
  role text not null,
  created_at timestamptz not null default now()
);

alter table public.recruits enable row level security;
alter table public.site_state enable row level security;
alter table public.authorized_officers enable row level security;
