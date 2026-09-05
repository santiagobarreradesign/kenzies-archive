import { motion } from 'framer-motion'

export function ArrivalSequence({ onDone }: { onDone: () => void }) {
  return (
    <div className="arrival-overlay">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', duration: 0.4, bounce: 0 }}>
        <p className="stamp">Commander detected</p>
        <h2 className="display">Identity confirmed. Welcome home, Kenzie.</h2>
        <p>The army assembled in secret. It has been waiting.</p>
        <p className="stamp">LONG LIVE KENZIE</p>
        <button className="btn btn-primary" type="button" onClick={onDone}>
          Begin inspection
        </button>
      </motion.div>
    </div>
  )
}
