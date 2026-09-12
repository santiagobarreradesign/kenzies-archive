'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button, Heading, IconButton, Text } from '@medusajs/ui'
import { StampCard, type StampFieldController } from '@/components/archive/StampCard'
import { PostalShell, SIDEBAR_COPY, SIDEBAR_FRAME, SIDEBAR_TITLE } from '@/components/postal/PostalShell'
import { stampScale, useIsMobile, useIsMobileSmall } from '@/hooks/use-media-query'
import { computeGridArrangement, randInt, type FieldMode } from '@/lib/stamp/layout'
import { listLocalStamps } from '@/lib/stamps/local'
import type { StampRecord } from '@/types/stamp'

export function ArchiveView({
  stamps,
  unsealed,
  highlightSlug,
}: {
  stamps: StampRecord[]
  unsealed: boolean
  count: number
  highlightSlug?: string
}) {
  const fieldRef = useRef<HTMLDivElement>(null)
  const constraintsRef = useRef<HTMLDivElement>(null)
  const controllers = useRef(new Map<string, StampFieldController>())
  const zRef = useRef(10)
  const [zMap, setZMap] = useState<Record<string, number>>({})
  const [mode, setMode] = useState<FieldMode>('scatter')
  const [face, setFace] = useState<'front' | 'back'>(unsealed ? 'back' : 'front')
  const [collapsed, setCollapsed] = useState(false)
  const [localStamps, setLocalStamps] = useState<StampRecord[]>([])
  const [hydrated, setHydrated] = useState(false)
  const [featured, setFeatured] = useState(highlightSlug)
  const isMobile = useIsMobile(false)
  const isMobileSmall = useIsMobileSmall(false)
  const scale = stampScale(isMobile, isMobileSmall)
  const allStamps = useMemo(() => {
    const seen = new Set(stamps.map((stamp) => stamp.id))
    return [...stamps, ...localStamps.filter((stamp) => !seen.has(stamp.id))]
  }, [localStamps, stamps])
  const stampIds = allStamps.map((stamp) => stamp.id).join(',')

  useEffect(() => {
    setLocalStamps(listLocalStamps())
    setHydrated(true)
  }, [])

  useEffect(() => {
    setFeatured(highlightSlug)
  }, [highlightSlug])

  const register = useCallback((controller: StampFieldController) => {
    controllers.current.set(controller.id, controller)
  }, [])

  const lift = useCallback((id: string) => {
    zRef.current += 1
    const next = zRef.current
    setZMap((current) => ({ ...current, [id]: next }))
  }, [])

  const scatter = useCallback(
    (stagger = 5) => {
      const container = fieldRef.current
      if (!container) return
      setMode('scatter')
      const dist = Math.min(isMobile ? 280 : 500, Math.max(container.clientWidth, container.clientHeight) * 0.42)
      allStamps.forEach((stamp, index) => {
        const controller = controllers.current.get(stamp.id)
        if (!controller) return
        window.setTimeout(() => {
          controller.spreadOut({ container, dist, padding: isMobile ? 20 : 48 })
        }, index * stagger)
      })
    },
    [allStamps, isMobile],
  )

  const organize = useCallback(() => {
    const container = fieldRef.current
    if (!container) return
    setMode('organize')
    const children = allStamps.flatMap((stamp) => {
      const controller = controllers.current.get(stamp.id)
      if (!controller) return []
      const size = controller.getSize()
      return [{ id: stamp.id, width: size.width, height: size.height }]
    })
    const positions = computeGridArrangement({
      containerWidth: container.clientWidth,
      containerHeight: container.clientHeight,
      children,
      paddingX: isMobile ? 12 : 24,
      paddingY: isMobile ? 48 : 72,
      gap: isMobile ? 8 : 12,
    })
    positions.forEach((pos, index) => {
      const controller = controllers.current.get(pos.id)
      const child = children.find((item) => item.id === pos.id)
      if (!controller || !child) return
      window.setTimeout(() => {
        controller.organizeTo({
          x: pos.x - child.width / 2,
          y: pos.y - child.height / 2,
          rotate: pos.fit ? randInt(-5, 5) : randInt(-35, 35),
        })
        lift(pos.id)
      }, index * 4)
    })
  }, [allStamps, isMobile, lift])

  useEffect(() => {
    if (!hydrated || allStamps.length === 0) return
    const timer = window.setTimeout(() => scatter(5), 50)
    return () => window.clearTimeout(timer)
    // Burst once the field has real stamp nodes, then whenever the set of issues changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, stampIds, scale])

  const sidebar = (
    <div className={SIDEBAR_FRAME}>
      <div className="flex items-start justify-between gap-4">
        <Text size="small" className="font-mono text-[12px] text-[#5c574f] lg:text-[13px]">
          kenziepost / birthday archive
        </Text>
        <IconButton
          variant="transparent"
          onClick={() => setCollapsed(true)}
          aria-label="Collapse information"
          className="size-10 shrink-0"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/icon-back.svg" alt="" width={20} height={20} />
        </IconButton>
      </div>
      <Heading level="h1" className={SIDEBAR_TITLE}>
        {unsealed ? 'The post has arrived.' : 'Special delivery for Kenzie'}
      </Heading>
      <div className={`${SIDEBAR_COPY} space-y-3 lg:space-y-4`}>
        {unsealed ? (
          <>
            <Text>The messages are open. Each reverse is a note someone wanted Kenzie to keep.</Text>
            <Text className="hidden sm:block">The artwork is still public. Read slowly. These were made for her.</Text>
          </>
        ) : (
          <>
            <Text>
              A tiny postal archive made by people who love Kenzie. Each stamp keeps one small piece of art on the front
              and one message for her on the back.
            </Text>
            <Text className="hidden sm:block">
              Until her birthday, the collection can be explored but the messages stay sealed. Drag the stamps around the
              paper — select one to see who sent it.
            </Text>
          </>
        )}
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-3 pt-2 lg:mt-auto lg:space-y-3 lg:pt-10">
        <Text size="xsmall" className="font-mono text-[11px] tracking-[0.04em] text-[#8a8275] lg:w-full lg:text-[12px]">
          SPECIAL DELIVERY · 2026
        </Text>
      </div>
    </div>
  )

  return (
    <PostalShell
      sidebar={sidebar}
      sidebarWidth={470}
      collapsed={collapsed}
      context="archive"
      showBinder
    >
      {collapsed ? (
        <div className="absolute left-4 top-4 z-30">
          <IconButton variant="transparent" onClick={() => setCollapsed(false)} aria-label="Show information" className="size-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/icon-back.svg" alt="" width={20} height={20} className="rotate-180" />
          </IconButton>
        </div>
      ) : null}

      <div className="absolute left-1/2 top-3 z-20 flex -translate-x-1/2 flex-wrap items-center justify-center gap-x-3 gap-y-1 px-3 lg:top-6 lg:gap-x-6">
        {unsealed ? (
          <>
            <Button size="small" variant={face === 'front' ? 'secondary' : 'transparent'} onClick={() => setFace('front')}>
              Front
            </Button>
            <Button size="small" variant={face === 'back' ? 'secondary' : 'transparent'} onClick={() => setFace('back')}>
              Messages
            </Button>
          </>
        ) : null}
        <Button size="small" variant={mode === 'organize' ? 'secondary' : 'transparent'} onClick={organize}>
          Organize
        </Button>
        <Button size="small" variant={mode === 'scatter' ? 'secondary' : 'transparent'} onClick={() => scatter(3)}>
          Shuffle
        </Button>
      </div>

      <div
        ref={fieldRef}
        role="list"
        aria-label="Stamp archive"
        className="relative h-full min-h-0 w-full touch-none pt-12 pb-8 lg:pt-16 lg:pb-10"
        onClick={(event) => {
          if (event.target === event.currentTarget) setFeatured(undefined)
        }}
      >
        <div
          ref={constraintsRef}
          className="pointer-events-none absolute inset-[48px_12px_28px_12px] lg:inset-[72px_20px_40px_20px]"
          aria-hidden
        />
        {allStamps.length === 0 ? (
          <div className="flex h-[60vh] items-center justify-center px-8 text-center">
            <Text className="max-w-sm text-[#59574f]">No stamps yet. Create the first one for Kenzie.</Text>
          </div>
        ) : (
          allStamps.map((stamp) => (
            <StampCard
              key={stamp.id}
              stamp={stamp}
              href={`/stamp/${stamp.slug}`}
              constraintsRef={constraintsRef}
              z={zMap[stamp.id] ?? 10}
              onLift={lift}
              onRegister={register}
              selected={featured === stamp.slug}
              dimmed={Boolean(featured) && featured !== stamp.slug}
              face={unsealed ? face : 'front'}
              isNew={featured === stamp.slug}
              scale={scale}
            />
          ))
        )}
      </div>
    </PostalShell>
  )
}
