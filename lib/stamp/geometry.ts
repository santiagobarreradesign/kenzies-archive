import { normalizeTemplate } from '@/lib/templates'
import { STAMP_TEMPLATES, type StampTemplate } from '@/types/stamp'

/** Figma Kenzie/StampShape is a 260×260 (or 260×262) frame for every variant. */
export const STAMP_FRAME_SIZE = 260

export type BoxSides = {
  top: number
  right: number
  bottom: number
  left: number
}

export type CanvasInnerShape = 'rect' | 'ellipse' | 'pill'

export type BackChrome = {
  padding: string
  align: 'left' | 'center'
  header: 'full' | 'short' | 'stacked'
  compact: boolean
}

/**
 * Editable Canvas insets measured from each stamp SVG's `#Editable Canvas`.
 * CSS order: top right bottom left (percent of the square StampPaper frame).
 */
export const CANVAS_INSET: Record<StampTemplate, string> = {
  portrait: '17.71% 27.61% 18.47% 27.61%',
  'portrait-wide': '19.39% 23.19% 20.15% 23.19%',
  square: '21.66% 19.54%',
  circle: '16.79% 16.92% 17.56% 16.92%',
  // Ellipse in SVG — slightly off-center (cx 128.35 of 260).
  pickle: '19.21% 34.28% 19.23% 33.01%',
  tall: '14.12% 38.08% 14.89% 38.08%',
  landscape: '26.92% 14.62%',
  panoramic: '32.69% 14.23%',
}

/**
 * Extra padding *inside* the editable canvas so copy sits in an inscribed
 * rectangle. Curved canvases (circle, pickle, panoramic) clip a rectangle's
 * corners, so this has to be larger than a normal page margin.
 *
 * Values are fractions of the canvas box, not the 260 frame.
 */
const BACK_SAFE_PADDING: Record<StampTemplate, BoxSides> = {
  portrait: sides(0.09, 0.1),
  'portrait-wide': sides(0.09, 0.1),
  square: sides(0.09, 0.1),
  // Inscribed square in a circle is ~14.64%; add air so glyphs don't kiss the rim.
  circle: sides(0.18),
  pickle: sides(0.15, 0.18),
  tall: sides(0.06, 0.1),
  landscape: sides(0.1, 0.08),
  // Stay inside the stadium caps: horizontal inset ≥ the cap radius minus chord.
  panoramic: sides(0.12, 0.16),
}

/**
 * Match the SVG canvas shape:
 * - circle / pickle → elliptical `50%` (circle is a special case of ellipse)
 * - panoramic → stadium pill (`rx` equals half the short side)
 * - rect templates → sharp corners
 */
export function canvasRadius(template: StampTemplate | string): string | undefined {
  const id = normalizeTemplate(template)
  if (id === 'circle' || id === 'pickle') return '50%'
  if (id === 'panoramic') return '9999px'
  return undefined
}

export function canvasInnerShape(template: StampTemplate | string): CanvasInnerShape {
  const id = normalizeTemplate(template)
  if (id === 'circle' || id === 'pickle') return 'ellipse'
  if (id === 'panoramic') return 'pill'
  return 'rect'
}

export function parseCssPercentBox(value: string): BoxSides {
  const parts = value
    .trim()
    .split(/\s+/)
    .map((token) => Number.parseFloat(token) / 100)
  if (parts.length === 0 || parts.some((n) => !Number.isFinite(n))) {
    throw new Error(`Invalid percent box: ${value}`)
  }
  if (parts.length === 1) return sides(parts[0])
  if (parts.length === 2) return sides(parts[0], parts[1])
  if (parts.length === 3) {
    return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[1] }
  }
  return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[3] }
}

export function canvasBoxFractions(template: StampTemplate | string): BoxSides {
  return parseCssPercentBox(CANVAS_INSET[normalizeTemplate(template)])
}

export function backSafePadding(template: StampTemplate | string): BoxSides {
  return BACK_SAFE_PADDING[normalizeTemplate(template)]
}

export function backSafePaddingCss(template: StampTemplate | string): string {
  const pad = backSafePadding(template)
  return `${pct(pad.top)} ${pct(pad.right)} ${pct(pad.bottom)} ${pct(pad.left)}`
}

export function backChrome(template: StampTemplate | string): BackChrome {
  const id = normalizeTemplate(template)
  const padding = backSafePaddingCss(id)
  if (id === 'circle') return { padding, align: 'center', header: 'stacked', compact: false }
  if (id === 'pickle' || id === 'tall') return { padding, align: 'center', header: 'short', compact: true }
  if (id === 'panoramic') return { padding, align: 'left', header: 'short', compact: true }
  return { padding, align: 'left', header: 'full', compact: false }
}

/** Opened stamp size — narrow/round canvases need a larger square so the inner copy is readable. */
export function stampViewerFrameClass(template: StampTemplate | string): string {
  const id = normalizeTemplate(template)
  if (id === 'tall' || id === 'pickle') return 'w-[min(94vw,90dvh,44rem)]'
  if (id === 'panoramic' || id === 'landscape') return 'w-[min(94vw,86dvh,42rem)]'
  if (id === 'circle') return 'w-[min(90vw,86dvh,40rem)]'
  return 'w-[min(92vw,82dvh,36rem)]'
}

/**
 * True when the padded content rectangle sits fully inside the canvas silhouette.
 * Used to keep back-of-stamp copy from being clipped by ellipse/pill edges.
 */
export function contentRectInsideCanvas(template: StampTemplate | string, padding = backSafePadding(template)) {
  const inset = canvasBoxFractions(template)
  const width = (1 - inset.left - inset.right) * STAMP_FRAME_SIZE
  const height = (1 - inset.top - inset.bottom) * STAMP_FRAME_SIZE
  const left = padding.left * width
  const right = (1 - padding.right) * width
  const top = padding.top * height
  const bottom = (1 - padding.bottom) * height
  const shape = canvasInnerShape(template)
  const corners: Array<[number, number]> = [
    [left, top],
    [right, top],
    [left, bottom],
    [right, bottom],
  ]
  return corners.every(([x, y]) => pointInsideCanvas(shape, x, y, width, height))
}

export function allBackCopyFits() {
  return STAMP_TEMPLATES.every((id) => contentRectInsideCanvas(id))
}

export function stampSilhouetteSrc(template: StampTemplate | string, paper: 'white' | 'cream' = 'white') {
  const id = normalizeTemplate(template)
  return paper === 'cream' ? `/assets/stamps/${id}-cream.svg` : `/assets/stamps/${id}.svg`
}

function sides(vertical: number, horizontal = vertical): BoxSides {
  return { top: vertical, right: horizontal, bottom: vertical, left: horizontal }
}

function pct(value: number) {
  const n = Math.round(value * 10000) / 100
  return `${Number(n.toFixed(2))}%`
}

function pointInsideCanvas(shape: CanvasInnerShape, x: number, y: number, width: number, height: number) {
  const slack = 0.35
  if (shape === 'rect') {
    return x >= -slack && y >= -slack && x <= width + slack && y <= height + slack
  }
  if (shape === 'ellipse') {
    const nx = (x - width / 2) / (width / 2)
    const ny = (y - height / 2) / (height / 2)
    return nx * nx + ny * ny <= 1 + 1e-4
  }
  const radius = height / 2
  const cy = height / 2
  if (x >= radius && x <= width - radius) return Math.abs(y - cy) <= radius + slack
  const cx = x < radius ? radius : width - radius
  const dx = x - cx
  const dy = y - cy
  return dx * dx + dy * dy <= radius * radius + slack
}
