'use client'

import { useEffect, useState } from 'react'

/** Same breakpoints as marijanapav.com/stamps: Tailwind `lg` = 1024px, `sm` = 640px. */
export function useMatchMedia(query: string, defaultState = false) {
  const [matches, setMatches] = useState(defaultState)

  useEffect(() => {
    const media = window.matchMedia(query)
    const onChange = () => setMatches(media.matches)
    onChange()
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [query])

  return matches
}

export function useIsMobile(defaultState = false) {
  return useMatchMedia('(max-width: 1023px)', defaultState)
}

export function useIsMobileSmall(defaultState = false) {
  return useMatchMedia('(max-width: 639px)', defaultState)
}

export function stampScale(isMobile: boolean, isMobileSmall: boolean) {
  if (isMobileSmall) return 0.6
  if (isMobile) return 0.8
  return 1
}
