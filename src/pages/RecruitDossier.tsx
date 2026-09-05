import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { DossierCard } from '../components/dossier/DossierCard'
import { useCommander } from '../hooks/useCommander'
import { useRecruitActions } from '../hooks/useRecruitActions'
import { supabase } from '../lib/supabase'
import type { Recruit } from '../lib/types'

export function RecruitDossier() {
  const { id } = useParams()
  const { isOfficer, isAdmin } = useCommander()
  const { markViewed } = useRecruitActions()
  const [recruit, setRecruit] = useState<Recruit | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    let active = true
    void supabase
      .from('recruits')
      .select('*')
      .eq('id', id)
      .maybeSingle()
      .then(({ data, error: queryError }) => {
        if (!active) return
        if (queryError) setError(queryError.message)
        setRecruit(data)
        setLoading(false)
      })
    return () => {
      active = false
    }
  }, [id])

  useEffect(() => {
    if (recruit && isOfficer && !recruit.viewed_by_kenzie) {
      void markViewed(recruit.id).then(() => {
        setRecruit((current) => (current ? { ...current, viewed_by_kenzie: true } : current))
      })
    }
  }, [isOfficer, markViewed, recruit])

  return (
    <main>
      {loading ? <section className="panel">Opening dossier…</section> : null}
      {error ? <div className="error-banner">{error}</div> : null}
      {!loading && !recruit ? (
        <section className="panel">
          <h1 className="display">Recruit not found</h1>
          <p>This pickle is classified, hidden, or never existed.</p>
          <Link className="btn" to="/army">
            Return to the army
          </Link>
        </section>
      ) : null}
      {recruit ? (
        <DossierCard
          recruit={recruit}
          isOfficer={isOfficer}
          isAdmin={isAdmin}
          onChange={setRecruit}
        />
      ) : null}
    </main>
  )
}
