import { useState } from 'react'
import { MedalPicker } from '../commander/MedalPicker'
import { appearanceFromRecruit, Pickle } from '../pickle/Pickle'
import { MEDALS } from '../pickle/catalog'
import { useRecruitActions } from '../../hooks/useRecruitActions'
import { divisionLabel } from '../../lib/divisions'
import { recruitStats } from '../../lib/stats'
import type { MedalId, Recruit } from '../../lib/types'
import { LIMITS } from '../../lib/validation'

export function DossierCard({
  recruit,
  isOfficer,
  isAdmin,
  onChange,
}: {
  recruit: Recruit
  isOfficer: boolean
  isAdmin: boolean
  onChange: (recruit: Recruit) => void
}) {
  const actions = useRecruitActions()
  const stats = recruitStats(recruit.id, recruit.division)
  const medal = MEDALS.find((item) => item.id === recruit.medal)
  const [title, setTitle] = useState(recruit.commander_title ?? '')
  const [actionError, setActionError] = useState<string | null>(null)

  async function run(next: () => Promise<void>, patch: Partial<Recruit>) {
    setActionError(null)
    try {
      await next()
      onChange({ ...recruit, ...patch })
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Commander action failed.')
    }
  }

  return (
    <section className="panel dossier-layout">
      <div className="preview-stage">
        <Pickle {...appearanceFromRecruit(recruit)} size={240} title={recruit.pickle_name} />
      </div>
      <div className="builder-sections">
        <p className="stamp">Recruit Dossier</p>
        <h1 className="display">{recruit.pickle_name}</h1>
        <p>{divisionLabel(recruit.division)}</p>
        <p>Enlisted by {recruit.creator_name}</p>
        <p className="stamp">“{recruit.battle_cry}”</p>
        {recruit.favorite_by_kenzie ? <p className="stamp">Commander&apos;s Favorite</p> : null}
        {recruit.commander_title ? <p>Honorary title: {recruit.commander_title}</p> : null}
        {medal ? <p>Medal: {medal.label}</p> : null}
        <div className="stat-grid">
          <div>Loyalty {stats.loyalty}</div>
          <div>Chaos {stats.chaos}</div>
          <div>Brine {stats.brine}</div>
          <div>Bravery {stats.bravery}</div>
        </div>
        <div>
          <h2 className="display">Transmission for Commander Kenzie</h2>
          <p className="transmission">{recruit.message}</p>
        </div>
        {isOfficer ? (
          <div className="builder-sections">
            <button
              className="btn btn-gold"
              type="button"
              onClick={() => run(() => actions.favorite(recruit.id, !recruit.favorite_by_kenzie), { favorite_by_kenzie: !recruit.favorite_by_kenzie })}
            >
              {recruit.favorite_by_kenzie ? 'Remove favorite' : "Mark Commander's Favorite"}
            </button>
            <MedalPicker
              value={(recruit.medal as MedalId | null) ?? null}
              onChange={(medalId) => run(() => actions.awardMedal(recruit.id, medalId), { medal: medalId })}
            />
            <label className="field-label">
              Honorary title
              <input value={title} maxLength={LIMITS.commander_title} onChange={(e) => setTitle(e.target.value)} />
            </label>
            <button
              className="btn"
              type="button"
              onClick={() => run(() => actions.setTitle(recruit.id, title.trim() || null), { commander_title: title.trim() || null })}
            >
              Promote
            </button>
            {isAdmin ? (
              <button className="btn" type="button" onClick={() => run(() => actions.hide(recruit.id), { is_visible: false })}>
                Hide recruit
              </button>
            ) : null}
            {actionError ? <div className="error-banner">{actionError}</div> : null}
          </div>
        ) : null}
      </div>
    </section>
  )
}
