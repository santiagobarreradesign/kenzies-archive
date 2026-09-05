import type { AccessoryId, BodyId, ColorId, EffectId, EyesId, HatId, MedalId, MouthId } from '../../lib/types'

export const BODIES: { id: BodyId; label: string; headY: number }[] = [
  { id: 'tall', label: 'Tall', headY: 74 },
  { id: 'stubby', label: 'Stubby', headY: 96 },
  { id: 'chunky', label: 'Chunky', headY: 82 },
  { id: 'tiny', label: 'Tiny', headY: 108 },
  { id: 'curved', label: 'Curved', headY: 80 },
]

export const EYES: { id: EyesId; label: string }[] = [
  { id: 'normal', label: 'Normal' },
  { id: 'sparkle', label: 'Sparkle' },
  { id: 'angry', label: 'Angry' },
  { id: 'sleepy', label: 'Sleepy' },
  { id: 'blank', label: 'Blank stare' },
  { id: 'wink', label: 'Wink' },
  { id: 'heart', label: 'Hearts' },
  { id: 'dizzy', label: 'Dizzy' },
]

export const MOUTHS: { id: MouthId; label: string }[] = [
  { id: 'smile', label: 'Smile' },
  { id: 'smug', label: 'Smug' },
  { id: 'scream', label: 'Scream' },
  { id: 'tiny', label: 'Tiny smile' },
  { id: 'frown', label: 'Frown' },
  { id: 'tongue', label: 'Tongue' },
]

export const HATS: { id: HatId; label: string }[] = [
  { id: 'none', label: 'None' },
  { id: 'cowboy', label: 'Cowboy' },
  { id: 'crown', label: 'Crown' },
  { id: 'party', label: 'Party' },
  { id: 'wizard', label: 'Wizard' },
  { id: 'helmet', label: 'Helmet' },
  { id: 'bow', label: 'Bow' },
  { id: 'beret', label: 'Beret' },
  { id: 'chef', label: 'Chef' },
  { id: 'sailor', label: 'Sailor' },
]

export const ACCESSORIES: { id: AccessoryId; label: string }[] = [
  { id: 'none', label: 'None' },
  { id: 'sword', label: 'Sword' },
  { id: 'cake', label: 'Cake' },
  { id: 'flowers', label: 'Flowers' },
  { id: 'shield', label: 'Shield' },
  { id: 'wand', label: 'Wand' },
  { id: 'purse', label: 'Tiny purse' },
  { id: 'flag', label: 'Flag' },
  { id: 'balloon', label: 'Balloon' },
  { id: 'spoon', label: 'Spoon' },
]

export const COLORS: { id: ColorId; label: string; fill: string; shade: string; highlight: string }[] = [
  { id: 'classic', label: 'Classic', fill: '#5c8a3a', shade: '#3f6a24', highlight: '#8fbf5a' },
  { id: 'light', label: 'Light', fill: '#9bc96a', shade: '#6fa344', highlight: '#c5e89a' },
  { id: 'dark', label: 'Dark', fill: '#3a5c28', shade: '#243d18', highlight: '#5a7a40' },
  { id: 'spicy', label: 'Spicy', fill: '#c45c26', shade: '#8b3a12', highlight: '#e88850' },
  { id: 'pastel', label: 'Pastel', fill: '#b5d99a', shade: '#84b86a', highlight: '#d4efc0' },
]

export const EFFECTS: { id: EffectId; label: string }[] = [
  { id: 'none', label: 'None' },
  { id: 'sparkles', label: 'Sparkles' },
  { id: 'aura', label: 'Aura' },
  { id: 'hearts', label: 'Tiny hearts' },
]

export const MEDALS: { id: MedalId; label: string }[] = [
  { id: 'distinguished_bravery', label: 'Distinguished Bravery' },
  { id: 'best_dressed', label: 'Best Dressed' },
  { id: 'maximum_chaos', label: 'Maximum Chaos' },
  { id: 'commanders_favorite', label: "Commander's Favorite" },
  { id: 'exceptional_service', label: 'Exceptional Service' },
  { id: 'defender_of_cake', label: 'Defender of Cake' },
  { id: 'deeply_concerning', label: 'Deeply Concerning' },
]

export const DEFAULT_APPEARANCE = {
  body: 'chunky',
  eyes: 'sparkle',
  mouth: 'smug',
  hat: 'cowboy',
  accessory: 'sword',
  color: 'classic',
  effect: 'none',
} as const
