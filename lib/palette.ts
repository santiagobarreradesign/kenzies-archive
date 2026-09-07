export const PALETTE = [
  { id: 'canvas', label: 'Canvas', value: '#D1D1D1' },
  { id: 'black', label: 'Black', value: '#171717' },
  { id: 'vermilion', label: 'Vermilion', value: '#E4462F' },
  { id: 'cobalt', label: 'Cobalt', value: '#2E5BFF' },
  { id: 'olive', label: 'Olive', value: '#66734C' },
  { id: 'butter', label: 'Butter', value: '#F4D85E' },
  { id: 'lavender', label: 'Lavender', value: '#B9A7FF' },
] as const

export const INK_SWATCHES = PALETTE.filter((swatch) => swatch.id !== 'canvas')

export const DEFAULT_INK = PALETTE[1].value
export const DEFAULT_PAPER = PALETTE[0].value
export const STAMP_CREAM = '#F6F0E5'
export const STAMP_WHITE = '#FFFFFF'

export function isPaletteColor(value: string) {
  return PALETTE.some((color) => color.value.toLowerCase() === value.trim().toLowerCase())
}

export function resolvePaletteColor(value: string | null | undefined, fallback: string = DEFAULT_PAPER) {
  if (typeof value !== 'string') return fallback
  const normalized = value.trim().toLowerCase()
  const match = PALETTE.find((color) => color.value.toLowerCase() === normalized)
  return match ? match.value : fallback
}
