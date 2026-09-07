'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { PresenceLayer } from '@/components/presence/PresenceLayer'
import { listLocalStamps } from '@/lib/stamps/local'

export function SiteChrome({
  children,
}: {
  children: React.ReactNode
  count: number
  unsealed: boolean
}) {
  const pathname = usePathname()
  const [, setLocalCount] = useState(0)
  useEffect(() => {
    setLocalCount(listLocalStamps().length)
  }, [pathname])

  return (
    <>
      {children}
      <PresenceLayer />
    </>
  )
}
