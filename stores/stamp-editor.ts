'use client'

import { create } from 'zustand'
import { DEFAULT_INK, DEFAULT_PAPER } from '@/lib/palette'
import { cloneComposition, canonicalizeComposition, createEmptyComposition } from '@/lib/stamp/composition'
import { fitPhotoBox } from '@/lib/stamp/photo'
import { getTemplate, normalizeTemplate } from '@/lib/templates'
import type {
  DrawMode,
  EditorTool,
  StampComposition,
  StampDraft,
  StampElement,
  StampTemplate,
  StrokeSize,
} from '@/types/stamp'

export const DRAFT_KEY = 'kenzie-post-draft'
const HISTORY_LIMIT = 60

const STROKE: Record<StrokeSize, { pencil: number; marker: number; eraser: number }> = {
  small: { pencil: 2.5, marker: 8, eraser: 16 },
  medium: { pencil: 4.5, marker: 14, eraser: 26 },
  large: { pencil: 8, marker: 22, eraser: 40 },
}

type EditorStore = {
  composition: StampComposition
  selectedId: string | null
  selectedTool: EditorTool
  drawMode: DrawMode
  color: string
  strokeSize: StrokeSize
  history: StampComposition[]
  historyIndex: number
  message: string
  creatorName: string
  creatorLocation: string
  hydrated: boolean
  setTemplate: (template: StampTemplate) => void
  setDenomination: (value: string) => void
  setBackground: (value: string) => void
  setTool: (tool: EditorTool) => void
  setDrawMode: (mode: DrawMode) => void
  setColor: (color: string) => void
  setStrokeSize: (size: StrokeSize) => void
  setMessage: (value: string) => void
  setCreatorName: (value: string) => void
  setCreatorLocation: (value: string) => void
  selectElement: (id: string | null) => void
  addElement: (element: StampElement) => void
  updateElement: (id: string, patch: Partial<StampElement>) => void
  removeSelected: () => void
  duplicateSelected: () => void
  bringForward: () => void
  sendBackward: () => void
  commit: (next: StampComposition) => void
  undo: () => void
  redo: () => void
  hydrate: () => 'empty' | 'draft'
  reset: () => void
  persist: () => void
}

function uid() {
  return crypto.randomUUID()
}

function draftFromState(state: Pick<EditorStore, 'composition' | 'message' | 'creatorName' | 'creatorLocation'>): StampDraft {
  return {
    composition: state.composition,
    message: state.message,
    creatorName: state.creatorName,
    creatorLocation: state.creatorLocation,
  }
}

export function strokeWidth(tool: 'pencil' | 'marker' | 'eraser', size: StrokeSize) {
  return STROKE[size][tool]
}

