function hashString(value: string) {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

export function recruitStats(id: string, division: string) {
  const seed = hashString(`${id}:${division}`)
  const stat = (offset: number) => 40 + ((seed >> offset) % 61)
  return {
    loyalty: stat(0),
    chaos: division === 'chaos' ? Math.min(99, stat(6) + 20) : stat(6),
    brine: stat(12),
    bravery: stat(18),
  }
}
