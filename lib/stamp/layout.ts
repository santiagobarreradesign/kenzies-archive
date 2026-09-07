import { getTemplate } from '@/lib/templates'
import type { StampTemplate } from '@/types/stamp'

export type FieldMode = 'scatter' | 'organize'

export type GridNode = {
  id: string
  x: number
  y: number
  fit: boolean
}

export function stampWidth(template: StampTemplate) {
  const spec = getTemplate(template)
  if (spec.id === 'panoramic' || spec.id === 'landscape') return 210
  if (spec.id === 'tall') return 170
  return 188
}

export function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function clamp(min: number, max: number, value: number) {
  return Math.min(max, Math.max(min, value))
}

function area({ width, height }: { width: number; height: number }) {
  return width * height
}

/** Pack stamps into a centered grid. Overflow items stack on earlier cells. */
export function computeGridArrangement(opts: {
  containerWidth: number
  containerHeight: number
  children: Array<{ width: number; height: number; id: string }>
  paddingX: number
  paddingY: number
  gap: number
}): GridNode[] {
  const { containerWidth, containerHeight, paddingX, paddingY, gap } = opts
  const children = [...opts.children].sort((a, b) => area(b) - area(a))
  const results: GridNode[] = children.map((child) => ({ id: child.id, x: 0, y: 0, fit: false }))
  if (children.length === 0) return results

  const usableW = Math.max(0, containerWidth - 2 * paddingX)
  const usableH = Math.max(0, containerHeight - 2 * paddingY)
  if (usableW <= 0 || usableH <= 0) return results

  const cellW = Math.max(...children.map((child) => child.width))
  const cellH = Math.max(...children.map((child) => child.height))
  const cols = Math.max(1, Math.floor((usableW + gap) / (cellW + gap)))
  const rowsFit = Math.max(1, Math.floor((usableH + gap) / (cellH + gap)))
  const capacity = cols * rowsFit
  const rowsUsed = Math.min(rowsFit, Math.ceil(Math.min(children.length, capacity) / cols))
  const contentH = rowsUsed * cellH + (rowsUsed - 1) * gap
  const originY = paddingY + (usableH - contentH) / 2
  const placed = Math.min(children.length, capacity)

  for (let row = 0; row < rowsUsed; row += 1) {
    const base = row * cols
    const inRow = Math.max(0, Math.min(cols, placed - base))
    if (inRow <= 0) break
    const rowWidth = inRow * cellW + (inRow - 1) * gap
    const originX = paddingX + (usableW - rowWidth) / 2
    const yCenter = originY + row * (cellH + gap) + cellH / 2
    for (let col = 0; col < inRow; col += 1) {
      const index = base + col
      results[index] = {
        id: children[index].id,
        x: originX + col * (cellW + gap) + cellW / 2,
        y: yCenter,
        fit: true,
      }
    }
  }

  for (let index = placed; index < children.length; index += 1) {
    const base = results[index % placed]
    results[index] = { id: children[index].id, x: base.x, y: base.y, fit: false }
  }

  return results
}
