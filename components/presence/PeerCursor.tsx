'use client'

import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useReducedMotion } from 'motion/react'
import type { PresencePeer } from '@/lib/presence'

export function PeerCursor({ peer }: { peer: PresencePeer }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const target = useRef({ x: 0, y: 0 })
  const primed = useRef(false)
  const reduceMotion = useReducedMotion()
  const visible = peer.x != null && peer.y != null
  const flipped = (peer.x ?? 0) > 0.78

  useEffect(() => {
    if (peer.x == null || peer.y == null) return
    target.current = {
      x: peer.x * window.innerWidth,
      y: peer.y * window.innerHeight,
    }
    if (!primed.current || reduceMotion) {
      x.set(target.current.x)
      y.set(target.current.y)
      primed.current = true
    }
  }, [peer.x, peer.y, reduceMotion, x, y])

  useEffect(() => {
    if (reduceMotion) return
    let frame = 0
    const tick = () => {
      x.set(x.get() + (target.current.x - x.get()) * 0.32)
      y.set(y.get() + (target.current.y - y.get()) * 0.32)
      frame = window.requestAnimationFrame(tick)
    }
    frame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame)
  }, [reduceMotion, x, y])

  return (
    <motion.div
      className="pointer-events-none absolute left-0 top-0"
      style={{ x, y, zIndex: 1 }}
      initial={{ opacity: 0, scale: 0.25, filter: 'blur(4px)' }}
      animate={{
        opacity: visible ? 1 : 0,
        scale: visible ? 1 : 0.25,
        filter: visible ? 'blur(0px)' : 'blur(4px)',
      }}
      exit={{ opacity: 0, scale: 0.25, filter: 'blur(4px)' }}
      transition={{ type: 'spring', duration: 0.3, bounce: 0 }}
    >
      <div
        className={`relative flex flex-col gap-2 pt-3 ${flipped ? 'items-end pr-3' : 'items-start pl-3'}`}
        style={{ transform: flipped ? 'translateX(-100%)' : undefined }}
      >
        <div
          className="relative z-0 flex items-center justify-center overflow-hidden rounded-full px-2.5 py-1 text-white"
          style={{
            backgroundColor: peer.color,
            boxShadow: '0px 0px 0px 1px rgba(3, 7, 18, 0.08), 0px 8px 16px rgba(3, 7, 18, 0.08)',
          }}
        >
          <span className="whitespace-nowrap text-center text-[13px] font-medium leading-5">{peer.name}</span>
        </div>
        <div
          className={`presence-cursor-glyph absolute top-0 ${flipped ? 'right-0 -scale-x-100' : 'left-0'}`}
          style={{ color: peer.color }}
          aria-hidden
        />
      </div>
    </motion.div>
  )
}
