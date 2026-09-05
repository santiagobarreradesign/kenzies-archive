# Kenzie's Pickle Army

A collaborative birthday world. Friends enlist pickle recruits. Kenzie commands the army.

## Stack

- React + Vite + React Router
- Supabase Postgres, Auth, Realtime, RLS
- Vercel hosting

## Production (Vercel)

The GitHub repo is https://github.com/santiagobarreradesign/kenzie-pickle-army

Import that repository at https://vercel.com/new. Vite is auto-detected. The committed `.env` already contains the public Supabase URL and anon key, so the first Git-connected deploy should build.

Local plugin deploys could create the Vercel project but could not attach the GitHub repo (the Vercel Git integration still needs to be authorized in the dashboard).

## Local setup

1. Copy `.env.example` to `.env.local` and add:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

2. `npm install`
3. `npm run dev`

## Commander / admin promotion

After the person signs in once on `/commander`, add their email:

```sql
insert into public.authorized_officers (email, role)
values ('kenzie@example.com', 'commander')
on conflict (email) do update set role = excluded.role;
```

Use `admin` for the operator who can hide recruits.

## Routes

- `/` Headquarters
- `/recruit` Enlist a recruit
- `/army` Parade grounds
- `/recruit/:id` Dossier
- `/commander` Commander access
- `/dev/matrix` Asset alignment grid
