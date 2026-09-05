import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrivalSequence } from '../components/commander/ArrivalSequence'
import { BirthdayParade } from '../components/commander/BirthdayParade'
import { useCommander } from '../hooks/useCommander'
import { useSiteState } from '../hooks/useSiteState'
import { supabase } from '../lib/supabase'

export function Commander() {
  const { user, isOfficer, loading, signOut } = useCommander()
  const { state, update } = useSiteState()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showArrival, setShowArrival] = useState(false)
  const [showParade, setShowParade] = useState(false)

  useEffect(() => {
    if (state.parade_triggered) setShowParade(true)
  }, [state.parade_triggered])

  async function sendCode() {
    setError(null)
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    })
    if (otpError) {
      setError(otpError.message)
      return
    }
    setSent(true)
  }

  async function verify() {
    setError(null)
    const { error: verifyError } = await supabase.auth.verifyOtp({ email, token: code, type: 'email' })
    if (verifyError) {
      setError(verifyError.message)
      return
    }
    setShowArrival(true)
  }

  async function completeArrival() {
    setShowArrival(false)
    if (!state.commander_has_arrived) {
      try {
        await update({ commander_has_arrived: true })
      } catch {
        /* visitor or unpromoted account */
      }
    }
  }

  async function commandParade() {
    try {
      await update({ parade_triggered: true, birthday_mode: true })
      setShowParade(true)
    } catch (paradeError) {
      setError(paradeError instanceof Error ? paradeError.message : 'Only the Commander can order the parade.')
    }
  }

  async function restartParade() {
    await update({ parade_triggered: false, birthday_mode: false })
    setShowParade(false)
  }

  return (
    <main className="commander-layout">
      {showArrival || (isOfficer && !state.commander_has_arrived) ? (
        <ArrivalSequence onDone={completeArrival} />
      ) : null}
      {showParade ? <BirthdayParade onClose={() => setShowParade(false)} /> : null}
      <section className="panel">
        <p className="stamp">Commander Access</p>
        <h1 className="display">Headquarters recognizes one Commander.</h1>
        {loading ? <p>Checking identity papers…</p> : null}
        {!user ? (
          <div className="builder-sections">
            <p>Kenzie, enter the email on file. A one-time code will arrive by transmission.</p>
            <label className="field-label">
              Email
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            {sent ? (
              <label className="field-label">
                Access code
                <input value={code} onChange={(e) => setCode(e.target.value)} />
              </label>
            ) : null}
            {error ? <div className="error-banner">{error}</div> : null}
            <button className="btn btn-primary" type="button" onClick={sent ? verify : sendCode}>
              {sent ? 'Confirm identity' : 'Request access code'}
            </button>
          </div>
        ) : (
          <div className="builder-sections">
            <p>Signed in as {user.email}</p>
            {isOfficer ? (
              <>
                <p>Identity confirmed. The army is yours.</p>
                <div className="cta-row">
                  <Link className="btn btn-primary" to="/army">
                    Inspect the army
                  </Link>
                  <button className="btn btn-gold" type="button" onClick={() => void commandParade()}>
                    Command the parade
                  </button>
                  <button className="btn" type="button" onClick={() => void restartParade()}>
                    Reset parade
                  </button>
                </div>
              </>
            ) : (
              <p>
                You are signed in, but this account is not yet on the officer roster. Ask the project admin to add{' '}
                {user.email} as commander or admin.
              </p>
            )}
            {error ? <div className="error-banner">{error}</div> : null}
            <button className="btn" type="button" onClick={() => void signOut()}>
              Sign out
            </button>
          </div>
        )}
      </section>
    </main>
  )
}
