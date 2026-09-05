import { ArmyRecruit } from './ArmyRecruit'
import { formationSlot } from '../../lib/formation'
import type { Recruit } from '../../lib/types'

export function ArmyField({
  recruits,
  highlightId,
  dialogue,
  parade,
}: {
  recruits: Recruit[]
  highlightId?: string | null
  dialogue: { id: string; line: string } | null
  parade: boolean
}) {
  return (
    <div className={`army-field ${parade ? 'parade' : ''}`}>
      {recruits.map((recruit, index) => {
        const slot = parade
          ? {
              x: ((index % 8) + 0.5) * (100 / 8),
              y: (Math.floor(index / 8) + 0.6) * 22,
            }
          : formationSlot(recruit.id, index, Math.max(recruits.length, 1))
        return (
          <ArmyRecruit
            key={recruit.id}
            recruit={recruit}
            x={slot.x}
            y={Math.min(slot.y, 88)}
            highlighted={recruit.id === highlightId}
            line={dialogue?.id === recruit.id ? dialogue.line : null}
            actionIndex={index}
          />
        )
      })}
    </div>
  )
}
