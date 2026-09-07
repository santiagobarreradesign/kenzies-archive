'use client'

import { useEffect, useRef, useState } from 'react'
import Konva from 'konva'
import { DEFAULT_PAPER } from '@/lib/palette'
import { makeDrawingElement, strokeWidth, useStampEditor } from '@/stores/stamp-editor'
import type { StampElement } from '@/types/stamp'

const FONT_FAMILY = {
  serif: 'Source Serif 4, Georgia, serif',
  sans: 'Inter, sans-serif',
  hand: 'Caveat, cursive',
  display: 'Playfair Display, Georgia, serif',
}

export function EditorCanvas({
  stageRef,
  displayWidth,
  interactive = true,
}: {
  stageRef: React.MutableRefObject<Konva.Stage | null>
  displayWidth?: number
  interactive?: boolean
}) {
  const hostRef = useRef<HTMLDivElement>(null)
  const composition = useStampEditor((s) => s.composition)
  const selectedId = useStampEditor((s) => s.selectedId)
  const selectedTool = useStampEditor((s) => s.selectedTool)
  const drawMode = useStampEditor((s) => s.drawMode)
  const color = useStampEditor((s) => s.color)
  const strokeSize = useStampEditor((s) => s.strokeSize)
  const measured = useRef(displayWidth ?? 400)
  const [hostWidth, setHostWidth] = useState(displayWidth ?? 0)

  useEffect(() => {
    if (displayWidth) return
    const host = hostRef.current
    if (!host) return
    const update = () => setHostWidth(host.clientWidth)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(host)
    return () => observer.disconnect()
  }, [displayWidth, composition.template])

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    const width = displayWidth ?? Math.max(120, hostWidth || host.clientWidth || measured.current)
    measured.current = width

    const scale = width / composition.width
    const stage = new Konva.Stage({
      container: host,
      width: composition.width * scale,
      height: composition.height * scale,
    })
    stage.scale({ x: scale, y: scale })
    stageRef.current = stage
    const layer = new Konva.Layer()
    stage.add(layer)

    const background = new Konva.Rect({
      width: composition.width,
      height: composition.height,
      fill: composition.background,
    })
    layer.add(background)

    const transformer = new Konva.Transformer({
      rotateEnabled: true,
      keepRatio: true,
      enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
    })

    const drawing = interactive && selectedTool === 'draw'
    const ink = drawMode === 'eraser' ? DEFAULT_PAPER : color
    let draft: Konva.Line | null = null
    let draftPoints: number[] = []

    function toLocal() {
      const pos = stage.getPointerPosition()
      if (!pos) return null
      return { x: pos.x / scale, y: pos.y / scale }
    }

    stage.on('mousedown touchstart', () => {
      if (!drawing) {
        const target = stage.getIntersection(stage.getPointerPosition() ?? { x: 0, y: 0 })
        if (!target || target === background) {
          useStampEditor.getState().selectElement(null)
          transformer.nodes([])
        }
        return
      }
      const point = toLocal()
      if (!point) return
      draftPoints = [point.x, point.y]
      draft = new Konva.Line({
        points: draftPoints,
        stroke: ink,
        strokeWidth: strokeWidth(drawMode, strokeSize),
        lineCap: 'round',
        lineJoin: 'round',
        tension: drawMode === 'marker' ? 0 : 0.3,
        opacity: drawMode === 'marker' ? 0.85 : 1,
        listening: false,
      })
      layer.add(draft)
    })

    stage.on('mousemove touchmove', () => {
      if (!draft) return
      const point = toLocal()
      if (!point) return
      draftPoints = [...draftPoints, point.x, point.y]
      draft.points(draftPoints)
      layer.batchDraw()
    })

    const finishDraft = () => {
      if (!draft) return
      if (draftPoints.length >= 4) {
        useStampEditor.getState().addElement(
          makeDrawingElement(
            drawMode,
            draftPoints,
            color,
            strokeSize,
            composition.elements.length,
          ),
        )
      }
      draft.destroy()
      draft = null
      draftPoints = []
    }
    stage.on('mouseup touchend mouseleave', finishDraft)

    const sorted = [...composition.elements].sort((a, b) => a.zIndex - b.zIndex)
    for (const element of sorted) {
      const node = createNode(element)
      if (!node) continue
      if (drawing) node.listening(false)
      if (!drawing && interactive && element.type !== 'drawing') {
        node.draggable(true)
        node.on('click tap', () => useStampEditor.getState().selectElement(element.id))
        node.on('dragend', () => {
          useStampEditor.getState().updateElement(element.id, { x: node.x(), y: node.y() })
        })
        node.on('transformend', () => {
          useStampEditor.getState().updateElement(element.id, {
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            scaleX: node.scaleX(),
            scaleY: node.scaleY(),
          })
        })
        if (element.id === selectedId) {
          transformer.keepRatio(element.type === 'photo' || element.type === 'text')
          transformer.nodes([node as Konva.Group | Konva.Shape])
        }
      }
      layer.add(node)
    }

    if (interactive) layer.add(transformer)
    layer.draw()

    return () => {
      stage.destroy()
      if (stageRef.current === stage) stageRef.current = null
    }
  }, [color, composition, displayWidth, drawMode, hostWidth, interactive, selectedId, selectedTool, stageRef, strokeSize])

  return (
    <div
      ref={hostRef}
      className="h-full w-full touch-none"
      style={{ cursor: selectedTool === 'draw' ? 'crosshair' : 'default' }}
    />
  )
}

