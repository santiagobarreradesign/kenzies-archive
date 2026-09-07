# Kenzie's Archive

A collaborative digital stamp archive — a birthday gift made by many hands.

Friends design a commemorative stamp, write something Kenzie can keep on the back, and the growing collection becomes her present. Each issue is numbered, signed, and postmarked by a tiny postal service dedicated exclusively to her.

**Before the birthday:** artwork is visible; personal messages stay sealed.  
**On the birthday:** the archive unseals and every message can be read.

## What it is

Kenzie’s Archive is a postal-themed web app where guests create one piece of commemorative postage:

1. **Choose paper** — pick a stamp shape and template
2. **Design the front** — composition, color, optional photo crop
3. **Write the back** — a short message sealed until the reveal
4. **Post it** — the stamp is filed into the public archive with a unique slug

The homepage is a binder-style archive of every approved stamp. Opening a stamp flips between the collectible front and the sealed (or revealed) message on the back.

## Features

- Guided create flow with live stamp preview
- Photo crop and hue tools for custom fronts
- Numbered issues with unique slugs (`/stamp/[slug]`)
- Messages sealed until `NEXT_PUBLIC_REVEAL_DATE` (or birthday mode)
- Supabase-backed ledger, storage, and moderation
- Admin tools for approving or hiding submissions
- Local fallback when Supabase is not configured (offline demos)

## Stack

| Layer | Choice |
| --- | --- |
| App | Next.js 15 (App Router), TypeScript |
| UI | Medusa UI, Tailwind CSS 3, Motion |
| Canvas | React Konva, react-easy-crop |
| Data | Supabase (Postgres, Storage, RLS) |
| Hosting | Vercel |
| Forms / validation | react-hook-form, Zod |
| Abuse protection | Cloudflare Turnstile (optional) |

## Routes

| Path | Purpose |
| --- | --- |
| `/` | Archive binder |
| `/create` | Choose paper / shape |
| `/create/front` | Stamp front editor |
| `/create/photo` | Photo crop (when used) |
| `/create/message` | Stamp back / message |
| `/create/preview` | Review and post |
| `/stamp/[slug]` | Individual stamp viewer |
| `/about` | Project story |
| `/admin` | Moderation |

## Local setup

1. Copy `.env.example` to `.env.local` and fill in keys
2. Apply `supabase/migrations/001_stamps.sql` in the Supabase SQL editor
3. Confirm storage buckets exist: `stamp-originals`, `stamp-submissions`, `stamps`
4. `npm install`
5. `npm run dev` → [http://localhost:3000](http://localhost:3000)

### Environment

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=          # optional; admin uploads / moderation
TURNSTILE_SITE_KEY=                 # optional
TURNSTILE_SECRET_KEY=               # optional
NEXT_PUBLIC_TURNSTILE_SITE_KEY=     # optional
ADMIN_EMAIL=                        # optional; enables gated admin
NEXT_PUBLIC_REVEAL_DATE=2026-09-12  # unseals messages on this date
```

Without Supabase keys, the app shows founder-issue placeholders and keeps submissions in local browser storage.

## Birthday reveal

Set `NEXT_PUBLIC_REVEAL_DATE` to Kenzie’s birthday. On that day (or when birthday mode is flipped in `site_state`), messages unseal and the homepage presentation changes.

## Deploy

Intended for Vercel + Supabase:

1. Import this repository in Vercel
2. Add the environment variables above
3. Deploy — App Router routes are handled automatically

## License

Private birthday gift project. Not licensed for redistribution unless the author says otherwise.
