export function getRevealDate() {
  const raw = process.env.NEXT_PUBLIC_REVEAL_DATE ?? '2026-09-12'
  const date = new Date(`${raw}T00:00:00`)
  return Number.isNaN(date.getTime()) ? new Date('2026-09-12T00:00:00') : date
}

export function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

export function isServiceRoleConfigured() {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)
}

export function getTurnstileSiteKey() {
  return process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || process.env.TURNSTILE_SITE_KEY || ''
}

export function getAdminEmail() {
  return (process.env.ADMIN_EMAIL || '').trim().toLowerCase()
}