function createNode(element: StampElement): Konva.Group | Konva.Shape | null {
  if (element.data.kind === 'drawing') {
    return new Konva.Line({
      points: element.data.points,
      stroke: element.data.color,
      strokeWidth: element.data.strokeWidth,
      lineCap: 'round',
      lineJoin: 'round',
      tension: element.data.tool === 'marker' ? 0 : 0.3,
      opacity: element.data.tool === 'marker' ? 0.85 : 1,
      listening: false,
    })
  }

  if (element.data.kind === 'text') {
    return new Konva.Text({
      x: element.x,
      y: element.y,
      width: element.width,
      text: element.data.text,
      fontSize: element.data.fontSize,
      fontFamily: FONT_FAMILY[element.data.font],
      fill: element.data.fill,
      align: element.data.align,
      rotation: element.rotation,
      scaleX: element.scaleX,
      scaleY: element.scaleY,
    })
  }

  if (element.data.kind === 'photo') {
    const image = new window.Image()
    image.src = element.data.src
    const node = new Konva.Image({
      x: element.x,
      y: element.y,
      width: element.width,
      height: element.height,
      image,
      rotation: element.rotation,
      scaleX: element.scaleX,
      scaleY: element.scaleY,
    })
    image.onload = () => node.getLayer()?.batchDraw()
    return node
  }

  const group = new Konva.Group({
    x: element.x,
    y: element.y,
    rotation: element.rotation,
    scaleX: element.scaleX,
    scaleY: element.scaleY,
  })
  addShape(group, element.data.shape, element.data.fill, element.width, element.height)
  return group
}

function addShape(group: Konva.Group, shape: string, fill: string, w: number, h: number) {
  if (shape === 'circle') group.add(new Konva.Circle({ x: w / 2, y: h / 2, radius: Math.min(w, h) / 2, fill }))
  else if (shape === 'square') group.add(new Konva.Rect({ width: w, height: h, fill }))
  else if (shape === 'triangle') group.add(new Konva.RegularPolygon({ x: w / 2, y: h / 2, sides: 3, radius: Math.min(w, h) / 2, fill }))
  else if (shape === 'star') group.add(new Konva.Star({ x: w / 2, y: h / 2, numPoints: 5, innerRadius: w * 0.2, outerRadius: w * 0.45, fill }))
  else if (shape === 'sun') {
    group.add(new Konva.Circle({ x: w / 2, y: h / 2, radius: w * 0.28, fill }))
    group.add(new Konva.Star({ x: w / 2, y: h / 2, numPoints: 8, innerRadius: w * 0.28, outerRadius: w * 0.48, fill, opacity: 0.7 }))
  } else if (shape === 'pickle') {
    group.add(new Konva.Ellipse({ x: w / 2, y: h / 2, radiusX: w * 0.28, radiusY: h * 0.42, fill: '#3F5D3B' }))
    group.add(new Konva.Circle({ x: w * 0.42, y: h * 0.42, radius: 4, fill: '#18181B' }))
    group.add(new Konva.Circle({ x: w * 0.58, y: h * 0.42, radius: 4, fill: '#18181B' }))
  } else if (shape === 'heart') {
    group.add(
      new Konva.Line({
        points: [w / 2, h * 0.9, 0, h * 0.35, w * 0.2, 0, w / 2, h * 0.25, w * 0.8, 0, w, h * 0.35],
        closed: true,
        fill,
        tension: 0.4,
      }),
    )
  } else if (shape === 'moon') {
    group.add(new Konva.Circle({ x: w / 2, y: h / 2, radius: w * 0.38, fill }))
    group.add(new Konva.Circle({ x: w * 0.66, y: h * 0.42, radius: w * 0.28, fill: DEFAULT_PAPER }))
  } else if (shape === 'sparkle') {
    group.add(new Konva.Star({ x: w / 2, y: h / 2, numPoints: 4, innerRadius: w * 0.1, outerRadius: w * 0.45, fill }))
  } else {
    group.add(new Konva.Rect({ width: w, height: h, fill }))
  }
}
