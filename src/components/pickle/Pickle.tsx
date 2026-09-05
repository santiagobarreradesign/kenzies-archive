import type { Appearance, IdleAction } from '../../lib/types'
import { BODIES, COLORS } from './catalog'

type PickleProps = Appearance & {
  size?: number
  action?: IdleAction
  className?: string
  title?: string
}

function Body({ id, fill, shade, highlight }: { id: Appearance['body']; fill: string; shade: string; highlight: string }) {
  if (id === 'tall') {
    return (
      <g>
        <ellipse cx="100" cy="148" rx="36" ry="72" fill={fill} />
        <ellipse cx="86" cy="130" rx="10" ry="28" fill={highlight} opacity="0.45" />
        <ellipse cx="118" cy="168" rx="7" ry="16" fill={shade} opacity="0.35" />
      </g>
    )
  }
  if (id === 'stubby') {
    return (
      <g>
        <ellipse cx="100" cy="155" rx="52" ry="48" fill={fill} />
        <ellipse cx="82" cy="146" rx="12" ry="18" fill={highlight} opacity="0.4" />
      </g>
    )
  }
  if (id === 'tiny') {
    return (
      <g>
        <ellipse cx="100" cy="150" rx="32" ry="38" fill={fill} />
        <ellipse cx="88" cy="140" rx="8" ry="14" fill={highlight} opacity="0.45" />
      </g>
    )
  }
  if (id === 'curved') {
    return (
      <g>
        <path d="M78 78c-18 28-10 78 10 104 14 18 40 24 58 8 20-18 18-62-2-96-12-20-42-32-66-16z" fill={fill} />
        <path d="M88 100c-6 18-2 40 8 54" stroke={highlight} strokeWidth="8" strokeLinecap="round" opacity="0.4" fill="none" />
      </g>
    )
  }
  return (
    <g>
      <ellipse cx="100" cy="148" rx="48" ry="62" fill={fill} />
      <ellipse cx="82" cy="132" rx="12" ry="24" fill={highlight} opacity="0.42" />
      <ellipse cx="124" cy="168" rx="9" ry="18" fill={shade} opacity="0.28" />
    </g>
  )
}

function Eyes({ id, y }: { id: Appearance['eyes']; y: number }) {
  const left = 82
  const right = 118
  if (id === 'sleepy') {
    return (
      <g stroke="#2a2418" strokeWidth="3" fill="none" strokeLinecap="round">
        <path d={`M${left - 8} ${y}h16`} />
        <path d={`M${right - 8} ${y}h16`} />
      </g>
    )
  }
  if (id === 'blank') {
    return (
      <g fill="#2a2418">
        <circle cx={left} cy={y} r="5" />
        <circle cx={right} cy={y} r="5" />
      </g>
    )
  }
  if (id === 'angry') {
    return (
      <g>
        <path d={`M${left - 12} ${y - 10}l20 6`} stroke="#2a2418" strokeWidth="3" />
        <path d={`M${right + 12} ${y - 10}l-20 6`} stroke="#2a2418" strokeWidth="3" />
        <circle cx={left} cy={y} r="7" fill="#fffdf6" />
        <circle cx={right} cy={y} r="7" fill="#fffdf6" />
        <circle cx={left} cy={y} r="3.5" fill="#2a2418" />
        <circle cx={right} cy={y} r="3.5" fill="#2a2418" />
      </g>
    )
  }
  if (id === 'wink') {
    return (
      <g>
        <circle cx={left} cy={y} r="8" fill="#fffdf6" />
        <circle cx={left} cy={y} r="3.5" fill="#2a2418" />
        <path d={`M${right - 9} ${y}c4 6 14 6 18 0`} stroke="#2a2418" strokeWidth="3" fill="none" />
      </g>
    )
  }
  if (id === 'heart') {
    return (
      <g fill="#b42318">
        <path d={`M${left} ${y + 4}c-6-8 4-12 8-6 4-6 14-2 8 6-4 6-8 8-8 8s-4-2-8-8z`} />
        <path d={`M${right} ${y + 4}c-6-8 4-12 8-6 4-6 14-2 8 6-4 6-8 8-8 8s-4-2-8-8z`} />
      </g>
    )
  }
  if (id === 'dizzy') {
    return (
      <g stroke="#2a2418" strokeWidth="2.5" fill="none">
        <path d={`M${left - 7} ${y - 7}l14 14M${left - 7} ${y + 7}l14-14`} />
        <path d={`M${right - 7} ${y - 7}l14 14M${right - 7} ${y + 7}l14-14`} />
      </g>
    )
  }
  return (
    <g>
      <circle cx={left} cy={y} r="9" fill="#fffdf6" />
      <circle cx={right} cy={y} r="9" fill="#fffdf6" />
      <circle cx={left + 1} cy={y} r="4" fill="#2a2418" />
      <circle cx={right + 1} cy={y} r="4" fill="#2a2418" />
      {id === 'sparkle' ? (
        <g fill="#fff">
          <circle cx={left - 3} cy={y - 3} r="1.8" />
          <circle cx={right - 3} cy={y - 3} r="1.8" />
        </g>
      ) : null}
    </g>
  )
}

