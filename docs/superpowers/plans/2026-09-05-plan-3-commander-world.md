# Plan 3 — Living World + Commander + Parade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The army feels inhabited in realtime, and only authenticated Commander Kenzie can promote recruits and trigger the birthday parade.

**Architecture:** Realtime postgres changes stream new inserts into `useRecruits`. A dialogue scheduler shows one speech bubble at a time. Commander identity is Supabase Auth + `app_metadata.role`. Parade state lives on the single-row `site_state` table.

**Tech Stack:** Supabase Realtime + Auth, Framer Motion, existing React app

---

## File map

- `src/hooks/useRealtimeRecruits.ts`
- `src/hooks/useArmyDialogue.ts`
- `src/hooks/useCommander.ts`
- `src/hooks/useRecruitActions.ts`
- `src/hooks/useSiteState.ts`
- `src/lib/dialogue.ts`
- `src/components/army/SpeechBubble.tsx`
- `src/components/army/ReinforcementBanner.tsx`
- `src/pages/Commander.tsx`
- `src/components/commander/ArrivalSequence.tsx`
- `src/components/commander/CommanderControls.tsx`
- `src/components/commander/MedalPicker.tsx`
- `src/components/commander/BirthdayParade.tsx`

### Task 1: Realtime reinforcements

- [ ] Subscribe to `recruits` INSERT
- [ ] Banner: NEW REINFORCEMENTS HAVE ARRIVED
- [ ] Animate the new recruit into its formation slot
- [ ] Unsubscribe on unmount

### Task 2: Ambient behavior + dialogue

- [ ] CSS breathe / blink / wobble on all recruits
- [ ] Rotate richer actions (salute, wave, tip-over) across at most 4 visible recruits
- [ ] Scheduler: every 4–7s pick one visible recruit, show generic or division line for ~2.5s
- [ ] Lines from spec §10; `prefers-reduced-motion` disables rich motion

### Task 3: Commander auth

- [ ] `/commander` magic-link / OTP via `supabase.auth.signInWithOtp`
- [ ] `useCommander` reads session and `app_metadata.role`
- [ ] First arrival: takeover copy, army reveal, LONG LIVE KENZIE chant
- [ ] Set `site_state.commander_has_arrived` once
- [ ] Document how to set `app_metadata.role` to `commander` / `admin` after first login

### Task 4: Commander powers

- [ ] Favorite, medal (7 options from spec), honorary title, viewed
- [ ] RLS UPDATE only those columns for commander; admin can also hide
- [ ] Public dossier shows medal / title / Commander's Favorite afterward

### Task 5: Birthday parade

- [ ] Only commander/admin can set `parade_triggered`
- [ ] Sequence: attention → formation → march → chants → confetti → HAPPY BIRTHDAY, COMMANDER
- [ ] Restartable (toggle flag back and replay)
- [ ] Framer Motion only (no GSAP in v1)

**Blocked on:** Kenzie's email and the operator admin email for Auth user + `app_metadata`. If unknown at implement time, ship the login UI and a SQL snippet to promote the first authenticated user.

**Done when:** A second browser sees a new recruit without refresh; a visitor cannot write commander fields; parade runs and can restart.
