'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useAnimation, useReducedMotion } from 'motion/react'
import { OpenBack } from '@/components/stamp/OpenBack'
import { StampPaper } from '@/components/stamp/StampPaper'
import { SeedArt } from '@/components/stamp/SeedArt'
import { clamp, randInt, stampWidth } from '@/lib/stamp/layout'
import { formatStampNumber } from '@/lib/stamp/slug'
import type { StampRecord } from '@/types/stamp'

export type StampFieldController = {
  id: string
  spreadOut: (opts: { container: HTMLElement; dist: number; padding?: number }) => void
  organizeTo: (opts: { x: number; y: number; rotate: number; instant?: boolean }) => void
  getSize: () => { width: number; height: number }
}

const SPRING = { type: 'spring' as const, stiffness: 500, damping: 80 }
const DRAG_TRANSITION = { bounceStiffness: 100, bounceDamping: 10, power: 0.4 }

export function StampCard({
  stamp,
  selected,
  dimmed,
  face = 'front',
  isNew = false,
  href,
  constraintsRef,
  z,
  onLift,
  onRegister,
}: {
  stamp: StampRecord
  selected: boolean
  dimmed: boolean
  face?: 'front' | 'back'
  isNew?: boolean
  href: string
  constraintsRef: React.RefObject<HTMLElement | null>
  z: number
  onLift: (id: string) => void
  onRegister: (controller: StampFieldController) => void
}) {
  const reduce = useReducedMotion()
  const controls = useAnimation()
  const nodeRef = useRef<HTMLDivElement | null>(null)
  const suppressClick = useRef(false)
  const [dragging, setDragging] = useState(false)
  const width = stampWidth(stamp.template)

  const spreadOut = useCallback(
    ({ container, dist, padding = 40 }: { container: HTMLElement; dist: number; padding?: number }) => {
      const el = nodeRef.current
      if (!el) return
      const elWidth = el.offsetWidth
      const elHeight = el.offsetHeight
      const centerX = container.clientWidth / 2 - elWidth / 2
      const centerY = container.clientHeight / 2 - elHeight / 2
      const place = () => {
        const minX = padding
        const maxX = Math.max(padding, container.clientWidth - elWidth - padding)
        const minY = padding
        const maxY = Math.max(padding, container.clientHeight - elHeight - padding)
        return {
          rotate: randInt(-35, 35),
          x: clamp(minX, maxX, centerX + randInt(-dist, dist)),
          y: clamp(minY, maxY, centerY + randInt(-dist, dist)),
          opacity: 1,
          scale: 1,
          transition: reduce ? { duration: 0 } : SPRING,
        }
      }
      if (reduce) {
        void controls.start(place())
        return
      }
      void controls.start({ x: centerX, y: centerY, scale: 1, transition: { duration: 0 } }).then(() => {
        void controls.start(place())
      })
    },
    [controls, reduce],
  )

  const organizeTo = useCallback(
    ({ x, y, rotate, instant }: { x: number; y: number; rotate: number; instant?: boolean }) => {
      void controls.start({
        x,
        y,
        rotate,
        opacity: 1,
        scale: 1,
        transition: reduce || instant ? { duration: 0 } : SPRING,
      })
    },
    [controls, reduce],
  )

  useEffect(() => {
    onRegister({
      id: stamp.id,
      spreadOut,
      organizeTo,
      getSize: () => ({
        width: nodeRef.current?.offsetWidth ?? width,
        height: nodeRef.current?.offsetHeight ?? width,
      }),
    })
  }, [onRegister, organizeTo, spreadOut, stamp.id, width])

  return (
    <motion.div
      ref={nodeRef}
      role="listitem"
      data-id={stamp.id}
      animate={controls}
      drag={!reduce && !dimmed}
      dragConstraints={constraintsRef}
      dragElastic={0.1}
      dragMomentum
      dragTransition={DRAG_TRANSITION}
      initial={{ opacity: 0 }}
      transition={SPRING}
      whileDrag={reduce ? undefined : { scale: 1.1, cursor: 'grabbing', transition: { duration: 0.1 } }}
      whileTap={reduce || dragging ? undefined : { scale: 0.96 }}
      onPointerDown={() => onLift(stamp.id)}
      onDragStart={() => {
        suppressClick.current = false
        setDragging(true)
        onLift(stamp.id)
      }}
      onDrag={(_event, info) => {
        if (Math.hypot(info.offset.x, info.offset.y) > 5) suppressClick.current = true
      }}
      onDragEnd={() => {
        setDragging(false)
        window.setTimeout(() => {
          suppressClick.current = false
        }, 80)
      }}
      style={{ width, zIndex: dragging ? 80 : z, willChange: dragging ? 'transform' : undefined }}
      className={`absolute left-0 top-0 origin-center touch-none ${
        dimmed ? 'pointer-events-none cursor-default' : 'cursor-grab active:cursor-grabbing'
      }`}
    >
      <Link
        href={href}
        draggable={false}
        className={`block text-left outline-none transition-[opacity,filter] duration-200 ${
          dimmed ? 'opacity-40 blur-lg' : selected ? 'opacity-100' : 'opacity-100'
        }`}
        aria-label={`${formatStampNumber(stamp.number)}, made by ${stamp.creator_name}. Drag to rearrange, click to open.`}
        aria-current={selected ? 'true' : undefined}
        onClick={(event) => {
          if (suppressClick.current) {
            event.preventDefault()
            event.stopPropagation()
            suppressClick.current = false
          }
        }}
        onDragStart={(event) => event.preventDefault()}
      >
        <div className="drop-shadow transition-[filter] duration-200 hover:drop-shadow-xl">
          {face === 'back' && stamp.message ? (
            <OpenBack stamp={stamp} />
          ) : (
            <StampPaper template={stamp.template} empty={!stamp.preview_url && !stamp.seed_art}>
              {stamp.preview_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={stamp.preview_url} alt="" className="h-full w-full object-cover" draggable={false} />
              ) : (
                <SeedArt kind={stamp.seed_art} />
              )}
            </StampPaper>
          )}
        </div>
        {isNew ? (
          <span className="absolute left-1/2 top-[72%] -translate-x-1/2 font-mono text-[11px] font-medium tracking-[0.16em] text-[#215cd9]">
            NEW
          </span>
        ) : null}
      </Link>
    </motion.div>
  )
}
