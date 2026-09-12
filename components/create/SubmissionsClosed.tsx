import Link from 'next/link'
import { Button, Heading, Text } from '@medusajs/ui'
import { PostalShell, SIDEBAR_COPY, SIDEBAR_FRAME, SIDEBAR_TITLE } from '@/components/postal/PostalShell'

export function SubmissionsClosed() {
  const sidebar = (
    <div className={SIDEBAR_FRAME}>
      <Text size="small" className="font-mono text-[12px] text-[#5c574f] lg:text-[13px]">
        kenziepost / closed
      </Text>
      <Heading level="h1" className={SIDEBAR_TITLE}>
        The desk is closed.
      </Heading>
      <Text className={SIDEBAR_COPY}>
        The archive is no longer taking new stamps. Everything that was posted is already waiting for Kenzie.
      </Text>
      <div className="mt-6 flex flex-wrap items-center gap-3 pt-2 lg:mt-auto lg:pt-10">
        <Button asChild>
          <Link href="/">Return to the archive</Link>
        </Button>
      </div>
    </div>
  )

  return (
    <PostalShell sidebar={sidebar} sidebarWidth={470} context="archive" showBinder>
      <div className="flex h-full min-h-0 items-center justify-center px-5 py-10 lg:px-10">
        <Text className="max-w-md font-serif text-xl leading-snug text-[#2e2b26] lg:text-2xl">
          No more letters. The collection is complete.
        </Text>
      </div>
    </PostalShell>
  )
}
