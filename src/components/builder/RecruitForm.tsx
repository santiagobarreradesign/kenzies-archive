import { DIVISIONS } from '../../lib/divisions'
import { LIMITS } from '../../lib/validation'

export function RecruitForm({
  creatorName,
  pickleName,
  division,
  battleCry,
  message,
  onCreatorName,
  onPickleName,
  onDivision,
  onBattleCry,
  onMessage,
}: {
  creatorName: string
  pickleName: string
  division: string
  battleCry: string
  message: string
  onCreatorName: (value: string) => void
  onPickleName: (value: string) => void
  onDivision: (value: string) => void
  onBattleCry: (value: string) => void
  onMessage: (value: string) => void
}) {
  return (
    <div className="builder-sections">
      <label className="field-label">
        Enlisted by
        <input value={creatorName} maxLength={LIMITS.creator_name} onChange={(e) => onCreatorName(e.target.value)} required />
      </label>
      <label className="field-label">
        Recruit name
        <input value={pickleName} maxLength={LIMITS.pickle_name} onChange={(e) => onPickleName(e.target.value)} required />
      </label>
      <label className="field-label">
        Division
        <select value={division} onChange={(e) => onDivision(e.target.value)}>
          {DIVISIONS.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      <label className="field-label">
        Battle cry
        <input value={battleCry} maxLength={LIMITS.battle_cry} onChange={(e) => onBattleCry(e.target.value)} required />
      </label>
      <label className="field-label">
        Transmission for Commander Kenzie
        <textarea value={message} maxLength={LIMITS.message} onChange={(e) => onMessage(e.target.value)} required />
      </label>
    </div>
  )
}