function Mouth({ id, y }: { id: Appearance['mouth']; y: number }) {
  if (id === 'scream') return <ellipse cx="100" cy={y + 2} rx="10" ry="9" fill="#2a2418" />
  if (id === 'tiny') return <path d={`M94 ${y}c3 4 9 4 12 0`} stroke="#2a2418" strokeWidth="3" fill="none" strokeLinecap="round" />
  if (id === 'frown') return <path d={`M88 ${y + 6}c8-8 16-8 24 0`} stroke="#2a2418" strokeWidth="3" fill="none" strokeLinecap="round" />
  if (id === 'smug') return <path d={`M86 ${y}c10 2 22-6 30 2`} stroke="#2a2418" strokeWidth="3" fill="none" strokeLinecap="round" />
  if (id === 'tongue') {
    return (
      <g>
        <path d={`M88 ${y}c8 10 16 10 24 0`} stroke="#2a2418" strokeWidth="3" fill="none" />
        <path d={`M98 ${y + 2}c2 10 8 10 10 0`} fill="#e07a7a" />
      </g>
    )
  }
  return <path d={`M86 ${y}c8 12 20 12 28 0`} stroke="#2a2418" strokeWidth="3" fill="none" strokeLinecap="round" />
}

function Hat({ id, y }: { id: Appearance['hat']; y: number }) {
  if (id === 'none') return null
  if (id === 'cowboy') {
    return (
      <g>
        <ellipse cx="100" cy={y + 8} rx="46" ry="8" fill="#6b4423" />
        <path d={`M78 ${y + 6}c0-20 44-20 44 0v8H78z`} fill="#8a5a2b" />
      </g>
    )
  }
  if (id === 'crown') {
    return <path d={`M70 ${y + 10}l10-16 10 10 10-14 10 14 10-10 10 16z`} fill="#d4a017" stroke="#a67c0a" />
  }
  if (id === 'party') {
    return (
      <g>
        <path d={`M100 ${y - 18}l22 30H78z`} fill="#7b2d3b" />
        <circle cx="100" cy={y - 20} r="5" fill="#d4a017" />
      </g>
    )
  }
  if (id === 'wizard') {
    return (
      <g>
        <path d={`M100 ${y - 28}l24 38H76z`} fill="#3b2d6b" />
        <ellipse cx="100" cy={y + 10} rx="30" ry="6" fill="#2a2050" />
      </g>
    )
  }
  if (id === 'helmet') {
    return (
      <g>
        <path d={`M70 ${y + 12}c0-28 60-28 60 0v6H70z`} fill="#6d7278" />
        <rect x="96" y={y - 8} width="8" height="18" fill="#d4a017" />
      </g>
    )
  }
  if (id === 'bow') {
    return <path d={`M78 ${y + 4}c10-16 16-2 22 2 6-4 12-18 22-2-8 6-14 4-22 2-8 2-14 4-22-2z`} fill="#7b2d3b" />
  }
  if (id === 'beret') {
    return <ellipse cx="96" cy={y + 6} rx="28" ry="10" fill="#7b2d3b" />
  }
  if (id === 'chef') {
    return (
      <g fill="#fffdf6" stroke="#d8d0bc">
        <ellipse cx="100" cy={y} rx="24" ry="14" />
        <rect x="86" y={y} width="28" height="16" />
      </g>
    )
  }
  return (
    <g>
      <ellipse cx="100" cy={y + 10} rx="28" ry="6" fill="#1d3a66" />
      <rect x="78" y={y - 6} width="44" height="16" fill="#244a80" rx="3" />
    </g>
  )
}

