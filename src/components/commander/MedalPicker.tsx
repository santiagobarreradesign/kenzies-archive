import { MEDALS } from '../pickle/catalog'
import type { MedalId } from '../../lib/types'

export function MedalPicker({
  value,
  onChange,
}: {
  value: MedalId | null
  onChange: (medal: MedalId | null) => void
}) {
  return (
    <label className="field-label">
      Award medal
      <select value={value ?? ''} onChange={(e) => onChange((e.target.value || null) as MedalId | null)}>
        <option value="">No medal</option>
        {MEDALS.map((medal) => (
          <option key={medal.id} value={medal.id}>
            {medal.label}
          </option>
        ))}
      </select>
    </label>
  )
}
