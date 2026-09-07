'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { listLocalStamps } from '@/lib/stamps/local'

export function SiteChrome({
  children,
}: {
  children: React.ReactNode
  count: number
  unsealed: boolean
}) {
  const pathname = usePathname()
  const framed =
    pathname === '/' ||
    pathname.startsWith('/create') ||
    pathname.startsWith('/stamp') ||
    pathname.startsWith('/admin') ||
    pathname === '/about'

  const [, setLocalCount] = useState(0)
  useEffect(() => {
    setLocalCount(listLocalStamps().length)
  }, [pathname])

  if (framed) return <>{children}</>
  return <>{children}</>
}
