import { getStampBySlug } from '@/lib/stamps/data'
import { StampPageClient } from '@/components/stamp/StampPageClient'

export default async function StampPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { stamp, unsealed } = await getStampBySlug(slug)

  return <StampPageClient slug={slug} stamp={stamp} unsealed={unsealed} />
}
