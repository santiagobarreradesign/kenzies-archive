'use client'

import type { ReactNode } from 'react'

export type CanvasContext = 'archive' | 'create' | 'editor' | 'flow' | 'admin'

const COPY: Record<CanvasContext, { left: string; center: string; right: string }> = {
  archive: { left: 'KENZIE POST · BIRTHDAY ARCHIVE', center: 'WITH LOVE · 2026', right: 'ARCHIVE' },
  create: { left: 'KENZIE POST · CREATE', center: 'MAKE SOMETHING SMALL', right: 'SHAPE · PICKER' },
  editor: { left: 'KENZIE POST · CREATE', center: 'MAKE SOMETHING SMALL', right: 'EDITOR' },
  flow: { left: 'KENZIE POST · SPECIAL ISSUE', center: 'POSTMARKED FOR KENZIE', right: 'ARCHIVE · FULL' },
  admin: { left: 'KENZIE POST · ADMIN', center: 'MODERATION DESK', right: 'PRIVATE' },
}

export function CanvasSurface({
  context = 'archive',
  showBinder = false,
  children,
}: {
  context?: CanvasContext
  showBinder?: boolean
  children?: ReactNode
}) {
  const copy = COPY[context]

  return (
    <div className="relative h-full min-h-[70vh] overflow-hidden bg-[var(--canvas-paper)]">
      <div
        className="pointer-events-none absolute inset-[18px_24px_48px] border border-[var(--canvas-border)] bg-[length:30px_30px]"
        style={{
          backgroundImage:
            'linear-gradient(var(--canvas-grid) 1px, transparent 1px), linear-gradient(90deg, var(--canvas-grid) 1px, transparent 1px)',
        }}
        aria-hidden
      />
      {showBinder ? (
        <div className="pointer-events-none absolute left-[14px] top-[280px] flex flex-col gap-10" aria-hidden>
          {/* Figma binder marks — local SVG assets, not content images. */}
          {/* eslint-disable @next/next/no-img-element */}
          <img src="/assets/binding-mark.svg" alt="" width={10} height={10} />
          <img src="/assets/binding-mark-alt.svg" alt="" width={12} height={12} />
          <img src="/assets/binding-mark-alt.svg" alt="" width={12} height={12} />
          <img src="/assets/binding-mark.svg" alt="" width={10} height={10} />
          <img src="/assets/binding-mark-alt.svg" alt="" width={12} height={12} />
          <img src="/assets/binding-mark-alt.svg" alt="" width={12} height={12} />
          <img src="/assets/binding-mark.svg" alt="" width={10} height={10} />
          {/* eslint-enable @next/next/no-img-element */}
        </div>
      ) : null}
      <div className="canvas-grain pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative z-10 h-full min-h-[70vh]">{children}</div>
      <div className="pointer-events-none absolute inset-x-8 bottom-3 z-20 flex items-center justify-between gap-4 font-mono text-[10px] leading-[14px] text-[var(--canvas-meta)]">
        <span>{copy.left}</span>
        <span className="hidden sm:inline">{copy.center}</span>
        <span>{copy.right}</span>
      </div>
    </div>
  )
}
