function hashString(value: string) {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

export function formationSlot(id: string, index: number, total: number) {
  const cols = Math.min(10, Math.max(4, Math.ceil(Math.sqrt(total * 1.6))))
  const row = Math.floor(index / cols)
  const col = index % cols
  const rows = Math.max(1, Math.ceil(total / cols))
  const jitter = hashString(id)
  const x = ((col + 0.5) / cols) * 100 + ((jitter % 9) - 4)
  const y = ((row + 0.55) / rows) * 100 + (((jitter >> 4) % 7) - 3)
  return {
    x: Math.min(96, Math.max(4, x)),
    y: Math.min(90, Math.max(8, y)),
    row,
    col,
  }
}
