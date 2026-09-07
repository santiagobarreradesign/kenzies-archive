import Link from 'next/link'
import { Button, Heading, Text } from '@medusajs/ui'
import { PostalShell } from '@/components/postal/PostalShell'

export default function AboutPage() {
  const sidebar = (
    <div className="flex h-full min-h-dvh flex-col px-12 py-8">
      <Text size="small" className="font-mono text-[13px] text-[#5c574f]">
        kenziepost / about
      </Text>
      <Heading level="h1" className="mt-10 font-serif text-[42px] font-medium leading-[50px] text-[#2e2b26]">
        A special commemorative archive
      </Heading>
      <div className="mt-6 max-w-[360px] space-y-4 text-[16px] leading-[25px] text-[#59574f]">
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
      <div className="mt-auto space-y-3 pt-10">
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
      <div className="flex min-h-dvh items-center justify-center px-10">
        <Text className="max-w-md font-serif text-2xl leading-snug text-[#2e2b26]">
          A collection of little things made by people who love you.
        </Text>
      </div>
    </PostalShell>
  )
}
