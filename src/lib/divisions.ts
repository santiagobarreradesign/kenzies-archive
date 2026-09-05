import type { DivisionId } from './types'

export const DIVISIONS: { id: DivisionId; label: string; purpose: string }[] = [
  { id: 'royal_brine_guard', label: 'Royal Brine Guard', purpose: 'Protect Commander Kenzie' },
  { id: 'emotional_support', label: 'Emotional Support Division', purpose: 'Maintain morale' },
  { id: 'cake_protection', label: 'Cake Protection Unit', purpose: 'Secure the cake' },
  { id: 'chaos', label: 'Chaos Division', purpose: 'Responsibilities unclear' },
  { id: 'party_operations', label: 'Party Operations', purpose: 'Responsible for vibes' },
  { id: 'snack_battalion', label: 'Snack Battalion', purpose: 'Critical logistics' },
  { id: 'magical_forces', label: 'Magical Forces', purpose: 'Unlicensed magic' },
  { id: 'special_pickle_unit', label: 'Special Pickle Unit', purpose: 'Classified' },
]

export function divisionLabel(id: string) {
  return DIVISIONS.find((d) => d.id === id)?.label ?? id
}
