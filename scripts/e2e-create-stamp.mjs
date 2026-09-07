import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { deflateSync } from 'node:zlib'
import { chromium } from 'playwright'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const imagePath = join(root, 'tmp', 'maya-photo.png')

function crc32(buffer) {
  let crc = ~0
  for (const byte of buffer) {
    crc ^= byte
    for (let bit = 0; bit < 8; bit += 1) crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1
  }
  return ~crc >>> 0
}

function pngChunk(type, data) {
  const name = Buffer.from(type)
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length)
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(Buffer.concat([name, data])))
  return Buffer.concat([length, name, data, crc])
}

function hexToRgb(hex) {
  const value = hex.replace('#', '')
  return [Number.parseInt(value.slice(0, 2), 16), Number.parseInt(value.slice(2, 4), 16), Number.parseInt(value.slice(4, 6), 16)]
}

function writeLandscapePng(path, colors) {
  const width = 480
  const height = 270
  const row = width * 4 + 1
  const raw = Buffer.alloc(row * height)
  const vermilion = hexToRgb(colors.vermilion)
  const butter = hexToRgb(colors.butter)
  const cobalt = hexToRgb(colors.cobalt)
  for (let y = 0; y < height; y += 1) {
    raw[y * row] = 0
    for (let x = 0; x < width; x += 1) {
      const i = y * row + 1 + x * 4
      const dx = x - 240
      const dy = y - 128
      const face = dx * dx + dy * dy < 70 * 70
      raw[i] = face ? butter[0] : vermilion[0]
      raw[i + 1] = face ? butter[1] : vermilion[1]
      raw[i + 2] = face ? butter[2] : vermilion[2]
      raw[i + 3] = 255
      if ((x - 210) ** 2 + (y - 110) ** 2 < 64 || (x - 270) ** 2 + (y - 110) ** 2 < 64) {
        raw[i] = cobalt[0]
        raw[i + 1] = cobalt[1]
        raw[i + 2] = cobalt[2]
      }
    }
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8
  ihdr[9] = 6
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(
    path,
    Buffer.concat([
      Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
      pngChunk('IHDR', ihdr),
      pngChunk('IDAT', deflateSync(raw)),
      pngChunk('IEND', Buffer.alloc(0)),
    ]),
  )
}

async function stroke(page, canvas, points) {
  const box = await canvas.boundingBox()
  if (!box) throw new Error('Stamp canvas was not visible.')
  const [start, ...rest] = points
  await page.mouse.move(box.x + box.width * start[0], box.y + box.height * start[1])
  await page.mouse.down()
  for (const point of rest) {
    await page.mouse.move(box.x + box.width * point[0], box.y + box.height * point[1], { steps: 8 })
  }
  await page.mouse.up()
}

async function pickInk(page, hue, sat, val) {
  const hueBar = page.getByLabel('Hue')
  const square = page.getByLabel('Saturation and brightness')
  const hueBox = await hueBar.boundingBox()
  const squareBox = await square.boundingBox()
  if (!hueBox || !squareBox) throw new Error('Ink picker was not visible.')
  await page.mouse.click(hueBox.x + hueBox.width * hue, hueBox.y + hueBox.height / 2)
  await page.mouse.click(squareBox.x + squareBox.width * sat, squareBox.y + squareBox.height * (1 - val))
}

async function press(locator) {
  await locator.evaluate((node) => {
    if (node instanceof HTMLElement) node.click()
  })
}

writeLandscapePng(imagePath, { vermilion: '#E4462F', butter: '#F4D85E', cobalt: '#2E5BFF' })

const errors = []
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 1024 }, reducedMotion: 'reduce' })
page.on('pageerror', (error) => {
  if (!/hydrat/i.test(error.message)) errors.push(error.message)
})
page.on('console', (msg) => {
  if (msg.type() !== 'error') return
  const text = msg.text()
  if (/hydrat|Failed to load resource/i.test(text)) return
  errors.push(text)
})

await page.addInitScript(() => {
  localStorage.setItem(
    'kenzie-post-draft',
    JSON.stringify({
      composition: {
        version: 1,
        template: 'portrait',
        width: 291,
        height: 418,
        background: '#D4D0C8',
        denomination: '26¢',
        elements: [],
      },
      message: '',
      creatorName: '',
      creatorLocation: '',
    }),
  )
})

