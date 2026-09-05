import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { OfficerRole } from '../lib/types'
import type { Session, User } from '@supabase/supabase-js'

function roleFromUser(user: User | null): OfficerRole {
  const metaRole = user?.app_metadata?.role
  if (metaRole === 'commander' || metaRole === 'admin') return metaRole
  return null
}

async function resolveRole(user: User | null): Promise<OfficerRole> {
  const fromJwt = roleFromUser(user)
  if (fromJwt || !user) return fromJwt
  const { data } = await supabase.rpc('my_officer_role')
  if (data === 'commander' || data === 'admin') return data
  return null
}

export function useCommander() {
  const [session, setSession] = useState<Session | null>(null)
  const [role, setRole] = useState<OfficerRole>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function hydrate(next: Session | null) {
      setSession(next)
      const resolved = await resolveRole(next?.user ?? null)
      if (!active) return
      setRole(resolved)
      setLoading(false)
    }

    void supabase.auth.getSession().then(({ data }) => hydrate(data.session))

    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      void hydrate(next)
    })

    return () => {
      active = false
      data.subscription.unsubscribe()
    }
  }, [])

  return {
    session,
    user: session?.user ?? null,
    role,
    isOfficer: role === 'commander' || role === 'admin',
    isAdmin: role === 'admin',
    loading,
    signOut: () => supabase.auth.signOut(),
  }
}
