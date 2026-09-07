export function slugifyName(value: string) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 40)
}

export function buildStampSlug(number: number, creatorName: string, location?: string | null) {
  const parts = [String(number), slugifyName(creatorName)]
  if (location) parts.push(slugifyName(location))
  return parts.filter(Boolean).join('-')
}

export function formatStampNumber(number: number | null) {
  if (!number) return 'STAMP №—'
  return `STAMP №${String(number).padStart(3, '0')}`
}
