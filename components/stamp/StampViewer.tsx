'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Text } from '@medusajs/ui'
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type PanInfo,
} from 'motion/react'
import { CanvasSurface } from '@/components/postal/CanvasSurface'
import { OpenBack } from '@/components/stamp/OpenBack'
import { SealedBack } from '@/components/stamp/SealedBack'
import { StampPaper } from '@/components/stamp/StampPaper'
import { SeedArt } from '@/components/stamp/SeedArt'
import { formatStampNumber } from '@/lib/stamp/slug'
import type { StampRecord } from '@/types/stamp'

const EASE_OUT = [0.23, 1, 0.32, 1] as const
const EASE_FLIP = [0.4, 0, 0.2, 1] as const
const ENTER_MS = 0.28
const HALF_FLIP_MS = 0.16
const TAP_THRESHOLD = 10
const SETTLE = { type: 'spring' as const, stiffness: 280, damping: 24, bounce: 0.18 }
const LIFT = { type: 'spring' as const, stiffness: 420, damping: 28, bounce: 0 }
const TILT = { stiffness: 140, damping: 16, mass: 0.6 }

function FrontArt({ stamp }: { stamp: StampRecord }) {
  return (
    <StampPaper template={stamp.template} empty={!stamp.preview_url && !stamp.seed_art}>
      {stamp.preview_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={stamp.preview_url}
          alt={`Front of ${formatStampNumber(stamp.number)}`}
          className="h-full w-full object-cover"
          draggable={false}
        />
      ) : (
        <SeedArt kind={stamp.seed_art} />
      )}
    </StampPaper>
  )
}

function BackArt({ stamp, unsealed }: { stamp: StampRecord; unsealed: boolean }) {
  if (unsealed && stamp.message) return <OpenBack stamp={stamp} />
  return <SealedBack template={stamp.template} />
}

