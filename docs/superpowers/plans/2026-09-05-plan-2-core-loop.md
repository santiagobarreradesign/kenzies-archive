# Plan 2 — Core Loop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A friend can build a pickle, write a transmission, enlist it, see it in the army, and open its dossier by URL.

**Architecture:** `/recruit` composes catalog options into a recruit payload, inserts whitelist columns through supabase-js, then routes to `/army` highlighting the new id. `/army` fetches visible recruits into deterministic formation slots. `/recruit/:id` is a deep-linkable dossier that renders the message as text.

**Tech Stack:** Same as Plan 1, plus `useRecruits` and enlistment ceremony motion.

---

## File map

- `src/pages/Recruit.tsx`
- `src/components/builder/PickleCustomizer.tsx`
- `src/components/builder/RecruitForm.tsx`
- `src/components/builder/EnlistmentCeremony.tsx`
- `src/pages/Army.tsx`
- `src/components/army/ArmyField.tsx`
- `src/components/army/ArmyRecruit.tsx`
- `src/components/army/ArmyListFallback.tsx`
- `src/pages/RecruitDossier.tsx`
- `src/components/dossier/DossierCard.tsx`
- `src/hooks/useRecruits.ts`
- `src/lib/stats.ts`
- `src/lib/formation.ts`
- `src/lib/validation.ts`

### Task 1: Builder + form

- [ ] Live `<Pickle />` preview while cycling body/eyes/mouth/hat/accessory/color/effect
- [ ] Form fields: creator_name (40), pickle_name (40), division (enum), battle_cry (80), message (800)
- [ ] Client validation matching DB check constraints
- [ ] Honeypot field + minimum 4s fill-time (spam, used fully in Plan 4)

### Task 2: Enlist + persist

- [ ] Ceremony: recruit at attention, ENLISTED stamp, name announcement
- [ ] INSERT only whitelist columns; ignore commander fields
- [ ] Recoverable error state if insert fails
- [ ] Navigate to `/army?enlisted=:id`

### Task 3: Army formation

- [ ] `useRecruits` selects visible rows ordered by `created_at`
- [ ] Deterministic slots from recruit id (hash → row/col + small offset)
- [ ] Click/tap opens `/recruit/:id`
- [ ] List/grid fallback under 700px or via “Roster” toggle

### Task 4: Dossier

- [ ] Large pickle, division, enlisted by, battle cry
- [ ] Generated stats (Loyalty, Chaos, Brine, Bravery) from id + division
- [ ] Transmission rendered as text, never `dangerouslySetInnerHTML`
- [ ] Medal / favorite / title placeholders (populated in Plan 3)
- [ ] 404-style empty state for missing or hidden recruits

**Done when:** Create → Save → Appear → Click → Read works against production Supabase RLS on a Vercel preview.
