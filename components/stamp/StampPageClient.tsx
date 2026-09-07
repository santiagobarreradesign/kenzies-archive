'use client'

import Link from 'next/link'
import { Button, Heading, Text } from '@medusajs/ui'
import { StampViewer } from '@/components/stamp/StampViewer'
import { getLocalStamp } from '@/lib/stamps/local'
import { useEffect, useState } from 'react'
import type { StampRecord } from '@/types/stamp'

export function StampPageClient({
  slug,
  stamp,
  unsealed,
}: {
  slug: string
  stamp: StampRecord | null
  unsealed: boolean
}) {
  const [local, setLocal] = useState<StampRecord | null>(null)
  const [checked, setChecked] = useState(!stamp ? false : true)

  useEffect(() => {
    if (stamp) return
    setLocal(getLocalStamp(slug))
    setChecked(true)
  }, [slug, stamp])

  const current = stamp ?? local
  if (!current) {
    if (!checked) return null
    return (
      <div className="space-y-4 px-5 py-10 lg:px-8 lg:py-12">
        <Heading>This piece of mail could not be found.</Heading>
        <Text className="text-ui-fg-muted">It may still be pending inspection, or the number was never issued.</Text>
        <Button asChild>
          <Link href="/">Return to archive</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="absolute left-4 top-4 z-30 lg:left-9 lg:top-6">
        <Button asChild variant="transparent" size="small">
          <Link href="/">← Return to archive</Link>
        </Button>
      </div>
      {current.local ? (
        <Text size="small" className="absolute right-4 top-5 z-30 max-w-[40%] text-right font-mono text-ui-fg-muted lg:right-8 lg:top-7 lg:max-w-none">
          Held on this browser
        </Text>
      ) : null}
      <StampViewer stamp={current} unsealed={unsealed || Boolean(current.local)} />
    </div>
  )
}
