# Plan 1 — Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a deployed Vite shell with a reusable layered `<Pickle />`, a live Supabase project, and Vercel hosting.

**Architecture:** Browser SPA talks to Supabase with the publishable/anon key. RLS is the permission layer. Pickle art is composed from React SVG layers on a shared 200x240 canvas so colors can be tokenized.

**Tech Stack:** React 19, Vite, TypeScript, React Router 7, Framer Motion, supabase-js, Supabase Postgres + Auth + Realtime, Vercel, GitHub

---

## File map

- `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`
- `src/main.tsx`, `src/app/App.tsx`, `src/app/router.tsx`
- `src/styles/tokens.css`, `src/styles/global.css`
- `src/pages/Headquarters.tsx`, `src/pages/Recruit.tsx`, `src/pages/Army.tsx`, `src/pages/RecruitDossier.tsx`, `src/pages/Commander.tsx`, `src/pages/AlignmentMatrix.tsx`
- `src/components/layout/SiteChrome.tsx`
- `src/components/pickle/Pickle.tsx`, `src/components/pickle/catalog.ts`, `src/components/pickle/layers/*.tsx`
- `src/lib/supabase.ts`, `src/lib/types.ts`, `src/lib/divisions.ts`
- `.env.example`, `.env.local` (gitignored)
- `supabase/migrations/001_recruits_and_site_state.sql`

### Task 1: Scaffold Vite React TS

- [ ] Create Vite React TypeScript app in the existing workspace without deleting `kenzie_pickle_army_product_concept.md`
- [ ] Install `react-router-dom`, `framer-motion`, `@supabase/supabase-js`
- [ ] Add `.gitignore` covering `node_modules`, `dist`, `.env.local`, `.vercel`
- [ ] Verify `npm run dev` starts

### Task 2: Create Supabase project via plugin

- [ ] `get_cost` for org `apsggcbzccondwhwwlcs` (expected $0/month)
- [ ] `confirm_cost` then `create_project` name `kenzie-pickle-army`, region `us-east-1`
- [ ] Poll `get_project` until ACTIVE
- [ ] `get_project_url` + `get_publishable_keys`
- [ ] Write `.env.example` and `.env.local` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (never commit `.env.local`)

### Task 3: Schema + RLS

- [ ] `apply_migration` for `recruits` and `site_state` with check constraints and RLS
- [ ] Enable Realtime on `recruits`
- [ ] `generate_typescript_types`
- [ ] `get_advisors` and fix critical issues

**recruits columns:** id uuid pk, creator_name, pickle_name, body, eyes, mouth, hat, accessory, color, effect, division, battle_cry, message, is_visible, favorite_by_kenzie, commander_title, medal, viewed_by_kenzie, created_at, updated_at

**RLS:** anon SELECT where `is_visible`; anon INSERT whitelist only; commander/admin UPDATE commander fields; admin can set `is_visible`. Roles live in `app_metadata.role`, never `user_metadata`.

### Task 4: Design system + routes

- [ ] Tokens: green family, warm neutrals, gold accents, stamp/ribbon motifs
- [ ] Routes: `/`, `/recruit`, `/army`, `/recruit/:id`, `/commander`, `/dev/matrix`
- [ ] Headquarters copy from spec §1: JOIN THE ARMY / VIEW THE ARMY / COMMANDER ACCESS
- [ ] Placeholder pages for routes not built until later plans

### Task 5: Layered Pickle + MVP assets

- [ ] Shared canvas 200x240 with anchors for body, eyes, mouth, hat, accessory
- [ ] Catalog: 5 bodies, 8 eyes, 6 mouths, 10 hats, 10 accessories, 5 colors, 4 effects, 7 medals
- [ ] `<Pickle body eyes mouth hat accessory color effect />`
- [ ] `/dev/matrix` alignment grid

### Task 6: GitHub + Vercel

- [ ] Auth Vercel MCP (`mcp_auth`)
- [ ] `git init`, initial commit, GitHub repo via `gh`
- [ ] Create/link Vercel project, add `VITE_` env vars to production/preview/development
- [ ] First preview deploy

**Done when:** Preview URL loads HQ; pickle combinations render; Supabase tables + RLS exist; advisors are clean.
