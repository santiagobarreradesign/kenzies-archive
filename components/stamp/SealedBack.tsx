'use client'

import { StampPaper } from '@/components/stamp/StampPaper'
import { backChrome, canvasRadius } from '@/lib/stamp/geometry'
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
  const chrome = backChrome(id)
  const compact = chrome.compact

  return (
    <StampPaper template={id} paper="cream" className={className}>
      <div
        className="flex h-full min-h-0 w-full min-w-0 flex-col items-center justify-center border-[0.5px] border-dashed border-[#171717] bg-[var(--stamp-cream)] text-center"
        style={{ padding: chrome.padding, borderRadius: radius }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/sealed-mark.svg"
          alt=""
          width={32}
          height={32}
          className={compact ? 'mb-[0.35em] size-[16%] max-h-7 min-h-3 max-w-7' : 'mb-[0.45em] size-[20%] max-h-10 min-h-4 max-w-10'}
        />
        <p
          className={`w-full max-w-full break-words font-medium leading-tight text-balance text-[#171717] ${
            compact ? 'text-[clamp(6px,4.6cqmin,11px)]' : 'text-[clamp(8px,5.6cqmin,13px)]'
          }`}
        >
          Message sealed
        </p>
        <p
          className={`mt-[0.25em] w-full max-w-full break-words leading-tight text-pretty text-[#171717] ${
            compact ? 'text-[clamp(5px,3.6cqmin,9px)]' : 'text-[clamp(6px,4.4cqmin,11px)]'
          }`}
        >
          Opens on Kenzie’s birthday.
        </p>
        <p
          className={`mt-[0.4em] w-full max-w-full break-words font-mono font-medium text-[#e4462f] ${
            compact ? 'text-[clamp(4px,2.9cqmin,8px)] tracking-[0.04em]' : 'text-[clamp(5px,3.4cqmin,9px)] tracking-[0.06em]'
          }`}
        >
          SEALED · FOR KENZIE
        </p>
        <p className="sr-only">Opens {formatRevealDate()}.</p>
      </div>
    </StampPaper>
  )
}
