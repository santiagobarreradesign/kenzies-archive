'use client'

import { StampPaper } from '@/components/stamp/StampPaper'
import { canvasRadius } from '@/lib/stamp/geometry'
import { formatRevealDate } from '@/lib/reveal'
import { normalizeTemplate } from '@/lib/templates'
import type { StampTemplate } from '@/types/stamp'

export function SealedBack({
  template,
  className = '',
}: {
  template: StampTemplate | string
  className?: string
}) {
  const id = normalizeTemplate(template)
  const radius = canvasRadius(id)
  const compact = id === 'tall' || id === 'panoramic' || id === 'pickle'

  return (
    <StampPaper template={id} paper="cream" className={className}>
      <div
        className="flex h-full w-full flex-col items-center justify-center gap-[0.35em] border-[0.5px] border-dashed border-[#171717] bg-[var(--stamp-cream)] px-[8%] py-[10%] text-center"
        style={{ borderRadius: radius }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/sealed-mark.svg"
          alt=""
          width={32}
          height={32}
          className={compact ? 'size-[18%] max-h-8 min-h-3 max-w-8' : 'size-[22%] max-h-10 min-h-4 max-w-10'}
        />
        <p className={`font-medium leading-tight text-[#171717] ${compact ? 'text-[clamp(5px,5.5cqw,11px)]' : 'text-[clamp(7px,7cqw,12px)]'}`}>
          Message sealed
        </p>
        <p className={`leading-tight text-[#171717] ${compact ? 'text-[clamp(4px,4.2cqw,9px)]' : 'text-[clamp(6px,5.5cqw,10px)]'}`}>
          Opens on Kenzie’s birthday.
        </p>
        <p
          className={`font-mono font-medium tracking-[0.06em] text-[#e4462f] ${compact ? 'text-[clamp(3px,3.5cqw,8px)]' : 'text-[clamp(5px,4.5cqw,9px)]'}`}
        >
          SEALED · FOR KENZIE
        </p>
        <p className="sr-only">Opens {formatRevealDate()}.</p>
      </div>
    </StampPaper>
  )
}
