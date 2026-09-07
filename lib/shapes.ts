export const SHAPES = [
  { id: 'circle', label: 'Circle' },
  { id: 'square', label: 'Square' },
  { id: 'triangle', label: 'Triangle' },
  { id: 'star', label: 'Star' },
  { id: 'heart', label: 'Heart' },
  { id: 'arrow', label: 'Arrow' },
  { id: 'flower', label: 'Flower' },
  { id: 'sun', label: 'Sun' },
  { id: 'moon', label: 'Moon' },
  { id: 'cloud', label: 'Cloud' },
  { id: 'sparkle', label: 'Sparkle' },
  { id: 'bow', label: 'Bow' },
  { id: 'smiley', label: 'Smiley' },
  { id: 'pickle', label: 'Pickle' },
] as const

export type ShapeId = (typeof SHAPES)[number]['id']

export const MESSAGE_PROMPTS = [
  'Something you love about her',
  'A memory you never want her to forget',
  'Something you are grateful for',
  'Something you hope happens this year',
  'An inside joke that makes absolutely no sense to anyone else',
]
