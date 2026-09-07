import { normalizeTemplate } from '@/lib/templates'
import type { StampTemplate } from '@/types/stamp'

/** Figma Kenzie/StampShape is a 260×260 frame for every variant. */
export const STAMP_FRAME_SIZE = 260

/**
 * Editable Canvas insets from Kenzie/StampShape / Kenzie/SealedBack.
 * Values match Figma `inset-[top/bottom_left/right]` (or uniform for circle).
 */
export const CANVAS_INSET: Record<StampTemplate, string> = {
  portrait: '17.85% 27.61%',
  'portrait-wide': '19.54% 23.19%',
  square: '21.66% 19.54%',
  circle: '16.92%',
  tall: '14.23% 38.08%',
  landscape: '26.92% 14.62%',
  panoramic: '32.69% 14.23%',
}

export function canvasRadius(template: StampTemplate | string): string | undefined {
  const id = normalizeTemplate(template)
  if (id === 'circle') return '9999px'
  if (id === 'panoramic') return '9999px'
  return undefined
}

export function stampSilhouetteSrc(template: StampTemplate | string, paper: 'white' | 'cream' = 'white') {
  const id = normalizeTemplate(template)
  return paper === 'cream' ? `/assets/stamps/${id}-cream.svg` : `/assets/stamps/${id}.svg`
}
