import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArmyField } from '../components/army/ArmyField'
import { ArmyListFallback } from '../components/army/ArmyListFallback'
import { ReinforcementBanner } from '../components/army/ReinforcementBanner'
import { useArmyDialogue } from '../hooks/useArmyDialogue'
import { useRealtimeRecruits } from '../hooks/useRealtimeRecruits'
import { useRecruits } from '../hooks/useRecruits'
import { useSiteState } from '../hooks/useSiteState'

export function Army() {
  const { recruits, loading, error, upsertRecruit, removeRecruit } = useRecruits()
  const { latestArrivalId, clearArrival } = useRealtimeRecruits({
    onInsert: upsertRecruit,
    onUpdate: upsertRecruit,
    onDelete: removeRecruit,
  })
  const { state } = useSiteState()
  const [params] = useSearchParams()
  const enlisted = params.get('enlisted')
  const [roster, setRoster] = useState(false)
  const highlightId = enlisted ?? latestArrivalId
  const dialogue = useArmyDialogue(recruits, !roster)

  const countLabel = useMemo(() => `${recruits.length} recruit${recruits.length === 1 ? '' : 's'} on the grounds`, [recruits.length])

  return (
    <main>
      {latestArrivalId ? (
        <ReinforcementBanner onDismiss={clearArrival} />
      ) : null}
      <section className="panel">
        <div className="army-toolbar">
          <div>
            <p className="stamp">Parade Grounds</p>
            <h1 className="display">The Army</h1>
            <p className="tabular">{loading ? 'Counting pickles…' : countLabel}</p>
          </div>
          <button className="btn" type="button" onClick={() => setRoster((value) => !value)}>
            {roster ? 'Show living army' : 'Show roster'}
          </button>
        </div>
        {error ? <div className="error-banner">{error}</div> : null}
        {roster ? (
          <ArmyListFallback recruits={recruits} />
        ) : (
          <ArmyField
            recruits={recruits}
            highlightId={highlightId}
            dialogue={dialogue}
            parade={state.parade_triggered}
          />
        )}
      </section>
    </main>
  )
}