function Accessory({ id, y }: { id: Appearance['accessory']; y: number }) {
  if (id === 'none') return null
  if (id === 'sword') return <path d={`M148 ${y}l22-28`} stroke="#c0c6ce" strokeWidth="5" strokeLinecap="round" />
  if (id === 'cake') {
    return (
      <g>
        <rect x="34" y={y + 10} width="26" height="16" rx="3" fill="#f4d7e3" />
        <rect x="34" y={y + 4} width="26" height="8" fill="#7b2d3b" />
        <rect x="44" y={y - 6} width="4" height="10" fill="#d4a017" />
      </g>
    )
  }
  if (id === 'flowers') {
    return (
      <g fill="#d46a8c">
        <circle cx="42" cy={y} r="6" />
        <circle cx="52" cy={y + 8} r="5" />
        <circle cx="36" cy={y + 10} r="4" fill="#d4a017" />
      </g>
    )
  }
  if (id === 'shield') return <path d={`M150 ${y - 10}c16 4 16 24 0 36-16-12-16-32 0-36z`} fill="#d4a017" stroke="#a67c0a" />
  if (id === 'wand') {
    return (
      <g>
        <path d={`M150 ${y + 20}l18-34`} stroke="#6b4423" strokeWidth="4" />
        <circle cx="170" cy={y - 16} r="5" fill="#d4a017" />
      </g>
    )
  }
  if (id === 'purse') return <rect x="36" y={y + 8} width="20" height="16" rx="4" fill="#7b2d3b" />
  if (id === 'flag') {
    return (
      <g>
        <path d={`M150 ${y - 20}v44`} stroke="#6b4423" strokeWidth="3" />
        <path d={`M150 ${y - 20}h22l-4 8 4 8H150z`} fill="#b42318" />
      </g>
    )
  }
  if (id === 'balloon') {
    return (
      <g>
        <ellipse cx="156" cy={y - 18} rx="12" ry="16" fill="#7b2d3b" />
        <path d={`M156 ${y - 2}c0 10-6 16-6 22`} stroke="#2a2418" fill="none" />
      </g>
    )
  }
  return <path d={`M36 ${y + 18}c8-18 18-8 22 6`} stroke="#c0c6ce" strokeWidth="4" fill="none" />
}

function EffectLayer({ id }: { id: Appearance['effect'] }) {
  if (id === 'sparkles') {
    return (
      <g fill="#d4a017">
        <circle cx="46" cy="70" r="3" />
        <circle cx="160" cy="90" r="2.5" />
        <circle cx="58" cy="200" r="2" />
      </g>
    )
  }
  if (id === 'aura') return <ellipse cx="100" cy="140" rx="78" ry="96" fill="none" stroke="#d4a017" strokeWidth="4" opacity="0.45" />
  if (id === 'hearts') {
    return (
      <g fill="#e07a7a">
        <circle cx="48" cy="86" r="4" />
        <circle cx="158" cy="70" r="3" />
      </g>
    )
  }
  return null
}

export function Pickle({
  body,
  eyes,
  mouth,
  hat,
  accessory,
  color,
  effect,
  size = 180,
  action = 'idle',
  className,
  title,
}: PickleProps) {
  const palette = COLORS.find((item) => item.id === color) ?? COLORS[0]
  const headY = BODIES.find((item) => item.id === body)?.headY ?? 82
  const actionClass = action === 'idle' ? 'pickle-idle' : `pickle-${action}`

  return (
    <svg
      viewBox="0 0 200 240"
      width={size}
      height={size * 1.2}
      className={`pickle ${actionClass} ${className ?? ''}`}
      role="img"
      aria-label={title ?? 'Pickle recruit'}
    >
      <title>{title ?? 'Pickle recruit'}</title>
      <EffectLayer id={effect} />
      <g className="pickle-figure">
        <Body id={body} fill={palette.fill} shade={palette.shade} highlight={palette.highlight} />
        <ellipse cx="100" cy={headY - 18} rx="7" ry="10" fill="#2d4a18" />
        <Eyes id={eyes} y={headY} />
        <Mouth id={mouth} y={headY + 26} />
        <Hat id={hat} y={headY - 28} />
        <Accessory id={accessory} y={headY + 40} />
      </g>
    </svg>
  )
}

export function appearanceFromRecruit(recruit: {
  body: string
  eyes: string
  mouth: string
  hat: string | null
  accessory: string | null
  color: string
  effect: string | null
}): Appearance {
  return {
    body: (recruit.body as Appearance['body']) ?? 'chunky',
    eyes: (recruit.eyes as Appearance['eyes']) ?? 'normal',
    mouth: (recruit.mouth as Appearance['mouth']) ?? 'smile',
    hat: (recruit.hat as Appearance['hat']) ?? 'none',
    accessory: (recruit.accessory as Appearance['accessory']) ?? 'none',
    color: (recruit.color as Appearance['color']) ?? 'classic',
    effect: (recruit.effect as Appearance['effect']) ?? 'none',
  }
}