export const useStampEditor = create<EditorStore>((set, get) => ({
  composition: createEmptyComposition(),
  selectedId: null,
  selectedTool: 'draw',
  drawMode: 'pencil',
  color: DEFAULT_INK,
  strokeSize: 'medium',
  history: [createEmptyComposition()],
  historyIndex: 0,
  message: '',
  creatorName: '',
  creatorLocation: '',
  hydrated: false,
  setTemplate: (template) => {
    const spec = getTemplate(template)
    const current = get().composition
    get().commit({
      ...current,
      template,
      width: spec.width,
      height: spec.height,
    })
  },
  setDenomination: (denomination) => {
    get().commit({ ...get().composition, denomination })
  },
  setBackground: (background) => {
    get().commit({ ...get().composition, background })
  },
  setTool: (selectedTool) => set({ selectedTool, selectedId: selectedTool === 'select' ? get().selectedId : null }),
  setDrawMode: (drawMode) => set({ drawMode, selectedTool: 'draw' }),
  setColor: (color) => set({ color }),
  setStrokeSize: (strokeSize) => set({ strokeSize }),
  setMessage: (message) => {
    set({ message })
    get().persist()
  },
  setCreatorName: (creatorName) => {
    set({ creatorName })
    get().persist()
  },
  setCreatorLocation: (creatorLocation) => {
    set({ creatorLocation })
    get().persist()
  },
  selectElement: (selectedId) => set({ selectedId, selectedTool: 'select' }),
  addElement: (element) => {
    const composition = get().composition
    get().commit({ ...composition, elements: [...composition.elements, element] })
    set({ selectedId: element.id })
  },
  updateElement: (id, patch) => {
    const composition = get().composition
    get().commit({
      ...composition,
      elements: composition.elements.map((element) => (element.id === id ? { ...element, ...patch } : element)),
    })
  },
  removeSelected: () => {
    const { selectedId, composition } = get()
    if (!selectedId) return
    get().commit({
      ...composition,
      elements: composition.elements.filter((element) => element.id !== selectedId),
    })
    set({ selectedId: null })
  },
  duplicateSelected: () => {
    const { selectedId, composition } = get()
    const current = composition.elements.find((element) => element.id === selectedId)
    if (!current) return
    const copy: StampElement = {
      ...structuredClone(current),
      id: uid(),
      x: current.x + 16,
      y: current.y + 16,
      zIndex: composition.elements.length,
    }
    get().addElement(copy)
  },
  bringForward: () => {
    const { selectedId, composition } = get()
    if (!selectedId) return
    get().commit({
      ...composition,
      elements: composition.elements.map((element) =>
        element.id === selectedId ? { ...element, zIndex: element.zIndex + 1 } : element,
      ),
    })
  },
  sendBackward: () => {
    const { selectedId, composition } = get()
    if (!selectedId) return
    get().commit({
      ...composition,
      elements: composition.elements.map((element) =>
        element.id === selectedId ? { ...element, zIndex: Math.max(0, element.zIndex - 1) } : element,
      ),
    })
  },
  commit: (next) => {
    const history = get().history.slice(0, get().historyIndex + 1)
    history.push(cloneComposition(next))
    if (history.length > HISTORY_LIMIT) history.shift()
    set({
      composition: next,
      history,
      historyIndex: history.length - 1,
    })
    get().persist()
  },
  undo: () => {
    const { historyIndex, history } = get()
    if (historyIndex <= 0) return
    const nextIndex = historyIndex - 1
    set({ historyIndex: nextIndex, composition: cloneComposition(history[nextIndex]) })
    get().persist()
  },
  redo: () => {
    const { historyIndex, history } = get()
    if (historyIndex >= history.length - 1) return
    const nextIndex = historyIndex + 1
    set({ historyIndex: nextIndex, composition: cloneComposition(history[nextIndex]) })
    get().persist()
  },
  hydrate: () => {
    if (typeof window === 'undefined') return 'empty'
    if (get().hydrated) {
      const current = get()
      return current.composition.elements.length > 0 || current.message || current.creatorName ? 'draft' : 'empty'
    }
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY)
      if (!raw) {
        set({ hydrated: true })
        return 'empty'
      }
      const draft = JSON.parse(raw) as StampDraft
      if (!draft?.composition) {
        set({ hydrated: true })
        return 'empty'
      }
      const template = normalizeTemplate(String(draft.composition.template))
      const spec = getTemplate(template)
      const composition = canonicalizeComposition({
        ...draft.composition,
        template,
        width: spec.width,
        height: spec.height,
      })
      set({
        composition,
        message: draft.message ?? '',
        creatorName: draft.creatorName ?? '',
        creatorLocation: draft.creatorLocation ?? '',
        history: [composition],
        historyIndex: 0,
        hydrated: true,
      })
      get().persist()
      return 'draft'
    } catch {
      set({ hydrated: true })
      return 'empty'
    }
  },
  reset: () => {
    const composition = createEmptyComposition()
    set({
      composition,
      selectedId: null,
      selectedTool: 'draw',
      drawMode: 'pencil',
      history: [composition],
      historyIndex: 0,
      message: '',
      creatorName: '',
      creatorLocation: '',
      hydrated: true,
    })
    if (typeof window !== 'undefined') window.localStorage.removeItem(DRAFT_KEY)
  },
  persist: () => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draftFromState(get())))
    } catch {
      try {
        const draft = draftFromState(get())
        const stripped = {
          ...draft,
          composition: {
            ...draft.composition,
            elements: draft.composition.elements.map((element) =>
              element.data.kind === 'photo'
                ? { ...element, data: { ...element.data, src: '' } }
                : element,
            ),
          },
        }
        window.localStorage.setItem(DRAFT_KEY, JSON.stringify(stripped))
      } catch {
        // Draft stays in memory if the browser will not store it.
      }
    }
  },
}))

export function makeDrawingElement(
  tool: 'pencil' | 'marker' | 'eraser',
  points: number[],
  color: string,
  size: StrokeSize,
  zIndex: number,
): StampElement {
  return {
    id: uid(),
    type: 'drawing',
    x: 0,
    y: 0,
    width: 1,
    height: 1,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    opacity: 1,
    zIndex,
    data: {
      kind: 'drawing',
      tool,
      points,
      color: tool === 'eraser' ? DEFAULT_PAPER : color,
      strokeWidth: strokeWidth(tool, size),
    },
  }
}

export function makeShapeElement(shape: string, color: string, width: number, height: number, zIndex: number): StampElement {
  return {
    id: uid(),
    type: 'shape',
    x: width / 2 - 48,
    y: height / 2 - 48,
    width: 96,
    height: 96,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    opacity: 1,
    zIndex,
    data: { kind: 'shape', shape, fill: color },
  }
}

export function makeTextElement(color: string, width: number, height: number, zIndex: number): StampElement {
  return {
    id: uid(),
    type: 'text',
    x: width / 2 - 90,
    y: height / 2 - 20,
    width: 180,
    height: 48,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    opacity: 1,
    zIndex,
    data: {
      kind: 'text',
      text: 'KENZIE',
      font: 'serif',
      fill: color,
      align: 'center',
      fontSize: 28,
    },
  }
}

export function makePhotoElement(
  src: string,
  canvasWidth: number,
  canvasHeight: number,
  zIndex: number,
  imageWidth: number,
  imageHeight: number,
): StampElement {
  const box = fitPhotoBox(imageWidth, imageHeight, canvasWidth, canvasHeight)
  return {
    id: uid(),
    type: 'photo',
    x: box.x,
    y: box.y,
    width: box.width,
    height: box.height,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    opacity: 1,
    zIndex,
    data: { kind: 'photo', src, filter: 'original' },
  }
}
