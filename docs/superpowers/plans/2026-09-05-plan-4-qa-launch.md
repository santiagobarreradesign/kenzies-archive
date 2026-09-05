# Plan 4 — QA, Seed, and Launch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pass spec §17, seed a living empty-state, and put a production URL in someone's hand.

**Architecture:** Same production Supabase + Vercel project from Plans 1–3. QA happens against production policies, not only `npm run dev`.

**Tech Stack:** Existing app, Supabase MCP (`execute_sql`, `get_advisors`), Vercel production deploy

---

## File map

- `src/lib/seed.ts` or SQL seed via `execute_sql`
- `src/components/admin/ModerationBar.tsx` (admin hide)
- Browser verification notes in this file after the pass

### Task 1: Functional + security QA

- [ ] Visitor can enlist without an account
- [ ] Builder combinations do not clip
- [ ] Insert errors are recoverable
- [ ] New recruit appears without refresh
- [ ] Dossier deep links work; hidden recruits 404
- [ ] Visitor cannot PATCH commander fields
- [ ] Messages render as text
- [ ] `get_advisors` clean
- [ ] No service-role key in client env

### Task 2: Responsive + accessibility

- [ ] Builder usable at 320–390px
- [ ] Tap targets ≥ 44px
- [ ] No hover-only interactions
- [ ] `prefers-reduced-motion` respected
- [ ] Forms and dossiers keyboard accessible
- [ ] Army roster fallback on small screens

### Task 3: Seed + spam + moderation

- [ ] Insert 3–5 seed recruits so HQ/army never look empty
- [ ] Honeypot + min fill-time enforced on submit
- [ ] Admin can set `is_visible = false`
- [ ] Export/backup query documented

### Task 4: Production launch

- [ ] `vercel --prod` or git-connected production deploy
- [ ] Confirm env vars on production
- [ ] Pre-reveal: friends first, then Kenzie
- [ ] Optional custom domain later (out of required path)

**Done when:** Spec §17 checklist is verified on the production URL.
