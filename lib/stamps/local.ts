import { buildStampSlug } from '@/lib/stamp/slug'
import { normalizeTemplate } from '@/lib/templates'
import type { StampComposition, StampRecord } from '@/types/stamp'

export const LOCAL_STAMPS_KEY = 'kenzie-post-local-stamps'

export type LocalStamp = StampRecord & { local?: boolean }

function canUseStorage() {
  return typeof window !== 'undefined'
}

export function listLocalStamps(): LocalStamp[] {
  if (!canUseStorage()) return []
  try {
    const raw = window.localStorage.getItem(LOCAL_STAMPS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as LocalStamp[]
    return Array.isArray(parsed) ? parsed.filter((stamp) => stamp?.id && stamp.local) : []
  } catch {
    return []
  }
}

export function getLocalStamp(slug: string) {
  return listLocalStamps().find((stamp) => stamp.slug === slug) ?? null
}

export function saveLocalStamp(input: {
  id: string
  creatorName: string
  creatorLocation: string
  message: string
  composition: StampComposition
  preview: string
  slug?: string
  number?: number | null
  local?: boolean
}): LocalStamp {
  const existing = listLocalStamps()
  const number = input.number ?? 100 + existing.length + 1
  const stamp: LocalStamp = {
    id: input.id,
    number,
    slug: input.slug || `local-${buildStampSlug(number, input.creatorName, input.creatorLocation)}`,
    creator_name: input.creatorName,
    creator_location: input.creatorLocation || null,
    message: input.message,
    template: normalizeTemplate(input.composition.template),
    denomination: input.composition.denomination,
    composition_json: input.composition,
    preview_url: input.preview,
    source_photo_path: null,
    status: 'approved',
    created_at: new Date().toISOString(),
    approved_at: new Date().toISOString(),
    opened_at: null,
    local: input.local !== false,
  }

  if (stamp.local) {
    const next = [stamp, ...existing.filter((item) => item.id !== stamp.id)].slice(0, 24)
    window.localStorage.setItem(LOCAL_STAMPS_KEY, JSON.stringify(next))
  }
  return stamp
}
