export const PHOTO_MAX_BYTES = 15 * 1024 * 1024
export const PHOTO_MAX_EDGE = 900
const ACCEPTED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/jpg'])

export function photoFileError(file: File) {
  if (file.size > PHOTO_MAX_BYTES) return 'Photographs must be under 15 MB.'
  const name = file.name.toLowerCase()
  const type = file.type.toLowerCase()
  if (type.includes('heic') || type.includes('heif') || name.endsWith('.heic') || name.endsWith('.heif')) {
    return 'Save the photo as JPEG or PNG first. iPhone HEIC files cannot be placed on the stamp.'
  }
  if (type && !ACCEPTED.has(type)) return 'Use a JPEG, PNG, or WebP photograph.'
  return null
}

export function fitPhotoBox(imageWidth: number, imageHeight: number, canvasWidth: number, canvasHeight: number) {
  const srcW = Math.max(1, imageWidth)
  const srcH = Math.max(1, imageHeight)
  const maxW = canvasWidth * 0.92
  const maxH = canvasHeight * 0.92
  const scale = Math.min(maxW / srcW, maxH / srcH)
  const width = Math.max(1, srcW * scale)
  const height = Math.max(1, srcH * scale)
  return {
    width,
    height,
    x: (canvasWidth - width) / 2,
    y: (canvasHeight - height) / 2,
  }
}

export function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('The photograph could not be read.'))
    reader.readAsDataURL(file)
  })
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('That photograph could not be opened.'))
    image.src = src
  })
}

export async function preparePhoto(src: string, maxEdge = PHOTO_MAX_EDGE) {
  const image = await loadImage(src)
  const sourceW = Math.max(1, image.naturalWidth)
  const sourceH = Math.max(1, image.naturalHeight)
  const scale = Math.min(1, maxEdge / Math.max(sourceW, sourceH))
  const width = Math.max(1, Math.round(sourceW * scale))
  const height = Math.max(1, Math.round(sourceH * scale))
  if (scale === 1 && src.startsWith('data:image/')) {
    return { src, width: sourceW, height: sourceH }
  }

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('The photograph could not be prepared.')
  ctx.drawImage(image, 0, 0, width, height)
  return { src: toCompressedDataUrl(canvas), width, height }
}

function toCompressedDataUrl(canvas: HTMLCanvasElement) {
  const webp = canvas.toDataURL('image/webp', 0.82)
  if (webp.startsWith('data:image/webp')) return webp
  return canvas.toDataURL('image/jpeg', 0.84)
}

export async function cropAndCompress(
  imageSrc: string,
  cropped: { x: number; y: number; width: number; height: number },
  bw: boolean,
  maxEdge = PHOTO_MAX_EDGE,
) {
  const image = await loadImage(imageSrc)
  const sourceW = Math.max(1, Math.round(cropped.width))
  const sourceH = Math.max(1, Math.round(cropped.height))
  const scale = Math.min(1, maxEdge / Math.max(sourceW, sourceH))
  const width = Math.max(1, Math.round(sourceW * scale))
  const height = Math.max(1, Math.round(sourceH * scale))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('The photograph could not be cropped.')

  ctx.drawImage(image, cropped.x, cropped.y, cropped.width, cropped.height, 0, 0, width, height)

  if (bw) {
    const pixels = ctx.getImageData(0, 0, width, height)
    for (let i = 0; i < pixels.data.length; i += 4) {
      const avg = pixels.data[i] * 0.3 + pixels.data[i + 1] * 0.59 + pixels.data[i + 2] * 0.11
      pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = avg
    }
    ctx.putImageData(pixels, 0, 0)
  }

  return toCompressedDataUrl(canvas)
}
