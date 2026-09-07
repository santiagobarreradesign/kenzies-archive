import { ArchiveView } from '@/components/archive/ArchiveView'
import { getArchiveContext } from '@/lib/stamps/data'

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ posted?: string }>
}) {
  const { posted } = await searchParams
  const { stamps, unsealed, count } = await getArchiveContext()
  return <ArchiveView stamps={stamps} unsealed={unsealed} count={count} highlightSlug={posted} />
}
