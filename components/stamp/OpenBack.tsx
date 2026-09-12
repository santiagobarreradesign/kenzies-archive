'use client'

import { StampPaper } from '@/components/stamp/StampPaper'
import { backChrome, canvasRadius } from '@/lib/stamp/geometry'
import { formatPostmarkDate } from '@/lib/reveal'
import { normalizeTemplate } from '@/lib/templates'
import type { StampRecord } from '@/types/stamp'

export function StampBackFace({
  template,
  name,
  location,
  message,
  postmark,
  className = '',
}: {
  template: string
  name: string
  location?: string | null
  message: string
  postmark?: string
  className?: string
}) {
  const id = normalizeTemplate(template)
  const radius = canvasRadius(id)
  const chrome = backChrome(id)
  const compact = chrome.compact
  const centered = chrome.align === 'center'
  const tight = id === 'panoramic'
  const kicker =
    chrome.header === 'short' ? 'FOR KENZIE' : chrome.header === 'stacked' ? 'POSTMARKED\nFOR KENZIE' : 'POSTMARKED FOR KENZIE'

  return (
    <StampPaper template={id} paper="cream" className={className}>
      <div
        className={`flex h-full min-h-0 w-full min-w-0 flex-col bg-[var(--stamp-cream)] ${
          centered ? 'items-center text-center' : 'text-left'
        }`}
        style={{ padding: chrome.padding, borderRadius: radius }}
      >
        <p
          className={`w-full max-w-full whitespace-pre-line break-words font-mono text-pretty text-[#8a8275] ${
            compact ? 'text-[clamp(6px,3.4cqmin,9px)] tracking-[0.08em]' : 'text-[clamp(7px,3.6cqmin,10px)] tracking-[0.12em]'
          }`}
        >
          {kicker}
        </p>
        <p
          className={`w-full max-w-full break-words font-medium text-balance text-[#171717] ${
            tight ? 'mt-[0.2em]' : 'mt-[0.35em]'
          } ${compact ? 'text-[clamp(8px,5.2cqmin,15px)]' : 'text-[clamp(11px,6cqmin,18px)]'}`}
        >
          {name}
        </p>
        {location ? (
          <p
            className={`w-full max-w-full break-words text-[#59574f] ${
              compact ? 'text-[clamp(6px,3.6cqmin,11px)]' : 'text-[clamp(8px,4.2cqmin,13px)]'
            }`}
          >
            {location}
          </p>
        ) : null}
        <p
          className={`stamp-back-copy mt-[0.45em] min-h-0 min-w-0 w-full flex-1 overflow-x-hidden overflow-y-auto break-words text-pretty text-[#2e2b26] ${
            tight ? 'mt-[0.28em] leading-[1.28]' : compact ? 'leading-[1.32]' : 'leading-[1.4]'
          } ${compact ? 'text-[clamp(7px,4.3cqmin,13px)]' : 'text-[clamp(9px,4.7cqmin,15px)]'}`}
        >
          {message}
        </p>
        {postmark ? (
          <p
            className={`mt-auto w-full max-w-full break-words pt-[0.35em] font-mono text-[#8a8275] ${
              compact ? 'text-[clamp(5px,2.9cqmin,8px)] tracking-[0.08em]' : 'text-[clamp(6px,3.2cqmin,9px)] tracking-[0.1em]'
            }`}
          >
            POSTMARKED {postmark}
          </p>
        ) : null}
      </div>
    </StampPaper>
  )
}

export function OpenBack({
  stamp,
  className = '',
}: {
  stamp: StampRecord
  className?: string
}) {
  return (
    <StampBackFace
      template={stamp.template}
      name={stamp.creator_name}
      location={stamp.creator_location}
      message={stamp.message}
      postmark={formatPostmarkDate(stamp.approved_at)}
      className={className}
    />
  )
}
