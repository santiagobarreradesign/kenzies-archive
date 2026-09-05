import type { DivisionId } from './types'

export const GENERIC_LINES = [
  'LONG LIVE KENZIE!',
  'FOR BRINE AND GLORY!',
  'PROTECT THE CAKE!',
  'KENZIE! KENZIE! KENZIE!',
  'NO PICKLE LEFT BEHIND!',
  'COMMANDER APPROACHING!',
  'BRINE LEVELS NOMINAL!',
  'BIRTHDAY FORMATION!',
]

export const DIVISION_LINES: Record<DivisionId, string[]> = {
  royal_brine_guard: ['FOR THE COMMANDER.', 'HOLD FORMATION.'],
  emotional_support: ['EVERYBODY IS DOING GREAT.', 'MORALE UP!'],
  cake_protection: ['THE CAKE IS SECURE.', 'PERIMETER CLEAR.'],
  chaos: ['WHO GAVE ME A SWORD?', 'EVERYTHING IS FINE!'],
  party_operations: ['VIBES CONFIRMED.', 'CONFETTI READY.'],
  snack_battalion: ['RATIONS ACCOUNTED FOR.', 'DO NOT EAT THE CAKE.'],
  magical_forces: ['SPELLS ARE... PROBABLY FINE.', 'SPARKLES ENGAGED.'],
  special_pickle_unit: ['THAT IS CLASSIFIED.', 'YOU DID NOT SEE THIS.'],
}

export function lineForDivision(division: string) {
  const specific = DIVISION_LINES[division as DivisionId]
  const pool = Math.random() < 0.45 && specific ? specific : GENERIC_LINES
  return pool[Math.floor(Math.random() * pool.length)] ?? GENERIC_LINES[0]
}
