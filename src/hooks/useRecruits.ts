import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Recruit } from '../lib/types'

export function useRecruits() {
  const [recruits, setRecruits] = useState<Recruit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    const { data, error: queryError } = await supabase
      .from('recruits')
      .select('*')
      .eq('is_visible', true)
      .order('created_at', { ascending: true })

    if (queryError) {
      setError(queryError.message)
      setRecruits([])
    } else {
      setError(null)
      setRecruits(data ?? [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const upsertRecruit = useCallback((recruit: Recruit) => {
    setRecruits((current) => {
      if (current.some((item) => item.id === recruit.id)) {
        return current.map((item) => (item.id === recruit.id ? recruit : item))
      }
      return [...current, recruit]
    })
  }, [])

  const removeRecruit = useCallback((id: string) => {
    setRecruits((current) => current.filter((item) => item.id !== id))
  }, [])

  return { recruits, loading, error, refresh, upsertRecruit, removeRecruit, setRecruits }
}
