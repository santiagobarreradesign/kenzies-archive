'use client'

import type { ReactNode } from 'react'
import { CanvasSurface, type CanvasContext } from '@/components/postal/CanvasSurface'

export function PostalShell({
  sidebar,
  sidebarWidth = 390,
  collapsed = false,
  context = 'create',
  showBinder = false,
  children,
}: {
  sidebar?: ReactNode
  sidebarWidth?: number
  collapsed?: boolean
  context?: CanvasContext
  showBinder?: boolean
  children: ReactNode
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-[#fdfcfa] lg:flex-row">
      {sidebar && !collapsed ? (
        <>
          <aside
            className="relative z-20 flex w-full shrink-0 flex-col bg-white lg:min-h-dvh"
            style={{ flexBasis: sidebarWidth, width: sidebarWidth, maxWidth: '100%' }}
          >
            {sidebar}
          </aside>
          <div className="hidden w-px shrink-0 bg-[var(--column-divider)] lg:block" aria-hidden />
        </>
      ) : null}
      <div className="relative min-h-[70vh] min-w-0 flex-1 lg:min-h-dvh">
        <CanvasSurface context={context} showBinder={showBinder}>
          {children}
        </CanvasSurface>
      </div>
    </div>
  )
}
