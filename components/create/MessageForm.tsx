'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Heading, Hint, Input, Label, Text, Textarea } from '@medusajs/ui'
import { PostalShell, SIDEBAR_COPY, SIDEBAR_FRAME, SIDEBAR_TITLE } from '@/components/postal/PostalShell'
import { StampPaper } from '@/components/stamp/StampPaper'
import { messageFormSchema, type MessageFormValues } from '@/lib/validation'
import { useStampEditor } from '@/stores/stamp-editor'

export function MessageForm() {
  const router = useRouter()
  const store = useStampEditor()
  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageFormSchema),
    defaultValues: {
      creatorName: store.creatorName,
      creatorLocation: store.creatorLocation,
      message: store.message,
    },
  })
  const message = form.watch('message') ?? ''
  const name = form.watch('creatorName') ?? ''
  const location = form.watch('creatorLocation') ?? ''

  useEffect(() => {
    useStampEditor.getState().hydrate()
    const latest = useStampEditor.getState()
    form.reset({
      creatorName: latest.creatorName,
      creatorLocation: latest.creatorLocation,
      message: latest.message,
    })
  }, [form])

  function onSubmit(values: MessageFormValues) {
    store.setCreatorName(values.creatorName)
    store.setCreatorLocation(values.creatorLocation ?? '')
    store.setMessage(values.message)
    router.push('/create/preview')
  }

  const sidebar = (
    <form onSubmit={form.handleSubmit(onSubmit)} className={SIDEBAR_FRAME}>
      <Text size="small" className="font-mono text-[12px] text-[#5c574f] lg:text-[13px]">
        kenziepost / create
      </Text>
      <Text size="xsmall" className="mt-4 font-mono font-medium tracking-[0.08em] text-[#8a8275] lg:mt-6">
        STEP 3 OF 4
      </Text>
      <Heading level="h1" className={SIDEBAR_TITLE}>
        Write the back.
      </Heading>
      <Text className={SIDEBAR_COPY}>
        This is the part Kenzie keeps. Keep it short, specific, and a little tender.
      </Text>
      <Label htmlFor="message" className="mt-5 lg:mt-8">
        Message
      </Label>
      <Textarea id="message" rows={5} maxLength={240} className="mt-2 lg:min-h-[10rem]" {...form.register('message')} />
      <Hint className="text-right">{message.length} / 240</Hint>
      {form.formState.errors.message ? (
        <Hint className="text-ui-fg-error">{form.formState.errors.message.message}</Hint>
      ) : null}
      <Label htmlFor="creatorName" className="mt-4">
        From
      </Label>
      <Input id="creatorName" className="mt-2" {...form.register('creatorName')} />
      {form.formState.errors.creatorName ? (
        <Hint className="text-ui-fg-error">{form.formState.errors.creatorName.message}</Hint>
      ) : null}
      <Label htmlFor="creatorLocation" className="mt-4">
        From where?
      </Label>
      <Input id="creatorLocation" className="mt-2" placeholder="Optional" {...form.register('creatorLocation')} />
      <Text size="xsmall" className="mt-6 font-mono tracking-[0.12em] text-[#80786b]">
        THE REVERSE STAYS PRIVATE
      </Text>
      <Text className="mt-2 max-w-[310px] text-[13px] leading-[18px] text-[#59574f]">
        The archive will show your name and artwork. The message stays sealed until her birthday.
      </Text>
      {form.formState.isSubmitted && Object.keys(form.formState.errors).length > 0 ? (
        <Hint className="text-ui-fg-error">Add a name and at least 8 characters in the message to continue.</Hint>
      ) : null}
      <div className="mt-6 flex items-end justify-between gap-3 pt-4 lg:mt-auto lg:pt-8">
        <Button asChild size="small" variant="transparent">
          <Link href="/create/front">Back to artwork</Link>
        </Button>
        <Button type="submit">Next: preview</Button>
      </div>
    </form>
  )

  return (
    <PostalShell sidebar={sidebar} sidebarWidth={390} context="editor">
      <div className="flex h-full min-h-0 flex-col items-center justify-center px-4 py-8 lg:px-8 lg:py-16">
        <div className="w-[min(100%,420px)] lg:w-[min(100%,520px)]">
          <StampPaper template={store.composition.template} paper="cream">
            <div className="flex h-full w-full flex-col bg-[var(--stamp-cream)] p-[12%]">
              <p className="font-mono text-[clamp(7px,5cqw,10px)] tracking-[0.14em] text-[#8a8275]">POSTMARKED FOR KENZIE</p>
              <p className="mt-2 text-[clamp(10px,7cqw,16px)] font-medium text-[#171717]">{name || 'Your name'}</p>
              {location ? <p className="text-[clamp(8px,5.5cqw,12px)] text-[#59574f]">{location}</p> : null}
              <p className="mt-3 flex-1 text-[clamp(9px,6cqw,13px)] leading-relaxed text-[#2e2b26]">
                {message || 'The note on this side stays sealed until Kenzie’s birthday.'}
              </p>
            </div>
          </StampPaper>
        </div>
        <Text className="mt-4 max-w-xl px-2 text-center font-mono text-[11px] text-[#75736b] lg:mt-6 lg:text-[13px]">
          The reverse is private. The archive will only show that a sealed note exists.
        </Text>
      </div>
    </PostalShell>
  )
}
