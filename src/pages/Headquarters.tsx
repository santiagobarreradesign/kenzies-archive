import { Link } from 'react-router-dom'
import { appearanceFromRecruit, Pickle } from '../components/pickle/Pickle'
import { useRecruits } from '../hooks/useRecruits'
import { formationSlot } from '../lib/formation'

export function Headquarters() {
  const { recruits, loading } = useRecruits()
  const preview = recruits.slice(-10)

  return (
    <main className="hq">
      <section className="panel hq-hero">
        <div className="hq-copy">
          <p className="live-count">
            <span className="live-dot" aria-hidden="true" />
            <span className="tabular">{loading ? '—' : recruits.length}</span> recruits assembled
          </p>
          <p className="stamp">KENZIE&apos;S PICKLE ARMY</p>
          <h1 className="display">Birthday Defense Force</h1>
          <p>The Commander&apos;s birthday approaches. The army requires reinforcements.</p>
          <div className="cta-row">
            <Link className="btn btn-primary" to="/recruit">
              Join the Army
            </Link>
            <Link className="btn" to="/army">
              View the Army
            </Link>
            <Link className="btn btn-ghost" to="/commander">
              Commander Access
            </Link>
          </div>
        </div>
        <div className="hq-field" aria-hidden="true">
          {preview.map((recruit, index) => {
            const slot = formationSlot(recruit.id, index, Math.max(preview.length, 1))
            return (
              <div
                key={recruit.id}
                className="army-recruit"
                style={{ left: `${slot.x}%`, top: `${20 + slot.y * 0.55}%` }}
              >
                <Pickle {...appearanceFromRecruit(recruit)} size={92} />
              </div>
            )
          })}
        </div>
      </section>
    </main>
  )
}
