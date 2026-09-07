'use client'

import { useEffect, useRef, useState } from 'react'
import {
  CURSOR_EVENT,
  loadPresenceIdentity,
  MAX_VISIBLE_PEERS,
  parseCursorPayload,
  parsePresenceMeta,
  PRESENCE_CHANNEL,
  resolvePresenceName,
  type PresenceIdentity,
  type PresencePeer,
} from '@/lib/presence'
import { createClient, type RealtimeChannel, type SupabaseClient } from '@supabase/supabase-js'
import { isSupabaseConfigured } from '@/lib/env'

const CURSOR_IDLE_MS = 4000
const SEND_INTERVAL_MS = 50

function createPresenceClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })
}

function flattenPresence(state: Record<string, unknown[]>, selfId: string) {
  const peers = new Map<string, PresencePeer>()
  for (const [key, entries] of Object.entries(state)) {
    if (key === selfId) continue
    for (const entry of entries) {
      const record = entry && typeof entry === 'object' ? (entry as Record<string, unknown>) : {}
      const meta = parsePresenceMeta({ ...record, id: typeof record.id === 'string' ? record.id : key })
      if (!meta || meta.id === selfId) continue
      peers.set(meta.id, {
        ...meta,
        x: null,
        y: null,
        lastCursorAt: 0,
      })
      if (peers.size >= MAX_VISIBLE_PEERS) return peers
    }
  }
  return peers
}

export function usePresence(enabled: boolean) {
  const [self, setSelf] = useState<PresenceIdentity | null>(null)
  const [peers, setPeers] = useState<PresencePeer[]>([])
  const peersRef = useRef(new Map<string, PresencePeer>())
  const channelRef = useRef<RealtimeChannel | null>(null)
  const selfRef = useRef<PresenceIdentity | null>(null)
  const lastSent = useRef({ x: -1, y: -1, at: 0 })
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    if (!enabled) return
    const supabase = createPresenceClient()
    if (!supabase) return

    const identity = loadPresenceIdentity()
    selfRef.current = identity
    setSelf(identity)

    const channel = supabase.channel(PRESENCE_CHANNEL, {
      config: {
        presence: { key: identity.id, enabled: true },
        broadcast: { self: false },
        private: false,
      },
    })
    channelRef.current = channel

    const commitPeers = () => {
      if (frameRef.current != null) return
      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null
        setPeers(Array.from(peersRef.current.values()).slice(0, MAX_VISIBLE_PEERS))
      })
    }

    const mergePresence = (state: Record<string, unknown[]>) => {
      const next = flattenPresence(state, identity.id)
      for (const [id, peer] of next) {
        const previous = peersRef.current.get(id)
        if (!previous) continue
        peer.x = previous.x
        peer.y = previous.y
        peer.lastCursorAt = previous.lastCursorAt
      }
      peersRef.current = next
      commitPeers()
    }

    channel
      .on('presence', { event: 'sync' }, () => {
        mergePresence(channel.presenceState() as Record<string, unknown[]>)
      })
      .on('broadcast', { event: CURSOR_EVENT }, ({ payload }) => {
        const cursor = parseCursorPayload(payload)
        if (!cursor || cursor.id === identity.id) return
        // Ignore cursors from strangers who never joined presence.
        const existing = peersRef.current.get(cursor.id)
        if (!existing) return
        peersRef.current.set(cursor.id, {
          ...existing,
          x: cursor.x,
          y: cursor.y,
          lastCursorAt: Date.now(),
        })
        commitPeers()
      })

    channel.subscribe((status) => {
      if (status !== 'SUBSCRIBED') return
      void channel.track({
        id: identity.id,
        name: resolvePresenceName(identity.id),
        color: identity.color,
      })
    })

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      const now = Date.now()
      if (now - lastSent.current.at < SEND_INTERVAL_MS) return
      const width = window.innerWidth || 1
      const height = window.innerHeight || 1
      const x = event.clientX / width
      const y = event.clientY / height
      if (Math.abs(x - lastSent.current.x) < 0.001 && Math.abs(y - lastSent.current.y) < 0.001) return
      lastSent.current = { x, y, at: now }
      void channel.send({
        type: 'broadcast',
        event: CURSOR_EVENT,
        payload: { id: identity.id, x, y },
      })
    }

    const pruneIdle = () => {
      const cutoff = Date.now() - CURSOR_IDLE_MS
      let changed = false
      for (const [id, peer] of peersRef.current) {
        if (peer.x == null || peer.lastCursorAt >= cutoff) continue
        peersRef.current.set(id, { ...peer, x: null, y: null })
        changed = true
      }
      if (changed) commitPeers()
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    const idleTimer = window.setInterval(pruneIdle, 1000)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.clearInterval(idleTimer)
      if (frameRef.current != null) window.cancelAnimationFrame(frameRef.current)
      channelRef.current = null
      void supabase.removeChannel(channel)
      void supabase.removeAllChannels()
    }
  }, [enabled])

  return { self, peers }
}
