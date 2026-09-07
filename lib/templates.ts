import { STAMP_TEMPLATES, type StampTemplate } from '@/types/stamp'

export type TemplateSpec = {
  id: StampTemplate
  name: string
  description: string
  width: number
  height: number
  inner: 'rect' | 'round' | 'pill'
}

/** Canvas pixel sizes match Figma Editable Canvas aspects (Kenzie/StampShape). */
export const TEMPLATES: TemplateSpec[] = [
  { id: 'portrait', name: 'Portrait', description: 'Classic vertical paper.', width: 291, height: 418, inner: 'rect' },
  { id: 'portrait-wide', name: 'Portrait Wide', description: 'A little more room.', width: 349, height: 396, inner: 'rect' },
  { id: 'square', name: 'Square', description: 'Even on every side.', width: 396, height: 368, inner: 'rect' },
  { id: 'circle', name: 'Circle', description: 'A round issue.', width: 430, height: 430, inner: 'round' },
  { id: 'pickle', name: 'Pickle', description: 'A soft oval issue.', width: 260, height: 420, inner: 'round' },
  { id: 'tall', name: 'Tall', description: 'Narrow and editorial.', width: 155, height: 465, inner: 'rect' },
  { id: 'landscape', name: 'Landscape', description: 'Better for wide pictures.', width: 460, height: 300, inner: 'rect' },
  { id: 'panoramic', name: 'Panoramic', description: 'A long horizontal issue.', width: 465, height: 225, inner: 'pill' },
]

const ALIASES: Record<string, StampTemplate> = {
  classic: 'portrait',
  organic: 'pickle',
}

export function normalizeTemplate(value: string | null | undefined): StampTemplate {
  if (!value) return 'portrait'
  if (ALIASES[value]) return ALIASES[value]
  return STAMP_TEMPLATES.includes(value as StampTemplate) ? (value as StampTemplate) : 'portrait'
}

export function getTemplate(id: string) {
  const normalized = normalizeTemplate(id)
  return TEMPLATES.find((template) => template.id === normalized) ?? TEMPLATES[0]
}

export const DENOMINATIONS = [
  '26¢',
  '1 hug',
  '1 pickle',
  '∞',
  'priceless',
  '100 kisses',
  '3 martinis',
  '1 memory',
  '4ever',
] as const

export type Denomination = (typeof DENOMINATIONS)[number]