await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' })
await press(page.getByRole('link', { name: 'Create a stamp' }))
await page.waitForURL('**/create')
await press(page.getByRole('button', { name: 'Square' }))
await press(page.getByRole('button', { name: 'Continue to editor' }))
await page.waitForURL('**/create/front')
if (await page.getByText('We found your unfinished stamp.').isVisible().catch(() => false)) {
  await press(page.getByRole('button', { name: 'Continue' }))
}

await press(page.getByRole('button', { name: 'large brush' }))
const canvas = page.locator('.stamp-art canvas').first()
await canvas.waitFor({ state: 'visible' })
await page.screenshot({ path: join(root, 'tmp', 'editor-draw.png') })

await pickInk(page, 0.02, 0.95, 0.9)
await stroke(page, canvas, [
  [0.28, 0.72],
  [0.5, 0.38],
  [0.72, 0.72],
])
await pickInk(page, 0.64, 0.95, 1)
await press(page.getByRole('button', { name: 'medium brush' }))
await stroke(page, canvas, [
  [0.2, 0.22],
  [0.8, 0.22],
])
await press(page.getByRole('button', { name: 'Marker' }))
await pickInk(page, 0.72, 0.4, 1)
await stroke(page, canvas, [
  [0.18, 0.82],
  [0.82, 0.82],
])

await page.locator('input[type="file"]').setInputFiles(imagePath)
await page.waitForURL('**/create/photo', { timeout: 20000 })
const placed = await page.evaluate(() => {
  const raw = window.localStorage.getItem('kenzie-post-draft')
  if (!raw) return null
  const draft = JSON.parse(raw)
  return draft.composition.elements.find((element) => element.data?.kind === 'photo') ?? null
})
if (!placed || placed.width <= placed.height) {
  await browser.close()
  throw new Error(`Photo was squeezed: ${JSON.stringify({ width: placed?.width, height: placed?.height })}`)
}
await page.screenshot({ path: join(root, 'tmp', 'editor-photo.png') })
await page.locator('input[type="number"]').fill('70')
await press(page.getByRole('button', { name: 'Next: write the back' }))
await page.waitForURL('**/create/message')

await page.locator('#message').fill(
  'Kenzie, I still have the voicemail you left after the concert. This little stamp is that night in miniature. Happy birthday. I love you.',
)
await page.locator('#creatorName').fill('Jules')
await page.locator('#creatorLocation').fill('Montreal')
await press(page.getByRole('button', { name: 'Next: preview' }))
await page.waitForURL('**/create/preview')

const paletteError = page.getByText('Background must use the project palette.')
const posted = page.getByText(/has joined the archive/)
await press(page.getByRole('button', { name: 'Post stamp' }))
const outcome = await Promise.race([
  posted.waitFor({ timeout: 25000 }).then(() => 'posted'),
  paletteError.waitFor({ timeout: 25000 }).then(() => 'palette-error'),
])

if (outcome !== 'posted') {
  await browser.close()
  throw new Error(`Post failed: ${outcome}. page errors: ${errors.join(' | ')}`)
}

const draft = await page.evaluate(() => localStorage.getItem('kenzie-post-draft'))
const openHref = await page.getByRole('link', { name: 'Open stamp' }).getAttribute('href')
await press(page.getByRole('link', { name: 'Open stamp' }))
await page.waitForURL('**/stamp/**')
const sender = await page.getByText('Jules').count()
const message = await page.getByText(/voicemail you left after the concert/).count()
const stampImage = await page.locator('img[alt^="Front of"]').count()
const flipHint = await page.getByText('Click to see the front').count()
await press(page.getByRole('button', { name: 'Show front of stamp' }))
await page.getByText('Click to see the back').waitFor({ timeout: 4000 })

await page.goto('http://localhost:3000/?posted=' + encodeURIComponent(openHref?.replace('/stamp/', '') ?? ''), {
  waitUntil: 'networkidle',
})
const archiveHasMaya = await page.getByLabel(/made by Jules/i).count()

await browser.close()

const summary = {
  outcome,
  openHref,
  sender,
  message,
  stampImage,
  flipHint,
  archiveHasSender: archiveHasMaya,
  draftCleared: draft === null,
  errors: errors.length,
}
console.log(JSON.stringify(summary, null, 2))
if (errors.length) {
  console.log('page errors:')
  for (const error of errors) console.log('-', error)
}
if (!sender || !message || !stampImage || !flipHint || !archiveHasMaya) {
  process.exitCode = 1
}
