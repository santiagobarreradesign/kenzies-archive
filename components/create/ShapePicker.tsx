'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button, Heading, Text } from '@medusajs/ui'
import { PostalShell, SIDEBAR_COPY, SIDEBAR_FRAME, SIDEBAR_TITLE } from '@/components/postal/PostalShell'
import { StampPaper } from '@/components/stamp/StampPaper'
import { TEMPLATES } from '@/lib/templates'
import { useStampEditor } from '@/stores/stamp-editor'
import type { StampTemplate } from '@/types/stamp'

export function ShapePicker() {
  const router = useRouter()
  const store = useStampEditor()
  const [selected, setSelected] = useState<StampTemplate>(store.composition.template || 'portrait')

  useEffect(() => {
    store.hydrate()
    setSelected(useStampEditor.getState().composition.template || 'portrait')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function choose(id: StampTemplate) {
    setSelected(id)
    store.setTemplate(id)
  }

  const sidebar = (
    <div className={SIDEBAR_FRAME}>
      <Text size="small" className="font-mono text-[12px] text-[#5c574f] lg:text-[13px]">
        kenziepost / create
      </Text>
      <Text size="xsmall" className="mt-5 font-mono font-medium tracking-[0.08em] text-[#8a8275] lg:mt-8">
        STEP 1 OF 4
      </Text>
      <Heading level="h1" className={SIDEBAR_TITLE}>
        Choose the paper.
      </Heading>
      <Text className={SIDEBAR_COPY}>
        Start with the stamp itself. Choose Portrait, Portrait Wide, Square, Circle, Pickle, Tall, Landscape, or
        Panoramic. You can change the paper again while you design.
      </Text>
      <Text className={`${SIDEBAR_COPY} hidden sm:block`}>
        The grey region is the canvas. That is where drawing and uploaded images will live.
      </Text>
      <div className="mt-6 flex flex-wrap items-center gap-3 pt-2 lg:mt-auto lg:pt-10">
        <Button asChild size="small" variant="transparent">
          <Link href="/">Back</Link>
        </Button>
        <Button
          onClick={() => {
            store.setTemplate(selected)
            router.push('/create/front')
          }}
        >
          Continue to editor
        </Button>
      </div>
    </div>
  )

  return (
    <PostalShell sidebar={sidebar} sidebarWidth={410} context="create">
      <div className="px-4 py-5 lg:px-10 lg:py-8">
        <Text size="xsmall" className="font-medium tracking-[0.12em] text-[#7a756b]">
          CHOOSE A SHAPE
        </Text>
        <div className="mx-auto mt-6 grid max-w-4xl grid-cols-2 gap-3 sm:mt-10 md:grid-cols-4 lg:mt-16 lg:gap-5">
          {TEMPLATES.map((template) => {
            const active = selected === template.id
            return (
              <button
                key={template.id}
                type="button"
                onClick={() => choose(template.id)}
                className={`flex h-[168px] flex-col items-center rounded-[6px] bg-white/70 px-3 pt-3 text-left lg:h-[240px] lg:px-4 lg:pt-4 ${
                  active ? 'border-2 border-[#3b82f5]' : 'border border-[rgba(201,201,194,0.7)]'
                }`}
              >
                <div className="flex h-[88px] w-[88px] items-center justify-center lg:h-[140px] lg:w-[140px]">
                  <StampPaper template={template.id} empty className="w-[72px] lg:w-[120px]" />
                </div>
                <div className="mt-auto flex w-full items-center justify-between pb-3 lg:pb-4">
                  <span className="font-mono text-[13px] font-medium text-[#262624] lg:text-[16px]">{template.name}</span>
                  {active ? (
                    <span className="font-mono text-[10px] font-medium tracking-[0.08em] text-[#215cd9] lg:text-[11px]">
                      SELECTED
                    </span>
                  ) : null}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </PostalShell>
  )
}
