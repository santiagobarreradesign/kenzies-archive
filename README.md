# Kenzie's Pickle Army

A collaborative birthday world. Friends enlist pickle recruits. Kenzie commands the army.

## Stack

- React + Vite + React Router
- Supabase Postgres, Auth, Realtime, RLS
- Vercel hosting

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
