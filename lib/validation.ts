import { z } from 'zod'
import { TEMPLATES } from '@/lib/templates'
import { isPaletteColor, resolvePaletteColor } from '@/lib/palette'
import { ELEMENT_TYPES, STAMP_TEMPLATES } from '@/types/stamp'

const templateId = z.enum(STAMP_TEMPLATES)

const drawingData = z.object({
  kind: z.literal('drawing'),
  tool: z.enum(['pencil', 'marker', 'eraser']),
  points: z.array(z.number()).max(4000),
  color: z.string().max(32),
  strokeWidth: z.number().min(1).max(48),
})

const shapeData = z.object({
  kind: z.literal('shape'),
  shape: z.string().max(32),
  fill: z.string().max(32),
})

const textData = z.object({
  kind: z.literal('text'),
  text: z.string().max(200),
  font: z.enum(['serif', 'sans', 'hand', 'display']),
  fill: z.string().max(32),
  align: z.enum(['left', 'center', 'right']),
  fontSize: z.number().min(10).max(96),
})

const photoData = z.object({
  kind: z.literal('photo'),
  src: z.string().max(6_000_000),
  filter: z.enum(['original', 'bw']),
})

const elementData = z.discriminatedUnion('kind', [drawingData, shapeData, textData, photoData])

export const stampElementSchema = z.object({
  id: z.string().min(1).max(80),
  type: z.enum(ELEMENT_TYPES),
  x: z.number().min(-2000).max(2000),
  y: z.number().min(-2000).max(2000),
  width: z.number().min(1).max(2000),
  height: z.number().min(1).max(2000),
  rotation: z.number().min(-360).max(360),
  scaleX: z.number().min(-8).max(8),
  scaleY: z.number().min(-8).max(8),
  opacity: z.number().min(0).max(1),
  zIndex: z.number().int().min(0).max(200),
  data: elementData,
})

export const stampCompositionSchema = z
  .object({
    version: z.literal(1),
    template: templateId,
    width: z.number().int().min(200).max(800),
    height: z.number().int().min(200).max(800),
    background: z.preprocess(
      (value) => resolvePaletteColor(typeof value === 'string' ? value : undefined),
      z.string().refine(isPaletteColor, 'Background must use the project palette.'),
    ),
    denomination: z.string().trim().min(1).max(32),
    elements: z.array(stampElementSchema).max(80),
  })
  .refine((value) => {
    const spec = TEMPLATES.find((template) => template.id === value.template)
    return spec ? spec.width === value.width && spec.height === value.height : false
  }, 'Composition dimensions must match the selected template.')

export const messageFormSchema = z.object({
  creatorName: z.string().trim().min(1, 'A name is required.').max(80),
  creatorLocation: z.string().trim().max(80).optional().or(z.literal('')),
  message: z
    .string()
    .trim()
    .min(8, 'Write something Kenzie can keep.')
    .max(240, 'Keep it to 240 characters.'),
})

export const submitStampSchema = messageFormSchema.extend({
  composition: stampCompositionSchema,
  preview: z.string().min(32).max(8_000_000),
  turnstileToken: z.string().optional(),
})

export const adminActionSchema = z.object({
  stampId: z.string().uuid(),
  action: z.enum(['approve', 'reject', 'hide']),
})

export type MessageFormValues = z.infer<typeof messageFormSchema>
export type SubmitStampInput = z.infer<typeof submitStampSchema>
