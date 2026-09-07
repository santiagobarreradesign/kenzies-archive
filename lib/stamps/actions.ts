'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@supabase/supabase-js'
import { createAdminSupabase } from '@/lib/supabase/admin'
import { createServerSupabase } from '@/lib/supabase/server'
import { getAdminEmail, isSupabaseConfigured } from '@/lib/env'
import { verifyTurnstile } from '@/lib/security/turnstile'
import { adminActionSchema, submitStampSchema } from '@/lib/validation'
import { buildStampSlug } from '@/lib/stamp/slug'

function decodeDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:(image\/(?:png|jpeg|webp));base64,(.+)$/)
  if (!match) return null
  return { mime: match[1], bytes: Buffer.from(match[2], 'base64') }
}

function createAnonSupabase() {
  if (!isSupabaseConfigured()) return null
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

async function requireAdmin() {
  const supabase = await createServerSupabase()
  if (!supabase) throw new Error('Supabase is not configured.')
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user?.email) throw new Error('Sign in required.')
  const allow = getAdminEmail()
  if (allow && user.email.toLowerCase() !== allow) throw new Error('This desk is closed.')
  return user
}

export async function submitStamp(input: unknown) {
  const parsed = submitStampSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? 'Invalid submission.' }
  }

  const allowed = await verifyTurnstile(parsed.data.turnstileToken)
  if (!allowed) return { ok: false as const, error: 'Postal inspection failed. Try again.' }

  const preview = decodeDataUrl(parsed.data.preview)
  if (!preview || preview.bytes.length > 4_000_000) {
    return { ok: false as const, error: 'The rendered stamp could not be accepted.' }
  }

  const admin = createAdminSupabase()
  const anon = createAnonSupabase()
  const client = admin ?? anon
  if (!client) {
    return {
      ok: true as const,
      id: crypto.randomUUID(),
      pending: true,
      local: true,
    }
  }

  const composition = {
    ...parsed.data.composition,
    elements: parsed.data.composition.elements.map((element) =>
      element.data.kind === 'photo' && element.data.src.length > 800_000
        ? { ...element, data: { ...element.data, src: '' } }
        : element,
    ),
  }

  const id = crypto.randomUUID()
  const previewPath = `${id}.webp`
  const autoApprove = !getAdminEmail() || !admin

  const uploadBucket = autoApprove ? 'stamps' : 'stamp-submissions'
  const { error: uploadError } = await client.storage.from(uploadBucket).upload(previewPath, preview.bytes, {
    contentType: preview.mime,
    upsert: false,
  })
  if (uploadError) {
    return { ok: false as const, error: `The stamp could not be filed. (${uploadError.message})` }
  }

  if (admin) {
    let number: number | null = null
    let slug = `pending-${id.slice(0, 8)}`
    let status: 'pending' | 'approved' = 'pending'
    let approved_at: string | null = null
    let finalPreviewPath = previewPath

    if (autoApprove) {
      const { data: last } = await admin
        .from('stamps')
        .select('number')
        .eq('status', 'approved')
        .order('number', { ascending: false })
        .limit(1)
        .maybeSingle()
      const nextNumber = (last?.number ?? 0) + 1
      number = nextNumber
      slug = buildStampSlug(nextNumber, parsed.data.creatorName, parsed.data.creatorLocation)
      status = 'approved'
      approved_at = new Date().toISOString()
      finalPreviewPath = `${slug}.webp`
      if (finalPreviewPath !== previewPath) {
        await admin.storage.from('stamps').move(previewPath, finalPreviewPath)
      }
    }

    const { error } = await admin.from('stamps').insert({
      id,
      number,
      creator_name: parsed.data.creatorName,
      creator_location: parsed.data.creatorLocation || null,
      message: parsed.data.message,
      template: parsed.data.composition.template,
      denomination: parsed.data.composition.denomination,
      composition_json: composition,
      preview_path: finalPreviewPath,
      status,
      approved_at,
      slug,
    })

    if (error) return { ok: false as const, error: `The stamp could not be entered into the ledger. (${error.message})` }

    revalidatePath('/')
    revalidatePath('/admin')
    return { ok: true as const, id, slug, number, pending: status === 'pending', local: false }
  }

  const { data, error } = await anon!.rpc('submit_stamp', {
    p_creator_name: parsed.data.creatorName,
    p_creator_location: parsed.data.creatorLocation || '',
    p_message: parsed.data.message,
    p_template: parsed.data.composition.template,
    p_denomination: parsed.data.composition.denomination,
    p_composition: composition,
    p_preview_path: previewPath,
    p_auto_approve: true,
  })

  if (error) {
    return { ok: false as const, error: `The stamp could not be entered into the ledger. (${error.message})` }
  }

  const row = Array.isArray(data) ? data[0] : data
  revalidatePath('/')
  revalidatePath('/admin')
  return {
    ok: true as const,
    id: (row?.id as string) ?? id,
    slug: (row?.slug as string) ?? undefined,
    number: (row?.number as number | null) ?? null,
    pending: row?.status !== 'approved',
    local: false,
  }
}

