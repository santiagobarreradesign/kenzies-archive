import { DEFAULT_PAPER, resolvePaletteColor } from '@/lib/palette'
import { getTemplate } from '@/lib/templates'
import type { StampComposition, StampTemplate } from '@/types/stamp'

export function createEmptyComposition(
  template: StampTemplate = 'portrait',
  denomination = '26¢',
): StampComposition {
  const spec = getTemplate(template)
  return {
    version: 1,
    template,
    width: spec.width,
    height: spec.height,
    background: DEFAULT_PAPER,
    denomination,
    elements: [],
  }
}

export function canonicalizeComposition(composition: StampComposition): StampComposition {
  return {
    ...composition,
    background: resolvePaletteColor(composition.background),
  }
}

export function cloneComposition(composition: StampComposition): StampComposition {
  return structuredClone(composition)
}
