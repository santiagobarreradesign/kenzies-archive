import Link from 'next/link'
import { Button, Heading, Text } from '@medusajs/ui'
import { PostalShell, SIDEBAR_COPY, SIDEBAR_FRAME, SIDEBAR_TITLE } from '@/components/postal/PostalShell'

export default function AboutPage() {
  const sidebar = (
    <div className={SIDEBAR_FRAME}>
      <Text size="small" className="font-mono text-[12px] text-[#5c574f] lg:text-[13px]">
        kenziepost / about
      </Text>
      <Heading level="h1" className={SIDEBAR_TITLE}>
        A special commemorative archive
      </Heading>
      <div className={`${SIDEBAR_COPY} space-y-3 lg:space-y-4`}>
        <Text>
          There is a tiny postal service dedicated exclusively to delivering things to Kenzie. For her birthday it has
          opened this archive. Friends may create one piece of postage. Every stamp is issued once, numbered, signed, and
          postmarked.
        </Text>
        <Text>
          The front is a small collectible. The back is something she can keep. Before the birthday, artwork may be seen.
          Messages remain sealed.
        </Text>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-3 pt-2 lg:mt-auto lg:pt-10">
        <Button asChild variant="transparent" size="small">
          <Link href="/">Back</Link>
        </Button>
        <Button asChild>
          <Link href="/create">Create a stamp</Link>
        </Button>
      </div>
    </div>
  )

  return (
    <PostalShell sidebar={sidebar} sidebarWidth={470} context="archive" showBinder>
      <div className="flex h-full min-h-0 items-center justify-center px-5 py-10 lg:px-10">
        <Text className="max-w-md font-serif text-xl leading-snug text-[#2e2b26] lg:text-2xl">
          A collection of little things made by people who love you.
        </Text>
      </div>
    </PostalShell>
  )
}
