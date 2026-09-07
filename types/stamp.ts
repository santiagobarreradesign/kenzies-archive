export const STAMP_TEMPLATES = [
  'portrait',
  'portrait-wide',
  'square',
  'circle',
  'tall',
  'landscape',
  'panoramic',
] as const
export type StampTemplate = (typeof STAMP_TEMPLATES)[number]

export const STAMP_STATUSES = ['pending', 'approved', 'rejected', 'hidden'] as const
export type StampStatus = (typeof STAMP_STATUSES)[number]

export const ELEMENT_TYPES = ['drawing', 'shape', 'text', 'photo'] as const
export type ElementType = (typeof ELEMENT_TYPES)[number]

export const STROKE_SIZES = ['small', 'medium', 'large'] as const
export type StrokeSize = (typeof STROKE_SIZES)[number]

export type EditorTool = 'select' | 'draw' | 'text' | 'photo'
export type DrawMode = 'pencil' | 'marker' | 'eraser'

export type DrawingData = {
  kind: 'drawing'
  tool: 'pencil' | 'marker' | 'eraser'
  points: number[]
  color: string
  strokeWidth: number
}

export type ShapeData = {
  kind: 'shape'
  shape: string
  fill: string
}

export type TextData = {
  kind: 'text'
  text: string
  font: 'serif' | 'sans' | 'hand' | 'display'
  fill: string
  align: 'left' | 'center' | 'right'
  fontSize: number
}

export type PhotoData = {
  kind: 'photo'
  src: string
  filter: 'original' | 'bw'
}

export type StampElementData = DrawingData | ShapeData | TextData | PhotoData

export type StampElement = {
  id: string
  type: ElementType
  x: number
  y: number
  width: number
  height: number
  rotation: number
  scaleX: number
  scaleY: number
  opacity: number
  zIndex: number
  data: StampElementData
}

export type StampComposition = {
  version: 1
  template: StampTemplate
  width: number
  height: number
  background: string
  denomination: string
  elements: StampElement[]
}

export type StampRecord = {
  id: string
  number: number | null
  slug: string
  creator_name: string
  creator_location: string | null
  message: string | null
  template: StampTemplate
  denomination: string
  composition_json: StampComposition | null
  preview_url: string | null
  source_photo_path: string | null
  status: StampStatus
  created_at: string
  approved_at: string | null
  opened_at: string | null
  seed_art?: string
  local?: boolean
}

export type StampDraft = {
  composition: StampComposition
  message: string
  creatorName: string
  creatorLocation: string
}

export type SiteState = {
  birthday_mode: boolean
  reveal_played: boolean
}
