import assert from 'node:assert/strict'
import { DEFAULT_PAPER, isPaletteColor } from '../lib/palette'
import { hexToHsv, hsvToHex } from '../lib/color'
import { fitPhotoBox, photoFileError } from '../lib/stamp/photo'
import { getLocalStamp, listLocalStamps, LOCAL_STAMPS_KEY, saveLocalStamp } from '../lib/stamps/local'
import { createEmptyComposition } from '../lib/stamp/composition'
import { clamp, computeGridArrangement } from '../lib/stamp/layout'
import { stampCompositionSchema } from '../lib/validation'

const store = new Map<string, string>()
;(globalThis as { window?: unknown }).window = {
  localStorage: {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value)
    },
    removeItem: (key: string) => {
      store.delete(key)
    },
  },
}

const heic = new File([new Uint8Array([1, 2, 3])], 'kenzie.heic', { type: 'image/heic' })
assert.match(photoFileError(heic) ?? '', /HEIC/)

const huge = new File([new Uint8Array(16 * 1024 * 1024)], 'kenzie.jpg', { type: 'image/jpeg' })
assert.match(photoFileError(huge) ?? '', /15 MB/)

const gif = new File([new Uint8Array([1])], 'kenzie.gif', { type: 'image/gif' })
assert.match(photoFileError(gif) ?? '', /JPEG/)

const ok = new File([new Uint8Array([1])], 'kenzie.jpg', { type: 'image/jpeg' })
assert.equal(photoFileError(ok), null)

const preview = 'data:image/webp;base64,AAAA'
const stamp = saveLocalStamp({
  id: '11111111-1111-1111-1111-111111111111',
  creatorName: 'Santi',
  creatorLocation: 'Toronto',
  message: 'A keepsake for Kenzie.',
  composition: createEmptyComposition(),
  preview,
})

assert.equal(stamp.local, true)
assert.ok(stamp.slug.startsWith('local-'))
assert.equal(listLocalStamps().length, 1)
assert.equal(getLocalStamp(stamp.slug)?.preview_url, preview)
assert.ok(store.get(LOCAL_STAMPS_KEY)?.includes('Santi'))

const fresh = createEmptyComposition()
assert.equal(isPaletteColor(fresh.background), true)
assert.equal(stampCompositionSchema.parse(fresh).background, DEFAULT_PAPER)

const staleCanvas = { ...createEmptyComposition(), background: '#D4D0C8' }
const stalePaper = { ...createEmptyComposition(), background: '#F6F1E7' }
assert.equal(isPaletteColor(staleCanvas.background), false)
assert.equal(isPaletteColor(stalePaper.background), false)
assert.equal(stampCompositionSchema.parse(staleCanvas).background, DEFAULT_PAPER)
assert.equal(stampCompositionSchema.parse(stalePaper).background, DEFAULT_PAPER)

assert.equal(clamp(0, 10, -4), 0)
assert.equal(clamp(0, 10, 22), 10)
assert.equal(clamp(0, 10, 7), 7)

const packed = computeGridArrangement({
  containerWidth: 640,
  containerHeight: 280,
  paddingX: 24,
  paddingY: 24,
  gap: 12,
  children: [
    { id: 'a', width: 180, height: 180 },
    { id: 'b', width: 180, height: 180 },
    { id: 'c', width: 180, height: 180 },
  ],
})
assert.equal(packed.length, 3)
assert.equal(packed.every((node) => node.fit), true)
assert.ok(packed[0].x < packed[1].x)
assert.equal(packed[0].y, packed[1].y)

const overflow = computeGridArrangement({
  containerWidth: 220,
  containerHeight: 220,
  paddingX: 10,
  paddingY: 10,
  gap: 8,
  children: [
    { id: 'a', width: 180, height: 180 },
    { id: 'b', width: 180, height: 180 },
  ],
})
assert.equal(overflow[0].fit, true)
assert.equal(overflow[1].fit, false)
assert.equal(overflow[1].x, overflow[0].x)

const landscape = fitPhotoBox(1600, 900, 291, 418)
assert.ok(landscape.width > landscape.height)
assert.ok(landscape.width <= 291 * 0.92 + 0.01)
assert.equal(Number((landscape.width / landscape.height).toFixed(2)), Number((1600 / 900).toFixed(2)))

const portrait = fitPhotoBox(900, 1600, 460, 300)
assert.ok(portrait.height > portrait.width)
assert.equal(Number((portrait.height / portrait.width).toFixed(2)), Number((1600 / 900).toFixed(2)))

assert.equal(hsvToHex(0, 1, 1).toLowerCase(), '#ff0000')
assert.equal(hsvToHex(120, 1, 1).toLowerCase(), '#00ff00')
const parsed = hexToHsv('#00FF00')
assert.ok(parsed)
assert.ok(Math.abs(parsed.h - 120) < 0.51)

console.log('create-flow helpers: ok')
