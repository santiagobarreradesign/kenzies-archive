import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = Object.fromEntries(
  fs
    .readFileSync('.env.local', 'utf8')
    .split(/\r?\n/)
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => line.split('=').slice(0, 2)),
)

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY)

const { data: recruits, error: readError } = await supabase
  .from('recruits')
  .select('id, pickle_name, message, favorite_by_kenzie')
  .eq('is_visible', true)
  .order('created_at', { ascending: true })

if (readError) throw readError
if (!recruits?.length) throw new Error('Expected seeded recruits')

const { error: forbidden } = await supabase
  .from('recruits')
  .update({ favorite_by_kenzie: true })
  .eq('id', recruits[0].id)

if (!forbidden) {
  const { data: check } = await supabase.from('recruits').select('favorite_by_kenzie').eq('id', recruits[0].id).single()
  if (check?.favorite_by_kenzie) throw new Error('Anon was able to write commander fields')
}

const { data: inserted, error: insertError } = await supabase
  .from('recruits')
  .insert({
    creator_name: 'QA Bot',
    pickle_name: 'Verify Dill',
    body: 'tiny',
    eyes: 'wink',
    mouth: 'smile',
    hat: 'bow',
    accessory: 'flag',
    color: 'pastel',
    effect: null,
    division: 'emotional_support',
    battle_cry: 'MORALE UP!',
    message: 'Automated enlistment check. The north-star loop works.',
  })
  .select('id')
  .single()

if (insertError || !inserted) throw insertError ?? new Error('Insert failed')

const { data: dossier, error: dossierError } = await supabase.from('recruits').select('*').eq('id', inserted.id).single()
if (dossierError || !dossier) throw dossierError ?? new Error('Dossier missing')
if (dossier.message.includes('<')) throw new Error('Unexpected HTML in message path')

await supabase.from('recruits').update({ is_visible: false }).eq('id', inserted.id)

console.log(
  JSON.stringify({
    seedCount: recruits.length,
    insertId: inserted.id,
    dossierName: dossier.pickle_name,
    anonCannotFavorite: Boolean(forbidden),
  }),
)
