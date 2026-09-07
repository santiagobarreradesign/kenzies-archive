'use client'

import { useEffect, useState } from 'react'
import { Heading, Text } from '@medusajs/ui'
import { useReducedMotion } from 'motion/react'

const STEPS = ['SORTING MAIL...', 'ITEMS RECEIVED', 'DELIVERY CONFIRMED', 'OPENING ARCHIVE...']

export function BirthdayReveal({ count }: { count: number }) {
  const reduce = useReducedMotion()
  const [step, setStep] = useState(reduce ? STEPS.length : 0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.localStorage.getItem('kenzie-post-revealed') === '1') {
      setVisible(false)
      return
    }
    if (reduce) {
      window.localStorage.setItem('kenzie-post-revealed', '1')
      return
    }
    const interval = window.setInterval(() => {
      setStep((current) => {
        if (current >= STEPS.length) {
          window.clearInterval(interval)
          window.localStorage.setItem('kenzie-post-revealed', '1')
          window.setTimeout(() => setVisible(false), 700)
          return current
        }
        return current + 1
      })
    }, 700)
    return () => window.clearInterval(interval)
  }, [reduce])

  if (!visible) return null

  return (
    <section className="bg-ui-bg-base px-6 py-8 shadow-border">
      <Text size="xsmall" className="font-mono tracking-[0.18em] text-ui-fg-subtle">
        KENZIE POSTAL SERVICE
      </Text>
      <Heading level="h2" className="mt-3 font-display">
        {step >= STEPS.length ? 'The post has arrived.' : STEPS[Math.min(step, STEPS.length - 1)]}
      </Heading>
      <Text size="small" className="mt-2 font-mono tabular-nums text-ui-fg-muted">
        {count} ITEMS RECEIVED
      </Text>
    </section>
  )
}
