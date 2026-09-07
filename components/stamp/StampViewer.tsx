'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Text } from '@medusajs/ui'
import { motion, useReducedMotion } from 'motion/react'
import { CanvasSurface } from '@/components/postal/CanvasSurface'
import { OpenBack } from '@/components/stamp/OpenBack'
import { SealedBack } from '@/components/stamp/SealedBack'
import { StampPaper } from '@/components/stamp/StampPaper'
import { SeedArt } from '@/components/stamp/SeedArt'
import { formatStampNumber } from '@/lib/stamp/slug'
import type { StampRecord } from '@/types/stamp'

const EASE_OUT = [0.23, 1, 0.32, 1] as const
const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const
const ENTER_MS = 0.25
const FLIP_MS = 0.4
const PRESS_MS = 0.16

function FrontArt({ stamp }: { stamp: StampRecord }) {
  return (
    <StampPaper template={stamp.template} empty={!stamp.preview_url && !stamp.seed_art}>
      {stamp.preview_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={stamp.preview_url}
          alt={`Front of ${formatStampNumber(stamp.number)}`}
          className="h-full w-full object-cover"
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
  const [face, setFace] = useState<'back' | 'front'>('back')
  const [leaving, setLeaving] = useState(false)
  const showingBack = face === 'back'

  const dismiss = useCallback(() => {
    if (leaving) return
    setLeaving(true)
    window.setTimeout(() => router.push('/'), reduce ? 0 : ENTER_MS * 1000)
  }, [leaving, reduce, router])

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') dismiss()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [dismiss])

  function flip() {
    setFace((current) => (current === 'back' ? 'front' : 'back'))
  }

  const enterTransition = { duration: reduce ? 0 : ENTER_MS, ease: EASE_OUT }
  const flipTransition = { duration: reduce ? 0 : FLIP_MS, ease: EASE_IN_OUT }

  return (
    <div className="relative min-h-dvh">
      <CanvasSurface context="flow">
        <div className="flex min-h-dvh cursor-default items-center justify-center px-6 py-24" onClick={dismiss}>
          <motion.div
            className="flex w-[min(100%,420px)] flex-col items-center"
            initial={reduce ? { opacity: 0 } : { opacity: 0, transform: 'scale(0.96)' }}
            animate={
              leaving
                ? reduce
                  ? { opacity: 0 }
                  : { opacity: 0, transform: 'scale(0.96)' }
                : { opacity: 1, transform: 'scale(1)' }
            }
            transition={enterTransition}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="w-full" style={{ perspective: reduce ? undefined : 1400 }}>
              {reduce ? (
                <button
                  type="button"
                  aria-label={showingBack ? 'Show front of stamp' : 'Show back of stamp'}
                  onClick={flip}
                  className="w-full cursor-pointer border-0 bg-transparent p-0"
                >
                  {showingBack ? <BackArt stamp={stamp} unsealed={unsealed} /> : <FrontArt stamp={stamp} />}
                </button>
              ) : (
                <motion.button
                  type="button"
                  aria-label={showingBack ? 'Show front of stamp' : 'Show back of stamp'}
                  onClick={flip}
                  whileTap={{ transform: 'scale(0.97)' }}
                  transition={{ duration: PRESS_MS, ease: EASE_OUT }}
                  className="block w-full cursor-pointer border-0 bg-transparent p-0"
                >
                  <motion.div
                    className="relative aspect-square w-full"
                    style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
                    initial={false}
                    animate={{ transform: showingBack ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                    transition={flipTransition}
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(0deg) translateZ(1px)',
                      }}
                    >
                      <FrontArt stamp={stamp} />
                    </div>
                    <div
                      className="absolute inset-0"
                      style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg) translateZ(1px)',
                      }}
                    >
                      <BackArt stamp={stamp} unsealed={unsealed} />
                    </div>
                  </motion.div>
                </motion.button>
              )}
            </div>
            <Text
              size="xsmall"
              className="mt-6 text-center font-mono tracking-[0.12em] text-[#8a8275]"
            >
              {showingBack ? 'Click to see the front' : 'Click to see the back'}
            </Text>
            <Text className="mt-2 text-center font-mono text-[12px] text-[#75736b]">
              Click outside to return
            </Text>
          </motion.div>
        </div>
      </CanvasSurface>
    </div>
  )
}
