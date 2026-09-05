import { useMemo, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { EnlistmentCeremony } from '../components/builder/EnlistmentCeremony'
import { PickleCustomizer } from '../components/builder/PickleCustomizer'
import { RecruitForm } from '../components/builder/RecruitForm'
import { DEFAULT_APPEARANCE } from '../components/pickle/catalog'
import { Pickle } from '../components/pickle/Pickle'
import { supabase } from '../lib/supabase'
import type { Appearance } from '../lib/types'
import { buildRecruitInsert } from '../lib/validation'

export function Recruit() {
  const navigate = useNavigate()
  const [appearance, setAppearance] = useState<Appearance>({ ...DEFAULT_APPEARANCE })
  const [creatorName, setCreatorName] = useState('')
  const [pickleName, setPickleName] = useState('')
  const [division, setDivision] = useState('royal_brine_guard')
  const [battleCry, setBattleCry] = useState('')
  const [message, setMessage] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [startedAt] = useState(() => Date.now())
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [enlistedId, setEnlistedId] = useState<string | null>(null)

  const payload = useMemo(
    () => buildRecruitInsert({ appearance, creatorName, pickleName, division, battleCry, message }),
    [appearance, battleCry, creatorName, division, message, pickleName],
  )

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    if (honeypot) return
    if (Date.now() - startedAt < 4000) {
      setError('The recruitment office is still reviewing your paperwork. Try again in a moment.')
      return
    }
    if (!payload.ok) {
      setError(payload.error)
      return
    }
    setSubmitting(true)
    const { data, error: insertError } = await supabase.from('recruits').insert(payload.data).select('id').single()
    setSubmitting(false)
    if (insertError || !data) {
      setError(insertError?.message ?? 'Enlistment failed. The cake remains unprotected.')
      return
    }
    setEnlistedId(data.id)
  }

  if (enlistedId) {
    return (
      <main>
        <EnlistmentCeremony
          name={pickleName}
          appearance={appearance}
          onContinue={() => navigate(`/army?enlisted=${enlistedId}`)}
        />
      </main>
    )
  }

  return (
    <main>
      <section className="panel recruit-layout">
        <div className="preview-stage">
          <Pickle {...appearance} size={220} title={pickleName || 'New recruit'} />
        </div>
        <form className="builder-sections" onSubmit={onSubmit}>
          <div>
            <p className="stamp">Recruitment Office</p>
            <h1 className="display">Enlist a Recruit</h1>
            <p>Build one pickle. Attach a real birthday transmission. No account required.</p>
          </div>
          <PickleCustomizer value={appearance} onChange={setAppearance} />
          <RecruitForm
            creatorName={creatorName}
            pickleName={pickleName}
            division={division}
            battleCry={battleCry}
            message={message}
            onCreatorName={setCreatorName}
            onPickleName={setPickleName}
            onDivision={setDivision}
            onBattleCry={setBattleCry}
            onMessage={setMessage}
          />
          <label className="honeypot" aria-hidden="true">
            Company website
            <input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
          </label>
          {error ? <div className="error-banner">{error}</div> : null}
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? 'Stamping orders…' : 'Enlist'}
          </button>
        </form>
      </section>
    </main>
  )
}
