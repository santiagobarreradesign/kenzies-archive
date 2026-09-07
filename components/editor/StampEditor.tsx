'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button, Heading, Input, Text, toast } from '@medusajs/ui'
import type Konva from 'konva'
import { HuePicker } from '@/components/editor/HuePicker'
import { PostalShell, SIDEBAR_COPY, SIDEBAR_FRAME, SIDEBAR_TITLE } from '@/components/postal/PostalShell'
import { StampPaper } from '@/components/stamp/StampPaper'
import { fileToDataUrl, photoFileError, preparePhoto } from '@/lib/stamp/photo'
import { TEMPLATES } from '@/lib/templates'
import { makePhotoElement, useStampEditor } from '@/stores/stamp-editor'
import type { DrawMode, StampTemplate, StrokeSize } from '@/types/stamp'

const EditorCanvas = dynamic(() => import('@/components/editor/EditorCanvas').then((mod) => mod.EditorCanvas), {
  ssr: false,
})

export function StampEditor({ mode = 'draw' }: { mode?: 'draw' | 'photo' }) {
  const router = useRouter()
  const stageRef = useRef<Konva.Stage | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [draftPrompt, setDraftPrompt] = useState(false)
  const [dragging, setDragging] = useState(false)
  const store = useStampEditor()
  const photo = store.composition.elements.find((element) => element.data.kind === 'photo')

  useEffect(() => {
    const result = store.hydrate()
    if (result === 'draft' && store.composition.elements.length > 0) setDraftPrompt(true)
    if (mode === 'photo') store.setTool('select')
    else if (store.selectedTool === 'select' && !store.selectedId) store.setTool('draw')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const meta = event.metaKey || event.ctrlKey
      if (meta && event.key.toLowerCase() === 'z') {
        event.preventDefault()
        if (event.shiftKey) store.redo()
        else store.undo()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [store])

  async function onPhoto(file: File) {
    const problem = photoFileError(file)
    if (problem) {
      toast.error(problem)
      return
    }
    try {
      const src = await fileToDataUrl(file)
      const prepared = await preparePhoto(src)
      const { composition } = useStampEditor.getState()
      const withoutPhotos = composition.elements.filter((element) => element.data.kind !== 'photo')
      store.commit({ ...composition, elements: withoutPhotos })
      store.addElement(
        makePhotoElement(
          prepared.src,
          composition.width,
          composition.height,
          withoutPhotos.length,
          prepared.width,
          prepared.height,
        ),
      )
      store.setTool('select')
      router.push('/create/photo')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'The photograph could not be read.')
    }
  }

  function goNext() {
    if (mode === 'draw' && photo?.data.kind === 'photo' && photo.data.src) {
      router.push('/create/photo')
      return
    }
    router.push('/create/message')
  }

  const zoom = photo ? Math.round((photo.scaleX || 1) * 100) : 100
  const drawModes: { id: DrawMode; label: string }[] = [
    { id: 'pencil', label: 'Pencil' },
    { id: 'marker', label: 'Marker' },
    { id: 'eraser', label: 'Eraser' },
  ]

  const sidebar = (
    <div className={SIDEBAR_FRAME}>
      <Text size="small" className="font-mono text-[12px] text-[#5c574f] lg:text-[13px]">
        kenziepost / create
      </Text>
      <Text size="xsmall" className="mt-4 font-mono font-medium tracking-[0.08em] text-[#8a8275] lg:mt-6">
        STEP 2 OF 4
      </Text>
      <Heading level="h1" className={SIDEBAR_TITLE}>
        {mode === 'photo' ? 'Place the photograph.' : 'Make the front.'}
      </Heading>
      <Text className={SIDEBAR_COPY}>
        {mode === 'photo'
          ? 'Zoom and move the photograph so it sits in the grey canvas. The white edge is the stamp paper itself.'
          : 'Draw on the grey canvas or upload an image. Photographs keep their real shape.'}
      </Text>

      <Text size="xsmall" className="mt-8 font-mono font-medium tracking-[0.12em] text-[#80786b]">
        TOOLS
      </Text>
      <div className="mt-2 flex flex-wrap gap-2">
        <Button
          size="small"
          variant={store.selectedTool === 'draw' ? 'secondary' : 'transparent'}
          onClick={() => store.setTool('draw')}
        >
          Draw
        </Button>
        <Button
          size="small"
          variant={mode === 'photo' ? 'secondary' : 'transparent'}
          onClick={() => fileRef.current?.click()}
        >
          Upload image
        </Button>
      </div>

      {mode === 'draw' ? (
        <>
          <Text size="xsmall" className="mt-6 font-mono font-medium tracking-[0.12em] text-[#80786b]">
            STAMP SHAPE
          </Text>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {TEMPLATES.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => store.setTemplate(template.id)}
                className={`flex h-[82px] flex-col items-center rounded-[5px] bg-white/70 px-1 pt-1 ${
                  store.composition.template === template.id
                    ? 'border-2 border-[#3b82f5]'
                    : 'border border-[rgba(201,201,194,0.7)]'
                }`}
              >
                <StampPaper template={template.id} empty className="h-12 w-12" />
                <span className="mt-auto pb-1 text-center text-[9px] leading-[14px] text-[#4d4a45]">{template.name}</span>
              </button>
            ))}
          </div>
          <Text size="xsmall" className="mt-6 font-mono font-medium tracking-[0.12em] text-[#80786b]">
            DRAW
          </Text>
          <div className="mt-2 flex flex-wrap gap-2">
            {drawModes.map((option) => (
              <Button
                key={option.id}
                size="small"
                variant={store.drawMode === option.id ? 'secondary' : 'transparent'}
                onClick={() => store.setDrawMode(option.id)}
              >
                {option.label}
              </Button>
            ))}
          </div>
          <Text size="xsmall" className="mt-6 font-mono font-medium tracking-[0.12em] text-[#80786b]">
            SIZE
          </Text>
          <div className="mt-2 flex gap-3">
            {([
              { id: 'small' as StrokeSize, size: 8 },
              { id: 'medium' as StrokeSize, size: 14 },
              { id: 'large' as StrokeSize, size: 20 },
            ]).map((brush) => (
              <button
                key={brush.id}
                type="button"
                aria-label={`${brush.id} brush`}
                onClick={() => store.setStrokeSize(brush.id)}
                className={`flex size-10 items-center justify-center rounded-[4px] ${
                  store.strokeSize === brush.id ? 'bg-[#171717]' : 'border border-[#d6d3d1] bg-white'
                }`}
              >
                <span
                  className="rounded-full"
                  style={{
                    width: brush.size,
                    height: brush.size,
                    background: store.strokeSize === brush.id ? '#fff' : '#171717',
                  }}
                />
              </button>
            ))}
          </div>
          {store.drawMode === 'eraser' ? (
            <Text className="mt-6 max-w-[310px] text-[13px] leading-[18px] text-[#59574f]">
              Eraser lifts ink and photograph edges back to the grey canvas.
            </Text>
          ) : (
            <>
              <Text size="xsmall" className="mt-6 font-mono font-medium tracking-[0.12em] text-[#80786b]">
                INK
              </Text>
              <div className="mt-3">
                <HuePicker value={store.color} onChange={store.setColor} />
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <Text size="xsmall" className="mt-6 font-mono font-medium tracking-[0.12em] text-[#80786b]">
            ZOOM
          </Text>
          <div className="mt-2">
            <Input
              type="number"
              min={50}
              max={300}
              value={zoom}
              onChange={(event) => {
                if (!photo) return
                const next = Math.min(300, Math.max(50, Number(event.target.value) || 100)) / 100
                store.updateElement(photo.id, { scaleX: next, scaleY: next })
              }}
            />
          </div>
        </>
      )}

      <div className="mt-6 flex items-end justify-between gap-3 pt-4 lg:mt-auto lg:pt-8">
        {mode === 'photo' ? (
          <Button
            size="small"
            variant="transparent"
            onClick={() => {
              const composition = useStampEditor.getState().composition
              store.commit({
                ...composition,
                elements: composition.elements.filter((element) => element.data.kind !== 'photo'),
              })
              router.push('/create/front')
            }}
          >
            Remove photo
          </Button>
        ) : (
          <Button asChild size="small" variant="transparent">
            <Link href="/create">Back</Link>
          </Button>
        )}
        <Button onClick={goNext}>Next: write the back</Button>
      </div>
    </div>
  )

  return (
    <>
      {draftPrompt ? (
        <div className="absolute left-1/2 top-3 z-40 flex w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 flex-wrap items-center gap-2 bg-white px-3 py-2 shadow-border lg:top-4 lg:w-auto lg:max-w-none lg:gap-3 lg:px-4">
          <Text size="small">We found your unfinished stamp.</Text>
          <Button size="small" variant="secondary" onClick={() => setDraftPrompt(false)}>
            Continue
          </Button>
          <Button
            size="small"
            variant="transparent"
            onClick={() => {
              store.reset()
              setDraftPrompt(false)
            }}
          >
            Start over
          </Button>
        </div>
      ) : null}
      <PostalShell sidebar={sidebar} sidebarWidth={390} context="editor" canvasFirst>
        <div className="flex h-full min-h-0 flex-col px-4 py-4 lg:px-8 lg:py-6">
          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-1 lg:gap-2">
              <Button size="small" variant="transparent" onClick={store.undo}>
                Undo
              </Button>
              <Button size="small" variant="transparent" onClick={store.redo}>
                Redo
              </Button>
            </div>
            <Button
              size="small"
              variant="secondary"
              onClick={() => router.push(store.message ? '/create/preview' : '/create/message')}
            >
              Preview
            </Button>
          </div>
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center">
            <div
              className="w-[min(100%,520px)]"
              onDragOver={(event) => {
                if (![...event.dataTransfer.types].includes('Files')) return
                event.preventDefault()
                setDragging(true)
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(event) => {
                event.preventDefault()
                setDragging(false)
                const file = event.dataTransfer.files[0]
                if (file) void onPhoto(file)
              }}
            >
              <StampPaper template={store.composition.template as StampTemplate} empty={store.composition.elements.length === 0}>
                <EditorCanvas stageRef={stageRef} />
                {dragging ? (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-[var(--stamp-canvas)]/85 text-center">
                    <Text weight="plus">Drop the photograph here</Text>
                  </div>
                ) : store.composition.elements.length === 0 ? (
                  <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center text-center text-[14px] leading-5 text-[#545454] lg:text-[18px] lg:leading-6">
                    <span>
                      DRAW HERE
                      <br />
                      or drop an image
                    </span>
                  </div>
                ) : null}
              </StampPaper>
            </div>
            <Text className="mt-4 max-w-xl px-2 text-center font-mono text-[11px] text-[#75736b] lg:mt-6 lg:text-[13px]">
              The grey region is the editable canvas. Artwork is clipped to the selected stamp shape.
            </Text>
          </div>
        </div>
      </PostalShell>
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        className="sr-only"
        tabIndex={-1}
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) void onPhoto(file)
          event.target.value = ''
        }}
      />
    </>
  )
}
