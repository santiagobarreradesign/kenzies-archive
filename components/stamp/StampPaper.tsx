'use client'

import type { ReactNode } from 'react'
import { canvasRadius, CANVAS_INSET, stampSilhouetteSrc } from '@/lib/stamp/geometry'
import { normalizeTemplate } from '@/lib/templates'
import type { StampTemplate } from '@/types/stamp'

export function StampPaper({
  template,
  children,
  className = '',
  paper = 'white',
  empty = false,
}: {
  template: StampTemplate | string
  children?: ReactNode
  className?: string
  paper?: 'white' | 'cream'
  /** When true and no children, the Figma SVG grey/cream canvas shows through. */
  empty?: boolean
}) {
  const id = normalizeTemplate(template)
  const inset = CANVAS_INSET[id]
  const radius = canvasRadius(id)

  return (
    <div className={`stamp-shape relative aspect-square w-full ${className}`} data-empty={empty || undefined}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={stampSilhouetteSrc(id, paper)}
        alt=""
        draggable={false}
        className="pointer-events-none absolute inset-0 h-full w-full select-none object-contain"
      />
      <div className="stamp-art absolute min-h-0 min-w-0 overflow-hidden" style={{ inset, borderRadius: radius }}>
        {children}
      </div>
    </div>
  )
}

export function StampFrame({
  template,
  children,
  className = '',
}: {
  template: StampTemplate | string
  denomination?: string
  children: ReactNode
  className?: string
  ink?: string
}) {
  return (
    <StampPaper template={template} className={className}>
      {children}
    </StampPaper>
  )
}
