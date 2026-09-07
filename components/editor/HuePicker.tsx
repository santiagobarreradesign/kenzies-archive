'use client'

import { useCallback, useRef } from 'react'
import type { PointerEvent } from 'react'
import { hexToHsv, hsvToHex, hueGradient } from '@/lib/color'
import { clamp } from '@/lib/stamp/layout'

export function HuePicker({
  value,
  onChange,
}: {
  value: string
  onChange: (hex: string) => void
}) {
  const hsv = hexToHsv(value) ?? { h: 0, s: 0, v: 0.09 }
  const squareRef = useRef<HTMLDivElement>(null)
  const hueRef = useRef<HTMLDivElement>(null)

  const setFromSquare = useCallback(
    (clientX: number, clientY: number) => {
      const node = squareRef.current
      if (!node) return
      const rect = node.getBoundingClientRect()
      const s = clamp(0, 1, (clientX - rect.left) / rect.width)
      const v = clamp(0, 1, 1 - (clientY - rect.top) / rect.height)
      onChange(hsvToHex(hsv.h, s, v))
    },
    [hsv.h, onChange],
  )

  const setFromHue = useCallback(
    (clientX: number) => {
      const node = hueRef.current
      if (!node) return
      const rect = node.getBoundingClientRect()
      const h = clamp(0, 360, ((clientX - rect.left) / rect.width) * 360)
      onChange(hsvToHex(h, hsv.s, hsv.v))
    },
    [hsv.s, hsv.v, onChange],
  )

  function trackPointer(
    event: PointerEvent<HTMLDivElement>,
    move: (x: number, y: number) => void,
  ) {
    event.currentTarget.setPointerCapture(event.pointerId)
    move(event.clientX, event.clientY)
  }

  return (
    <div className="space-y-3">
      <div
        ref={squareRef}
        role="slider"
        aria-label="Saturation and brightness"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(hsv.s * 100)}
        tabIndex={0}
        className="relative h-[132px] w-full cursor-crosshair touch-none overflow-hidden rounded-[4px] border border-black/10"
        style={{
          background: `linear-gradient(to bottom, transparent, #000), linear-gradient(to right, #fff, ${hsvToHex(hsv.h, 1, 1)})`,
        }}
        onPointerDown={(event) => trackPointer(event, setFromSquare)}
        onPointerMove={(event) => {
          if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
          setFromSquare(event.clientX, event.clientY)
        }}
      >
        <span
          className="pointer-events-none absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.35)]"
          style={{ left: `${hsv.s * 100}%`, top: `${(1 - hsv.v) * 100}%`, background: value }}
        />
      </div>
      <div
        ref={hueRef}
        role="slider"
        aria-label="Hue"
        aria-valuemin={0}
        aria-valuemax={360}
        aria-valuenow={Math.round(hsv.h)}
        tabIndex={0}
        className="relative h-[14px] w-full cursor-ew-resize touch-none rounded-full border border-black/10"
        style={{ background: hueGradient() }}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId)
          setFromHue(event.clientX)
        }}
        onPointerMove={(event) => {
          if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
          setFromHue(event.clientX)
        }}
      >
        <span
          className="pointer-events-none absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.35)]"
          style={{ left: `${(hsv.h / 360) * 100}%`, background: hsvToHex(hsv.h, 1, 1) }}
        />
      </div>
    </div>
  )
}
