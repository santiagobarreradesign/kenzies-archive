import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { SiteState } from '../lib/types'

const EMPTY: SiteState = {
  id: 1,
  commander_has_arrived: false,
  parade_triggered: false,
  birthday_mode: false,
  updated_at: new Date().toISOString(),
}

export function useSiteState() {
  const [state, setState] = useState<SiteState>(EMPTY)

  const refresh = useCallback(async () => {
    const { data } = await supabase.from('site_state').select('*').eq('id', 1).maybeSingle()
    if (data) setState(data)
  }, [])

  useEffect(() => {
    void refresh()
    const channel = supabase
      .channel('site-state')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_state' }, (payload) => {
        setState(payload.new as SiteState)
      })
      .subscribe()
    return () => {
      void supabase.removeChannel(channel)
    }
  }, [refresh])

  const update = useCallback(async (patch: Partial<SiteState>) => {
    const { data, error } = await supabase.from('site_state').update(patch).eq('id', 1).select().single()
    if (error) throw error
    setState(data)
    return data
  }, [])

  return { state, refresh, update }
}
