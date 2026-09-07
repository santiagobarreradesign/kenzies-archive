'use client'

import type { KeyboardEvent, ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'

export function FlipHint({
  flipped,
  onFlip,
  disabled = false,
  children,
}: {
  flipped: boolean
  onFlip: () => void
  disabled?: boolean
  children: ReactNode
}) {
  const reduce = useReducedMotion()

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (disabled) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onFlip()
    }
  }

  return (
    <div className="space-y-3">
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-pressed={flipped}
        aria-label={flipped ? 'Show front of stamp' : 'Flip stamp'}
        onClick={disabled ? undefined : onFlip}
        onKeyDown={onKeyDown}
        className="mx-auto w-full max-w-sm cursor-pointer outline-none transition-transform duration-150 ease-out focus-visible:shadow-buttons-neutral-focus active:scale-[0.96]"
      >
        {children}
      </div>
      <p className="flex items-center justify-center gap-1.5 font-mono text-[11px] tracking-[0.16em] text-ui-fg-muted">
        <span>{flipped ? 'show front' : 'flip'}</span>
        <motion.span
          aria-hidden
          className="inline-block"
          animate={reduce || disabled ? undefined : { x: [0, 4, 0] }}
          transition={reduce ? { duration: 0 } : { duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          →
        </motion.span>
      </p>
    </div>
  )
}
