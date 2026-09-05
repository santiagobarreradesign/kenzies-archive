import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Recruit } from '../lib/types'

type Options = {
  onInsert?: (recruit: Recruit) => void
  onUpdate?: (recruit: Recruit) => void
  onDelete?: (id: string) => void
}

export function useRealtimeRecruits({ onInsert, onUpdate, onDelete }: Options) {
  const [latestArrivalId, setLatestArrivalId] = useState<string | null>(null)

  useEffect(() => {
    const channel = supabase
      .channel('army-recruits')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'recruits' },
        (payload) => {
          const recruit = payload.new as Recruit
          if (!recruit.is_visible) return
          onInsert?.(recruit)
          setLatestArrivalId(recruit.id)
        },
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'recruits' },
        (payload) => {
          const recruit = payload.new as Recruit
          if (!recruit.is_visible) {
            onDelete?.(recruit.id)
            return
          }
          onUpdate?.(recruit)
        },
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [onDelete, onInsert, onUpdate])

  return { latestArrivalId, clearArrival: () => setLatestArrivalId(null) }
}
