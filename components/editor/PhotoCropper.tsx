'use client'

import { useCallback, useEffect, useState } from 'react'
import Cropper, { type Area } from 'react-easy-crop'
import { Button, Label, Text, toast } from '@medusajs/ui'
import { cropAndCompress } from '@/lib/stamp/photo'

export function PhotoCropper({
  open,
  src,
  onClose,
  onComplete,
}: {
  open: boolean
  src: string | null
  onClose: () => void
  onComplete: (dataUrl: string, filter: 'original' | 'bw') => void
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [area, setArea] = useState<Area | null>(null)
  const [bw, setBw] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setArea(null)
    setBw(false)
    setBusy(false)
  }, [src])

  useEffect(() => {
    if (!open) return
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape' && !busy) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [busy, open, onClose])

  const onCropComplete = useCallback((_: Area, cropped: Area) => {
    setArea(cropped)
  }, [])

  async function confirm() {
    if (!src || !area || busy) return
    setBusy(true)
    try {
      const dataUrl = await cropAndCompress(src, area, bw)
      onComplete(dataUrl, bw ? 'bw' : 'original')
      onClose()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'The photograph could not be added.')
      setBusy(false)
    }
  }

  if (!open || !src) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
      <div className="flex w-full max-w-xl flex-col bg-ui-bg-base shadow-elevation-modal">
        <div className="border-b border-ui-border-base px-4 py-3">
          <Text weight="plus">Crop the photograph</Text>
        </div>
        <div className="flex flex-col gap-4 p-4">
          <div className="relative h-[360px] w-full overflow-hidden bg-ui-bg-subtle">
            <Cropper
              image={src}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <div className="flex items-center gap-3">
            <Label htmlFor="treatment">Treatment</Label>
            <Button size="small" variant={!bw ? 'secondary' : 'transparent'} onClick={() => setBw(false)}>
              Original
            </Button>
            <Button size="small" variant={bw ? 'secondary' : 'transparent'} onClick={() => setBw(true)}>
              B&W
            </Button>
          </div>
        </div>
        <div className="flex justify-end gap-2 border-t border-ui-border-base p-4">
          <Button variant="secondary" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button onClick={confirm} isLoading={busy} disabled={!area}>
            Add to stamp
          </Button>
        </div>
      </div>
    </div>
  )
}
