import { DIVISIONS } from './divisions'
import type { Appearance, RecruitInsert } from './types'
import { ACCESSORIES, BODIES, COLORS, EFFECTS, EYES, HATS, MOUTHS } from '../components/pickle/catalog'

export const LIMITS = {
  creator_name: 40,
  pickle_name: 40,
  battle_cry: 80,
  message: 800,
  commander_title: 60,
}

export function trimField(value: string, max: number) {
  return value.trim().slice(0, max)
}

export function isAppearance(value: Appearance) {
  return (
    BODIES.some((item) => item.id === value.body) &&
    EYES.some((item) => item.id === value.eyes) &&
    MOUTHS.some((item) => item.id === value.mouth) &&
    HATS.some((item) => item.id === value.hat) &&
    ACCESSORIES.some((item) => item.id === value.accessory) &&
    COLORS.some((item) => item.id === value.color) &&
    EFFECTS.some((item) => item.id === value.effect)
  )
}

export function buildRecruitInsert(input: {
  appearance: Appearance
  creatorName: string
  pickleName: string
  division: string
  battleCry: string
  message: string
}): { ok: true; data: RecruitInsert } | { ok: false; error: string } {
  const creator_name = trimField(input.creatorName, LIMITS.creator_name)
  const pickle_name = trimField(input.pickleName, LIMITS.pickle_name)
  const battle_cry = trimField(input.battleCry, LIMITS.battle_cry)
  const message = trimField(input.message, LIMITS.message)

  if (!isAppearance(input.appearance)) return { ok: false, error: 'That pickle configuration is not authorized.' }
  if (!creator_name) return { ok: false, error: 'The army needs to know who enlisted this recruit.' }
  if (!pickle_name) return { ok: false, error: 'Every recruit requires a name.' }
  if (!DIVISIONS.some((d) => d.id === input.division)) return { ok: false, error: 'Choose a valid division.' }
  if (!battle_cry) return { ok: false, error: 'A battle cry is required. Even a quiet one.' }
  if (!message) return { ok: false, error: 'The transmission for Commander Kenzie cannot be empty.' }

  return {
    ok: true,
    data: {
      creator_name,
      pickle_name,
      body: input.appearance.body,
      eyes: input.appearance.eyes,
      mouth: input.appearance.mouth,
      hat: input.appearance.hat === 'none' ? null : input.appearance.hat,
      accessory: input.appearance.accessory === 'none' ? null : input.appearance.accessory,
      color: input.appearance.color,
      effect: input.appearance.effect === 'none' ? null : input.appearance.effect,
      division: input.division,
      battle_cry,
      message,
    },
  }
}
