'use client'

import { AnimatePresence } from 'motion/react'
import { usePathname } from 'next/navigation'
import { PeerCursor } from '@/components/presence/PeerCursor'
import { usePresence } from '@/hooks/use-presence'
import { MAX_VISIBLE_PEERS, type PresenceIdentity, type PresencePeer } from '@/lib/presence'

function VisitingChip({ self, peers }: { self: PresenceIdentity; peers: PresencePeer[] }) {
  const cappedPeers = peers.slice(0, MAX_VISIBLE_PEERS)
  const visitors = [self, ...cappedPeers]
  const extra = visitors.length - 4
  const shown = visitors.slice(0, extra > 0 ? 3 : 4)
  const label =
    cappedPeers.length === 0 ? "You're here" : visitors.length === 2 ? '2 visiting' : `${visitors.length} visiting`

  return (
    <div
      data-presence-count={visitors.length}
      className="pointer-events-none fixed right-4 top-3 z-[90] flex items-center gap-2 rounded-full bg-white/95 px-2 py-1 shadow-[0_0_0_1px_rgba(3,7,18,0.08),0_8px_16px_rgba(3,7,18,0.08)] backdrop-blur-sm lg:right-8 lg:top-6"
    >
      <div className="flex items-center pl-0.5">
        {shown.map((visitor, index) => (
          <span
            key={visitor.id}
            className="inline-block size-2.5 rounded-full ring-2 ring-white"
            style={{
              backgroundColor: visitor.color,
              marginLeft: index === 0 ? 0 : -4,
            }}
            title={visitor.name}
          />
        ))}
        {extra > 0 ? (
          <span className="ml-1 font-mono text-[10px] tabular-nums text-[#8a8275]">+{extra}</span>
        ) : null}
      </div>
      <span className="pr-1 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-[#5c574f]">
        {label}
      </span>
    </div>
  )
}

export function PresenceLayer() {
  const pathname = usePathname()
  const enabled = !pathname.startsWith('/admin')
  const { self, peers } = usePresence(enabled)

  if (!enabled || !self) return null

  return (
    <>
      <VisitingChip self={self} peers={peers} />
      <div className="pointer-events-none fixed inset-0 z-[80] overflow-hidden" aria-hidden>
        <AnimatePresence>
          {peers.map((peer) => (
            <PeerCursor key={peer.id} peer={peer} />
          ))}
        </AnimatePresence>
      </div>
    </>
  )
}
