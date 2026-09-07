'use client'

import { StampPaper } from '@/components/stamp/StampPaper'
import { canvasRadius } from '@/lib/stamp/geometry'
import { formatPostmarkDate } from '@/lib/reveal'
import { normalizeTemplate } from '@/lib/templates'
import type { StampRecord } from '@/types/stamp'

export function OpenBack({
  stamp,
  className = '',
}: {
  stamp: StampRecord
  className?: string
}) {
  const id = normalizeTemplate(stamp.template)
  const radius = canvasRadius(id)
  const compact = id === 'tall' || id === 'panoramic' || id === 'pickle'

  return (
    <StampPaper template={id} paper="cream" className={className}>
      <div
        className={`flex h-full w-full flex-col bg-[var(--stamp-cream)] text-left ${compact ? 'p-[8%]' : 'p-[12%]'}`}
        style={{ borderRadius: radius }}
      >
        <p className={`font-mono tracking-[0.14em] text-[#8a8275] ${compact ? 'text-[clamp(4px,4cqw,9px)]' : 'text-[clamp(7px,5cqw,10px)]'}`}>
          POSTMARKED FOR KENZIE
        </p>
        <p className={`mt-[0.4em] font-medium text-[#171717] ${compact ? 'text-[clamp(6px,6cqw,14px)]' : 'text-[clamp(10px,7cqw,16px)]'}`}>
          {stamp.creator_name}
        </p>
        {stamp.creator_location ? (
          <p className={`text-[#59574f] ${compact ? 'text-[clamp(5px,4.5cqw,11px)]' : 'text-[clamp(8px,5.5cqw,12px)]'}`}>
            {stamp.creator_location}
          </p>
        ) : null}
        <p
          className={`mt-[0.6em] flex-1 overflow-hidden leading-relaxed text-[#2e2b26] ${compact ? 'text-[clamp(5px,5cqw,12px)]' : 'text-[clamp(9px,6cqw,13px)]'}`}
        >
          {stamp.message}
        </p>
        <p className={`mt-[0.6em] font-mono tracking-[0.12em] text-[#8a8275] ${compact ? 'text-[clamp(3px,3.5cqw,8px)]' : 'text-[clamp(6px,4.5cqw,9px)]'}`}>
          POSTMARKED {formatPostmarkDate(stamp.approved_at)}
        </p>
      </div>
    </StampPaper>
  )
}
