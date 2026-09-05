import { Link } from 'react-router-dom'
import { appearanceFromRecruit, Pickle } from '../pickle/Pickle'
import { divisionLabel } from '../../lib/divisions'
import type { Recruit } from '../../lib/types'

export function ArmyListFallback({ recruits }: { recruits: Recruit[] }) {
  return (
    <div className="roster">
      {recruits.map((recruit) => (
        <Link key={recruit.id} to={`/recruit/${recruit.id}`} className="panel">
          <Pickle {...appearanceFromRecruit(recruit)} size={110} title={recruit.pickle_name} />
          <strong>{recruit.pickle_name}</strong>
          <p>{divisionLabel(recruit.division)}</p>
        </Link>
      ))}
    </div>
  )
}
