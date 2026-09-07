'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button, Heading, Text } from '@medusajs/ui'
import { PostalShell } from '@/components/postal/PostalShell'
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
    <div className="flex h-full min-h-dvh flex-col px-10 py-8">
      <Text size="small" className="font-mono text-[13px] text-[#5c574f]">
        kenziepost / create
      </Text>
      <Text size="xsmall" className="mt-8 font-mono font-medium tracking-[0.08em] text-[#8a8275]">
        STEP 1 OF 4
      </Text>
      <Heading level="h1" className="mt-3 font-serif text-[42px] font-medium leading-[50px] text-[#2e2b26]">
        Choose the paper.
      </Heading>
      <Text className="mt-6 max-w-[320px] text-[16px] leading-[25px] text-[#59574f]">
        Start with the stamp itself. Choose Portrait, Portrait Wide, Square, Circle, Tall, Landscape, or Panoramic. You
        can change the paper again while you design.
      </Text>
      <Text className="mt-6 max-w-[320px] text-[15px] leading-[23px] text-[#59574f]">
        The grey region is the canvas. That is where drawing and uploaded images will live.
      </Text>
      <div className="mt-auto space-y-3 pt-10">
        <div>
          <Button asChild size="small" variant="transparent">
            <Link href="/">Back</Link>
          </Button>
        </div>
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
      <div className="px-10 py-8">
        <Text size="xsmall" className="font-medium tracking-[0.12em] text-[#7a756b]">
          CHOOSE A SHAPE
        </Text>
        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-5 md:grid-cols-4">
          {TEMPLATES.map((template) => {
            const active = selected === template.id
            return (
              <button
                key={template.id}
                type="button"
                onClick={() => choose(template.id)}
                className={`flex h-[240px] flex-col items-center rounded-[6px] bg-white/70 px-4 pt-4 text-left ${
                  active ? 'border-2 border-[#3b82f5]' : 'border border-[rgba(201,201,194,0.7)]'
                }`}
              >
                <div className="flex h-[140px] w-[140px] items-center justify-center">
                  <StampPaper template={template.id} empty className="w-[120px]" />
                </div>
                <div className="mt-auto flex w-full items-center justify-between pb-4">
                  <span className="font-mono text-[16px] font-medium text-[#262624]">{template.name}</span>
                  {active ? (
                    <span className="font-mono text-[11px] font-medium tracking-[0.08em] text-[#215cd9]">SELECTED</span>
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
