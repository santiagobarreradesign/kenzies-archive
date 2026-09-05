import { useEffect, useState } from 'react'
import { lineForDivision } from '../lib/dialogue'
import type { Recruit } from '../lib/types'

export function useArmyDialogue(recruits: Recruit[], enabled: boolean) {
  const [active, setActive] = useState<{ id: string; line: string } | null>(null)

  useEffect(() => {
    if (!enabled || recruits.length === 0) return undefined

    const speak = () => {
      const recruit = recruits[Math.floor(Math.random() * recruits.length)]
      if (!recruit) return
      setActive({ id: recruit.id, line: lineForDivision(recruit.division) })
      window.setTimeout(() => setActive(null), 2500)
    }

    const first = window.setTimeout(speak, 1800)
    const timer = window.setInterval(speak, 5500)
    return () => {
      window.clearTimeout(first)
      window.clearInterval(timer)
    }
  }, [enabled, recruits])

  return active
}
