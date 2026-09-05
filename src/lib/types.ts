import type { Database } from './database.types'

export type Recruit = Database['public']['Tables']['recruits']['Row']
export type RecruitInsert = Database['public']['Tables']['recruits']['Insert']
export type SiteState = Database['public']['Tables']['site_state']['Row']
export type OfficerRole = 'commander' | 'admin' | null

export type BodyId = 'tall' | 'stubby' | 'chunky' | 'tiny' | 'curved'
export type EyesId = 'normal' | 'sparkle' | 'angry' | 'sleepy' | 'blank' | 'wink' | 'heart' | 'dizzy'
export type MouthId = 'smile' | 'smug' | 'scream' | 'tiny' | 'frown' | 'tongue'
export type HatId = 'none' | 'cowboy' | 'crown' | 'party' | 'wizard' | 'helmet' | 'bow' | 'beret' | 'chef' | 'sailor'
export type AccessoryId = 'none' | 'sword' | 'cake' | 'flowers' | 'shield' | 'wand' | 'purse' | 'flag' | 'balloon' | 'spoon'
export type ColorId = 'classic' | 'light' | 'dark' | 'spicy' | 'pastel'
export type EffectId = 'none' | 'sparkles' | 'aura' | 'hearts'
export type MedalId =
  | 'distinguished_bravery'
  | 'best_dressed'
  | 'maximum_chaos'
  | 'commanders_favorite'
  | 'exceptional_service'
  | 'defender_of_cake'
  | 'deeply_concerning'

export type DivisionId =
  | 'royal_brine_guard'
  | 'emotional_support'
  | 'cake_protection'
  | 'chaos'
  | 'party_operations'
  | 'snack_battalion'
  | 'magical_forces'
  | 'special_pickle_unit'

export type Appearance = {
  body: BodyId
  eyes: EyesId
  mouth: MouthId
  hat: HatId
  accessory: AccessoryId
  color: ColorId
  effect: EffectId
}

export type IdleAction = 'idle' | 'salute' | 'wave' | 'tip'
