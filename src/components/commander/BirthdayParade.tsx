import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const BEATS = [
  'Attention all units.',
  'Formation.',
  'The army marches for its Commander.',
  'LONG LIVE KENZIE',
  'HAPPY BIRTHDAY, COMMANDER.',
]

export function BirthdayParade({ onClose }: { onClose: () => void }) {
  const [beat, setBeat] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setBeat((current) => Math.min(current + 1, BEATS.length - 1))
    }, 1800)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="parade-overlay">
      <AnimatePresence mode="wait" initial={false}>
        <motion.h2
          key={beat}
          className="display"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ type: 'spring', duration: 0.35, bounce: 0 }}
        >
          {BEATS[beat]}
        </motion.h2>
      </AnimatePresence>
      <button className="btn btn-gold" type="button" onClick={onClose}>
        Return to headquarters
      </button>
    </div>
  )
}
