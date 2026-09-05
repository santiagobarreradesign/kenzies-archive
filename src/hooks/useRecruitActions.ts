import { useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { MedalId } from '../lib/types'

export function useRecruitActions() {
  const favorite = useCallback(async (id: string, value: boolean) => {
    const { error } = await supabase.from('recruits').update({ favorite_by_kenzie: value }).eq('id', id)
    if (error) throw error
  }, [])

  const awardMedal = useCallback(async (id: string, medal: MedalId | null) => {
    const { error } = await supabase.from('recruits').update({ medal }).eq('id', id)
    if (error) throw error
  }, [])

  const setTitle = useCallback(async (id: string, commander_title: string | null) => {
    const { error } = await supabase.from('recruits').update({ commander_title }).eq('id', id)
    if (error) throw error
  }, [])

  const markViewed = useCallback(async (id: string) => {
    const { error } = await supabase.from('recruits').update({ viewed_by_kenzie: true }).eq('id', id)
    if (error) throw error
  }, [])

  const hide = useCallback(async (id: string) => {
    const { error } = await supabase.from('recruits').update({ is_visible: false }).eq('id', id)
    if (error) throw error
  }, [])

  return { favorite, awardMedal, setTitle, markViewed, hide }
}
