import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { appearanceFromRecruit, Pickle } from '../pickle/Pickle'
import type { IdleAction, Recruit } from '../../lib/types'
import { SpeechBubble } from './SpeechBubble'

const RICH: IdleAction[] = ['salute', 'wave', 'tip']

export function ArmyRecruit({
  recruit,
  x,
  y,
  highlighted,
  line,
  actionIndex,
}: {
  recruit: Recruit
  x: number
  y: number
  highlighted: boolean
  line: string | null
  actionIndex: number
}) {
  const action = useMemo<IdleAction>(() => {
    if (actionIndex % 7 === 0) return RICH[actionIndex % RICH.length] ?? 'idle'
    return 'idle'
  }, [actionIndex])

  return (
    <Link
      to={`/recruit/${recruit.id}`}
      className="army-recruit"
      style={{ left: `${x}%`, top: `${y}%`, zIndex: highlighted ? 3 : 1 }}
    >
      <figure>
        {line ? <SpeechBubble line={line} /> : null}
        <Pickle {...appearanceFromRecruit(recruit)} size={highlighted ? 120 : 96} action={action} title={recruit.pickle_name} />
        <figcaption>{recruit.pickle_name}</figcaption>
      </figure>
    </Link>
  )
}
