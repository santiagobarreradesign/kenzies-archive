export const PRESENCE_CHANNEL = 'kenzie-archive'
export const CURSOR_EVENT = 'cursor'
export const MAX_VISIBLE_PEERS = 12

/** Figma multiplayer chips first, then the rest of the site palette. */
export const PRESENCE_COLORS = [
  '#2563EB',
  '#7C3AED',
  '#E4462F',
  '#0F766E',
  '#DB2777',
  '#CA8A04',
  '#EA580C',
  '#1D4ED8',
] as const

const GUEST_NAMES = [
  'Airmail',
  'Postcard',
  'Parcel',
  'Postscript',
  'Special Delivery',
  'First Class',
  'Penny Post',
  'Love Letter',
]

export type PresenceIdentity = {
  id: string
  name: string
  color: string
}

export type PresenceMeta = {
  id: string
  name: string
  color: string
}

export type CursorPayload = {
  id: string
  x: number
  y: number
}

export type PresencePeer = PresenceMeta & {
  x: number | null
  y: number | null
  lastCursorAt: number
}

let pageIdentity: PresenceIdentity | null = null

function hashString(value: string) {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

export function colorForId(id: string) {
  return PRESENCE_COLORS[hashString(id) % PRESENCE_COLORS.length]
}

function guestNameForId(id: string) {
  return GUEST_NAMES[hashString(id) % GUEST_NAMES.length]
}

export function isPresenceId(value: unknown): value is string {
  return typeof value === 'string' && /^[a-zA-Z0-9_-]{8,64}$/.test(value)
}

/** Guest nicknames only — never broadcast draft creator names. */
export function formatPresenceName(value: string) {
  const trimmed = value
    .normalize('NFKC')
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
    .replace(/[<>&"'`]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  if (!trimmed) return ''
  return trimmed.length > 22 ? `${trimmed.slice(0, 21)}…` : trimmed
}

export function resolvePresenceName(id: string) {
  return guestNameForId(id)
}

export function loadPresenceIdentity(): PresenceIdentity {
  if (pageIdentity) return pageIdentity

  const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `tab-${Date.now()}`
  pageIdentity = {
    id,
    name: resolvePresenceName(id),
    color: colorForId(id),
  }
  return pageIdentity
}

export function parsePresenceMeta(value: unknown): PresenceMeta | null {
  if (!value || typeof value !== 'object') return null
  const record = value as Record<string, unknown>
  if (!isPresenceId(record.id)) return null
  const rawName = typeof record.name === 'string' ? record.name : ''
  return {
    id: record.id,
    // Prefer our deterministic guest nickname over attacker-supplied labels.
    name: resolvePresenceName(record.id) || formatPresenceName(rawName) || 'Visitor',
    color: (PRESENCE_COLORS as readonly string[]).includes(typeof record.color === 'string' ? record.color : '')
      ? (record.color as string)
      : colorForId(record.id),
  }
}

export function parseCursorPayload(value: unknown): CursorPayload | null {
  if (!value || typeof value !== 'object') return null
  const record = value as Record<string, unknown>
  if (!isPresenceId(record.id) || typeof record.x !== 'number' || typeof record.y !== 'number') return null
  if (!Number.isFinite(record.x) || !Number.isFinite(record.y)) return null
  return {
    id: record.id,
    x: Math.min(1, Math.max(0, record.x)),
    y: Math.min(1, Math.max(0, record.y)),
  }
}
