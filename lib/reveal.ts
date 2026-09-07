import { getRevealDate } from '@/lib/env'

export function isArchiveUnsealed(now = new Date(), birthdayMode = false) {
  if (birthdayMode) return true
  return now.getTime() >= getRevealDate().getTime()
}

export function formatRevealDate() {
  return getRevealDate().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatPostmarkDate(value?: string | null) {
  const date = value ? new Date(value) : getRevealDate()
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).toUpperCase()
}

export function daysUntilDelivery(now = new Date()) {
  const reveal = getRevealDate()
  const ms = reveal.getTime() - now.getTime()
  return Math.max(0, Math.ceil(ms / 86_400_000))
}