export async function signInAdmin(formData: FormData) {
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')
  const supabase = await createServerSupabase()
  if (!supabase) return { ok: false as const, error: 'Supabase is not configured.' }
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { ok: false as const, error: 'Credentials rejected.' }
  revalidatePath('/admin')
  return { ok: true as const }
}

export async function signOutAdmin() {
  const supabase = await createServerSupabase()
  await supabase?.auth.signOut()
  revalidatePath('/admin')
}

export async function moderateStamp(input: unknown) {
  const parsed = adminActionSchema.safeParse(input)
  if (!parsed.success) return { ok: false as const, error: 'Invalid action.' }
  await requireAdmin()
  const admin = createAdminSupabase()
  const server = await createServerSupabase()
  const client = admin ?? server
  if (!client) return { ok: false as const, error: 'Supabase is not configured.' }

  const { stampId, action } = parsed.data
  if (action === 'approve') {
    const { data: current, error: fetchError } = await client
      .from('stamps')
      .select('id, creator_name, creator_location, preview_path, status')
      .eq('id', stampId)
      .single()
    if (fetchError || !current) return { ok: false as const, error: 'Stamp not found.' }
    if (current.status === 'approved') return { ok: true as const }

    const { data: last } = await client
      .from('stamps')
      .select('number')
      .eq('status', 'approved')
      .order('number', { ascending: false })
      .limit(1)
      .maybeSingle()
    const number = (last?.number ?? 0) + 1
    const slug = buildStampSlug(number, current.creator_name, current.creator_location)
    let publicPath = current.preview_path

    if (current.preview_path && admin) {
      const { data: file } = await admin.storage.from('stamp-submissions').download(current.preview_path)
      if (file) {
        publicPath = `${slug}.webp`
        await admin.storage.from('stamps').upload(publicPath, file, { contentType: 'image/webp', upsert: true })
      }
    }

    const { error } = await client
      .from('stamps')
      .update({
        status: 'approved',
        number,
        slug,
        preview_path: publicPath,
        approved_at: new Date().toISOString(),
      })
      .eq('id', stampId)
    if (error) return { ok: false as const, error: 'Approval failed.' }
  } else {
    const status = action === 'reject' ? 'rejected' : 'hidden'
    const { error } = await client.from('stamps').update({ status }).eq('id', stampId)
    if (error) return { ok: false as const, error: 'Update failed.' }
  }

  revalidatePath('/')
  revalidatePath('/admin')
  revalidatePath('/stamp', 'layout')
  return { ok: true as const }
}

export async function getAdminSessionEmail() {
  const supabase = await createServerSupabase()
  if (!supabase) return null
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user?.email ?? null
}
