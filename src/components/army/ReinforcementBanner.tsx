export function ReinforcementBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <button className="reinforcement-banner" type="button" onClick={onDismiss}>
      New reinforcements have arrived
    </button>
  )
}
