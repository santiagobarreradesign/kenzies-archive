'use client'

import type { ReactNode } from 'react'
import { CanvasSurface, type CanvasContext } from '@/components/postal/CanvasSurface'

export const SIDEBAR_FRAME =
  'flex h-full min-h-0 flex-col px-5 py-5 lg:min-h-full lg:px-12 lg:py-8'
export const SIDEBAR_TITLE =
  'mt-4 font-serif text-[28px] font-medium leading-8 tracking-tight text-[#2e2b26] text-balance lg:mt-10 lg:text-[42px] lg:leading-[50px]'
export const SIDEBAR_COPY =
  'mt-4 max-w-[360px] text-[15px] leading-[23px] text-[#59574f] lg:mt-6 lg:text-[16px] lg:leading-[25px]'

export function PostalShell({
  sidebar,
  sidebarWidth = 390,
  collapsed = false,
  context = 'create',
  showBinder = false,
  canvasFirst = false,
  children,
}: {
  sidebar?: ReactNode
  sidebarWidth?: number
  collapsed?: boolean
  context?: CanvasContext
  showBinder?: boolean
  /** On small screens, put the paper canvas above the sidebar (editor / picker). */
  canvasFirst?: boolean
  children: ReactNode
}) {
  const stacked = Boolean(sidebar && !collapsed)

  const frame = stacked
    ? canvasFirst
      ? 'grid min-h-dvh grid-cols-1 grid-rows-[minmax(48vh,1fr)_auto] bg-[#fdfcfa] [grid-template-areas:"canvas"_"sidebar"] lg:h-dvh lg:max-h-dvh lg:grid-cols-[var(--sidebar-width)_1fr] lg:grid-rows-1 lg:overflow-hidden lg:[grid-template-areas:"sidebar_canvas"]'
      : 'grid min-h-dvh grid-cols-1 grid-rows-[auto_minmax(52vh,1fr)] bg-[#fdfcfa] [grid-template-areas:"sidebar"_"canvas"] lg:h-dvh lg:max-h-dvh lg:grid-cols-[var(--sidebar-width)_1fr] lg:grid-rows-1 lg:overflow-hidden lg:[grid-template-areas:"sidebar_canvas"]'
    : 'grid min-h-dvh grid-cols-1 grid-rows-1 bg-[#fdfcfa] [grid-template-areas:"canvas"] lg:h-dvh lg:max-h-dvh lg:overflow-hidden'

  return (
    <div className={frame} style={{ ['--sidebar-width' as string]: `${sidebarWidth}px` }}>
      {stacked ? (
        <aside
          className={
            canvasFirst
              ? 'relative z-20 min-h-0 max-h-[42vh] overflow-y-auto overscroll-contain border-t border-[var(--column-divider)] bg-white [grid-area:sidebar] lg:max-h-none lg:border-r lg:border-t-0'
              : 'relative z-20 min-h-0 overflow-y-auto overscroll-contain bg-white [grid-area:sidebar] lg:border-r lg:border-[var(--column-divider)]'
          }
        >
          {sidebar}
        </aside>
      ) : null}
      <div className="relative min-h-0 min-w-0 [grid-area:canvas]">
        <CanvasSurface context={context} showBinder={showBinder}>
          {children}
        </CanvasSurface>
      </div>
    </div>
  )
}
