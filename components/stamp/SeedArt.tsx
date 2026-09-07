const INKS: Record<string, { ink: string; paper: string }> = {
  founder: { ink: '#1d4ed8', paper: '#dbe4ff' },
  rose: { ink: '#c2410c', paper: '#ffedd5' },
  train: { ink: '#6d28d9', paper: '#ede9fe' },
  olive: { ink: '#3f6212', paper: '#ecfccb' },
  moon: { ink: '#1e3a5f', paper: '#dbeafe' },
  letter: { ink: '#9f1239', paper: '#ffe4e6' },
}

export function seedInk(kind?: string) {
  return INKS[kind ?? 'founder']?.ink ?? '#1c1917'
}

export function SeedArt({ kind }: { kind?: string }) {
  const palette = INKS[kind ?? 'founder'] ?? INKS.founder
  const { ink, paper } = palette

  if (kind === 'rose') {
    return (
      <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden>
        <rect width="200" height="200" fill={paper} />
        <circle cx="100" cy="92" r="36" fill={ink} />
        <circle cx="100" cy="92" r="14" fill={paper} />
        <path d="M100 128c2 26-16 42-16 42" fill="none" stroke={ink} strokeWidth="6" />
        <text x="22" y="182" fill={ink} fontFamily="IBM Plex Mono, monospace" fontSize="12">
          TORONTO
        </text>
      </svg>
    )
  }
  if (kind === 'train') {
    return (
      <svg viewBox="0 0 280 180" className="h-full w-full" aria-hidden>
        <rect width="280" height="180" fill={paper} />
        <rect x="36" y="62" width="156" height="52" fill={ink} />
        <rect x="198" y="80" width="38" height="34" fill={ink} />
        <circle cx="76" cy="128" r="11" fill={ink} />
        <circle cx="166" cy="128" r="11" fill={ink} />
        <text x="36" y="42" fill={ink} fontFamily="IBM Plex Mono, monospace" fontSize="14">
          MONTREAL
        </text>
      </svg>
    )
  }
  if (kind === 'olive') {
    return (
      <svg viewBox="0 0 180 260" className="h-full w-full" aria-hidden>
        <rect width="180" height="260" fill={paper} />
        <ellipse cx="90" cy="128" rx="28" ry="50" fill={ink} />
        <ellipse cx="82" cy="112" rx="8" ry="12" fill={paper} opacity="0.35" />
        <text x="24" y="228" fill={ink} fontFamily="IBM Plex Mono, monospace" fontSize="13">
          BROOKLYN
        </text>
      </svg>
    )
  }
  if (kind === 'moon') {
    return (
      <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden>
        <rect width="200" height="200" fill={paper} />
        <circle cx="108" cy="90" r="36" fill={ink} />
        <circle cx="124" cy="80" r="24" fill={paper} />
        <text x="28" y="176" fill={ink} fontFamily="IBM Plex Mono, monospace" fontSize="13">
          LONDON
        </text>
      </svg>
    )
  }
  if (kind === 'letter') {
    return (
      <svg viewBox="0 0 200 240" className="h-full w-full" aria-hidden>
        <rect width="200" height="240" fill={paper} />
        <rect x="40" y="78" width="120" height="82" fill={ink} />
        <path d="M40 78l60 42 60-42" fill={paper} />
        <text x="24" y="210" fill={ink} fontFamily="IBM Plex Mono, monospace" fontSize="12">
          VANCOUVER
        </text>
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 200 240" className="h-full w-full" aria-hidden>
      <rect width="200" height="240" fill={paper} />
      <ellipse cx="100" cy="118" rx="26" ry="50" fill={ink} />
      <circle cx="91" cy="108" r="4" fill={paper} />
      <circle cx="109" cy="108" r="4" fill={paper} />
      <text x="32" y="210" fill={ink} fontFamily="IBM Plex Mono, monospace" fontSize="13">
        TORONTO
      </text>
    </svg>
  )
}
