export async function verifyTurnstile(token?: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true
  if (!token) return false

  const body = new URLSearchParams()
  body.set('secret', secret)
  body.set('response', token)

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  })
  const payload = (await response.json()) as { success?: boolean }
  return Boolean(payload.success)
}
