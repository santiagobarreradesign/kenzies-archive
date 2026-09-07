'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Turnstile } from '@marsidev/react-turnstile'
import { Badge, Button, Heading, Text, toast } from '@medusajs/ui'
import { useReducedMotion } from 'motion/react'
import type Konva from 'konva'
import { CanvasSurface } from '@/components/postal/CanvasSurface'
import { Postmark } from '@/components/stamp/Postmark'
import { SealedBack } from '@/components/stamp/SealedBack'
import { StampPaper } from '@/components/stamp/StampPaper'
import { submitStamp } from '@/lib/stamps/actions'
import { saveLocalStamp, type LocalStamp } from '@/lib/stamps/local'
import { canonicalizeComposition } from '@/lib/stamp/composition'
import { formatStampNumber } from '@/lib/stamp/slug'
import { useStampEditor } from '@/stores/stamp-editor'

const EditorCanvas = dynamic(() => import('@/components/editor/EditorCanvas').then((mod) => mod.EditorCanvas), {
  ssr: false,
})

async function capturePreview(stage: Konva.Stage | null) {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    if (stage) {
      try {
        const preview = stage.toDataURL({ pixelRatio: 2, mimeType: 'image/webp', quality: 0.86 })
        if (preview.length > 32) return preview
      } catch {
        // Stage may still be settling after a remount.
      }
    }
    await new Promise((resolve) => window.setTimeout(resolve, 80))
  }
  return ''
}

export function PreviewStage() {
  const router = useRouter()
  const reduce = useReducedMotion()
  const store = useStampEditor()
  const stageRef = useRef<Konva.Stage | null>(null)
  const [posting, setPosting] = useState(false)
  const [posted, setPosted] = useState<LocalStamp | null>(null)
  const [heldLocally, setHeldLocally] = useState(false)
  const [token, setToken] = useState('')
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''

  useEffect(() => {
    useStampEditor.getState().hydrate()
  }, [])

  async function postIt() {
    const latest = useStampEditor.getState()
    if (!latest.creatorName || !latest.message) {
      toast.error('A name and a message are required.')
      router.push('/create/message')
      return
    }
    setPosting(true)
    await new Promise((resolve) => setTimeout(resolve, reduce ? 0 : 400))
    const preview = await capturePreview(stageRef.current)
    if (!preview) {
      setPosting(false)
      toast.error('The stamp front could not be captured. Stay on this page and try again.')
      return
    }
    const result = await submitStamp({
      composition: canonicalizeComposition(latest.composition),
      preview,
      creatorName: latest.creatorName,
      creatorLocation: latest.creatorLocation,
      message: latest.message,
      turnstileToken: token,
    })
    setPosting(false)
    if (!result.ok) {
      toast.error(result.error)
      return
    }
    const local = saveLocalStamp({
      id: result.id,
      creatorName: latest.creatorName,
      creatorLocation: latest.creatorLocation,
      message: latest.message,
      composition: latest.composition,
      preview,
      slug: 'slug' in result ? result.slug : undefined,
      number: 'number' in result ? result.number ?? undefined : undefined,
      local: Boolean(result.local),
    })
    setPosted(local)
    setHeldLocally(Boolean(result.local))
    latest.reset()
    if (!result.local) router.refresh()
  }

  if (posted) {
    return (
      <div className="relative min-h-dvh">
        <CanvasSurface context="flow">
          <div className="flex min-h-dvh flex-col items-center justify-center px-4 py-12 text-center lg:px-6 lg:py-16">
            <div className="relative w-[min(100%,320px)]">
              <StampPaper template={posted.template}>
                {posted.preview_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={posted.preview_url} alt="Your stamp" className="h-full w-full object-cover" />
                ) : null}
              </StampPaper>
              <Postmark className="absolute bottom-[4%] right-[-2%] w-[52%]" />
            </div>
            <Badge className="mt-8" color="green">
              Waiting for Kenzie
            </Badge>
            <Heading level="h1" className="mt-4 font-serif text-[28px] font-medium leading-8 text-[#2e2b26] lg:text-[38px]">
              Stamp {formatStampNumber(posted.number).replace('STAMP ', '')} has joined the archive.
            </Heading>
            <Text className="mt-3 max-w-xl text-pretty text-[#59574f]">
              {heldLocally
                ? 'Supabase is not connected yet, so this issue is saved on this browser. You can open it in the archive and keep testing the flow.'
                : 'Kenzie has another piece of mail waiting for her. The message on the reverse will stay sealed until the birthday reveal.'}
            </Text>
            <Text size="xsmall" className="mt-4 font-mono tracking-[0.12em] text-[#8a8275]">
              {formatStampNumber(posted.number).replace('STAMP ', 'ISSUE ')} · POSTMARKED SEP · 2026 · STATUS · WAITING
            </Text>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild variant="secondary">
                <Link href={`/stamp/${posted.slug}`}>Open stamp</Link>
              </Button>
              <Button asChild>
                <Link href={`/?posted=${posted.slug}`}>See the archive</Link>
              </Button>
            </div>
          </div>
        </CanvasSurface>
      </div>
    )
  }

  return (
    <div className="relative min-h-dvh">
      <CanvasSurface context="flow">
        <div className="absolute left-4 top-4 z-30 lg:left-9 lg:top-6">
          <Button asChild variant="transparent" size="small">
            <Link href="/create/message">← Back to message</Link>
          </Button>
        </div>
        <div className="mx-auto flex min-h-dvh max-w-5xl flex-col px-4 py-12 lg:px-8 lg:py-20">
          <Text size="xsmall" className="font-mono tracking-[0.12em] text-[#8a8275]">
            STEP 4 OF 4
          </Text>
          <Heading level="h1" className="mt-2 font-serif text-[28px] font-medium leading-8 text-[#2e2b26] lg:text-[38px] lg:leading-[46px]">
            Ready for post?
          </Heading>
          <Text className="mt-3 max-w-xl text-[#59574f]">Review both sides, then send it into the archive.</Text>
          <div className="mt-8 grid gap-10 md:mt-16 md:grid-cols-2 md:gap-16">
            <div>
              <Text size="xsmall" className="mb-4 block text-center font-mono tracking-[0.14em] text-[#8a8275]">
                FRONT · PUBLIC
              </Text>
              <div className="relative">
                <StampPaper template={store.composition.template}>
                  <EditorCanvas stageRef={stageRef} interactive={false} />
                </StampPaper>
                <Postmark className="absolute bottom-[4%] right-[-2%] w-[52%]" />
              </div>
            </div>
            <div>
              <Text size="xsmall" className="mb-4 block text-center font-mono tracking-[0.14em] text-[#8a8275]">
                BACK · PRIVATE
              </Text>
              <SealedBack template={store.composition.template} />
            </div>
          </div>
          <Text className="mx-auto mt-10 max-w-xl text-center font-mono text-[13px] text-[#75736b]">
            The front remains visible in the archive. The reverse unlocks only on the birthday reveal.
          </Text>
          {siteKey ? (
            <div className="mt-6 flex justify-center">
              <Turnstile siteKey={siteKey} onSuccess={setToken} />
            </div>
          ) : null}
          <div className="mt-8 flex justify-stretch pb-[max(1rem,env(safe-area-inset-bottom))] sm:justify-end">
            <Button isLoading={posting} onClick={postIt} className="w-full sm:w-auto">
              Post stamp
            </Button>
          </div>
        </div>
      </CanvasSurface>
    </div>
  )
}
