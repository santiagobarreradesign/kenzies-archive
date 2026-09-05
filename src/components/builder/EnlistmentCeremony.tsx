import { motion } from 'framer-motion'
import { Pickle } from '../pickle/Pickle'
import type { Appearance } from '../../lib/types'

export function EnlistmentCeremony({
  name,
  appearance,
  onContinue,
}: {
  name: string
  appearance: Appearance
  onContinue: () => void
}) {
  return (
    <section className="panel ceremony">
      <motion.div initial={{ scale: 0.86, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', duration: 0.45, bounce: 0 }}>
        <Pickle {...appearance} size={240} title={name} />
      </motion.div>
      <div className="stamp-mark">ENLISTED</div>
      <h1 className="display">{name || 'Unnamed recruit'} stands at attention.</h1>
      <p>Orders stamped. The army is larger than it was a moment ago.</p>
      <button className="btn btn-primary" type="button" onClick={onContinue}>
        Report to the parade grounds
      </button>
    </section>
  )
}
