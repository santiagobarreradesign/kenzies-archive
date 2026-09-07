import { createAdminSupabase } from '@/lib/supabase/admin'
import { createServerSupabase } from '@/lib/supabase/server'
import { isArchiveUnsealed } from '@/lib/reveal'
import { SEED_STAMPS, sealStamps } from '@/lib/stamps/seed'
import { normalizeTemplate } from '@/lib/templates'
import type { StampRecord, StampStatus } from '@/types/stamp'

type StampRow = {
  id: string
  number: number | null
  slug: string
  creator_name: string
  creator_location: string | null
  message: string
  template: string
  denomination: string
  composition_json: StampRecord['composition_json']
  preview_path: string | null
  source_photo_path: string | null
  status: StampStatus
  created_at: string
  approved_at: string | null
  opened_at: string | null
}

function publicPreviewUrl(path: string | null) {
  if (!path || !process.env.NEXT_PUBLIC_SUPABASE_URL) return null
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/stamps/${path}`
}

function mapRow(row: StampRow, unsealed: boolean): StampRecord {
  return {
    id: row.id,
    number: row.number,
    slug: row.slug,
    creator_name: row.creator_name,
    creator_location: row.creator_location,
    message: unsealed ? row.message : null,
    template: normalizeTemplate(row.template),
    denomination: row.denomination,
    composition_json: row.composition_json,
    preview_url: publicPreviewUrl(row.preview_path),
    source_photo_path: row.source_photo_path,
    status: row.status,
    created_at: row.created_at,
    approved_at: row.approved_at,
    opened_at: row.opened_at,
  }
}

export async function getSiteState() {
  const supabase = await createServerSupabase()
  if (!supabase) return { birthday_mode: false }
  const { data } = await supabase.from('site_state').select('birthday_mode').eq('id', 1).maybeSingle()
  return { birthday_mode: Boolean(data?.birthday_mode) }
}

export async function getArchiveContext() {
  const site = await getSiteState()
  const unsealed = isArchiveUnsealed(new Date(), site.birthday_mode)
  const supabase = await createServerSupabase()

  if (!supabase) {
    const stamps = sealStamps(SEED_STAMPS, unsealed)
    return { stamps, unsealed, count: stamps.length, usingSeed: true }
  }

  const { data, error } = await supabase
    .from('stamps')
    .select(
      'id, number, slug, creator_name, creator_location, message, template, denomination, composition_json, preview_path, source_photo_path, status, created_at, approved_at, opened_at',
    )
    .eq('status', 'approved')
    .order('number', { ascending: true })

  // Connected archive: empty means empty. Seeds are only for offline / no-Supabase demos.
  if (error) {
    return { stamps: [], unsealed, count: 0, usingSeed: false }
  }

  const stamps = ((data ?? []) as StampRow[]).map((row) => mapRow(row, unsealed))
  return { stamps, unsealed, count: stamps.length, usingSeed: false }
}

export async function getStampBySlug(slug: string) {
  const { stamps, unsealed, usingSeed } = await getArchiveContext()
  const fromArchive = stamps.find((stamp) => stamp.slug === slug)
  if (fromArchive) return { stamp: fromArchive, unsealed, usingSeed }

  const supabase = await createServerSupabase()
  if (!supabase) return { stamp: null, unsealed, usingSeed }

  const { data } = await supabase
    .from('stamps')
    .select(
      'id, number, slug, creator_name, creator_location, message, template, denomination, composition_json, preview_path, source_photo_path, status, created_at, approved_at, opened_at',
    )
    .eq('slug', slug)
    .eq('status', 'approved')
    .maybeSingle()

  if (!data) return { stamp: null, unsealed, usingSeed }
  return { stamp: mapRow(data as StampRow, unsealed), unsealed, usingSeed: false }
}

export async function getAdminStamps(status?: StampStatus) {
  const admin = createAdminSupabase()
  if (!admin) return []

  let query = admin
    .from('stamps')
    .select(
      'id, number, slug, creator_name, creator_location, message, template, denomination, composition_json, preview_path, source_photo_path, status, created_at, approved_at, opened_at',
    )
    .order('created_at', { ascending: false })

  if (status) query = query.eq('status', status)
  const { data } = await query
  const rows = (data ?? []) as StampRow[]
  return Promise.all(
    rows.map(async (row) => {
      let preview_url = publicPreviewUrl(row.preview_path)
      if (row.preview_path && row.status !== 'approved') {
        const signed = await admin.storage.from('stamp-submissions').createSignedUrl(row.preview_path, 3600)
        preview_url = signed.data?.signedUrl ?? null
      }
      return {
        ...mapRow(row, true),
        message: row.message,
        preview_url,
      }
    }),
  )
}