export function StampViewer({ stamp, unsealed }: { stamp: StampRecord; unsealed: boolean }) {
  const router = useRouter()
  const reduce = useReducedMotion()
  const constraintsRef = useRef<HTMLDivElement | null>(null)
  const draggingRef = useRef(false)
  const movedRef = useRef(false)
  const suppressDismissRef = useRef(false)
  const busyRef = useRef(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const flipX = useMotionValue(1)
  const tilt = useSpring(0, TILT)
  const lift = useSpring(1, LIFT)

  const [face, setFace] = useState<'back' | 'front'>('back')
  const [leaving, setLeaving] = useState(false)
  const [dragging, setDragging] = useState(false)
  const showingBack = face === 'back'

  const settleHome = useCallback(() => {
    void animate(x, 0, SETTLE)
    void animate(y, 0, SETTLE)
    tilt.set(0)
    lift.set(1)
  }, [lift, tilt, x, y])

  const dismiss = useCallback(() => {
    if (busyRef.current || draggingRef.current || suppressDismissRef.current) return
    busyRef.current = true
    setLeaving(true)
    window.setTimeout(() => router.push('/'), reduce ? 0 : ENTER_MS * 1000)
  }, [reduce, router])

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') dismiss()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [dismiss])

  async function flip() {
    if (busyRef.current || leaving) return
    if (reduce) {
      setFace((current) => (current === 'back' ? 'front' : 'back'))
      return
    }

    busyRef.current = true
    try {
      await animate(flipX, 0, { duration: HALF_FLIP_MS, ease: EASE_FLIP })
      setFace((current) => (current === 'back' ? 'front' : 'back'))
      await animate(flipX, 1, { duration: HALF_FLIP_MS, ease: EASE_FLIP })
    } finally {
      busyRef.current = false
    }
  }

  function onDragStart() {
    if (busyRef.current || reduce || leaving) return
    if (draggingRef.current) return
    draggingRef.current = true
    movedRef.current = false
    setDragging(true)
    lift.set(1.045)
  }

  function onDrag(_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    if (!draggingRef.current) return
    if (Math.hypot(info.offset.x, info.offset.y) > TAP_THRESHOLD) movedRef.current = true
    const next = info.offset.x * 0.06 + info.velocity.x * 0.008
    tilt.set(Math.max(-18, Math.min(18, next)))
  }

  function onDragEnd(_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    draggingRef.current = false
    setDragging(false)
    lift.set(1)

    const distance = Math.hypot(info.offset.x, info.offset.y)
    const wasDrag = movedRef.current || distance >= TAP_THRESHOLD

    if (wasDrag) {
      suppressDismissRef.current = true
      window.setTimeout(() => {
        suppressDismissRef.current = false
        movedRef.current = false
      }, 120)
    } else {
      movedRef.current = false
    }

    if (info.offset.y > 90 && (info.velocity.y > 400 || distance > 140)) {
      busyRef.current = true
      setLeaving(true)
      void animate(y, 220, { type: 'spring', stiffness: 200, damping: 28, bounce: 0 })
      void animate(lift, 0.96, LIFT)
      window.setTimeout(() => router.push('/'), 220)
      return
    }

    settleHome()
  }

  const enterTransition = { duration: reduce ? 0 : ENTER_MS, ease: EASE_OUT }

  return (
    <div className="relative min-h-dvh">
      <CanvasSurface context="flow" allowOverflow>
        <div
          ref={constraintsRef}
          className="flex min-h-dvh cursor-default items-center justify-center px-4 py-16 lg:px-6 lg:py-24"
          onClick={dismiss}
        >
          <motion.div
            className="flex w-[min(100%,min(420px,calc(100vw-2rem)))] flex-col items-center"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 10 }}
            animate={
              leaving
                ? reduce
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.97, y: 12 }
                : { opacity: 1, scale: 1, y: 0 }
            }
            transition={enterTransition}
            onClick={(event) => event.stopPropagation()}
          >
            <motion.div
              role="button"
              tabIndex={0}
              aria-label={showingBack ? 'Show front of stamp' : 'Show back of stamp'}
              drag={!reduce && !leaving}
              dragConstraints={constraintsRef}
              dragElastic={0.18}
              dragMomentum
              dragTransition={{ power: 0.25, timeConstant: 220 }}
              onDragStart={onDragStart}
              onDrag={onDrag}
              onDragEnd={onDragEnd}
              onTap={() => {
                if (movedRef.current) return
                void flip()
              }}
              onClick={(event) => event.stopPropagation()}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  void flip()
                }
              }}
              style={{ x, y, rotate: tilt, scale: lift, touchAction: 'none' }}
              className={`w-full select-none border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-[#2e2b26]/30 ${
                dragging ? 'cursor-grabbing' : 'cursor-grab'
              }`}
            >
              <motion.div
                className="w-full"
                style={{
                  scaleX: flipX,
                  transformOrigin: 'center center',
                  filter: dragging
                    ? 'drop-shadow(0 18px 28px rgba(46, 43, 38, 0.22))'
                    : 'drop-shadow(0 8px 16px rgba(46, 43, 38, 0.12))',
                  transition: 'filter 160ms cubic-bezier(0.23, 1, 0.32, 1)',
                }}
              >
                {showingBack ? <BackArt stamp={stamp} unsealed={unsealed} /> : <FrontArt stamp={stamp} />}
              </motion.div>
            </motion.div>

            <Text size="xsmall" className="mt-5 px-2 text-center font-mono tracking-[0.12em] text-[#8a8275]">
              {dragging
                ? 'Release to settle'
                : showingBack
                  ? 'Drag freely · tap to see the front'
                  : 'Drag freely · tap to see the back'}
            </Text>
            <Text className="mt-2 px-2 text-center font-mono text-[11px] text-[#75736b] lg:text-[12px]">
              Flick down to leave · tap outside to return
            </Text>
          </motion.div>
        </div>
      </CanvasSurface>
    </div>
  )
}
