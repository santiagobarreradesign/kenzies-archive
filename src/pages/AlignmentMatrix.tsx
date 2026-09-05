import { ACCESSORIES, BODIES, COLORS, DEFAULT_APPEARANCE, EYES, HATS, MOUTHS } from '../components/pickle/catalog'
import { Pickle } from '../components/pickle/Pickle'

export function AlignmentMatrix() {
  return (
    <main>
      <section className="panel">
        <p className="stamp">Asset matrix</p>
        <h1 className="display">Pickle alignment check</h1>
        <div className="matrix-grid">
          {BODIES.map((body) =>
            COLORS.map((color) => (
              <Pickle
                key={`${body.id}-${color.id}`}
                {...DEFAULT_APPEARANCE}
                body={body.id}
                color={color.id}
                size={120}
                title={`${body.label} ${color.label}`}
              />
            )),
          )}
          {EYES.map((eyes) => (
            <Pickle key={eyes.id} {...DEFAULT_APPEARANCE} eyes={eyes.id} hat="none" accessory="none" size={110} title={eyes.label} />
          ))}
          {MOUTHS.map((mouth) => (
            <Pickle key={mouth.id} {...DEFAULT_APPEARANCE} mouth={mouth.id} hat="none" accessory="none" size={110} title={mouth.label} />
          ))}
          {HATS.map((hat) => (
            <Pickle key={hat.id} {...DEFAULT_APPEARANCE} hat={hat.id} accessory="none" size={110} title={hat.label} />
          ))}
          {ACCESSORIES.map((accessory) => (
            <Pickle key={accessory.id} {...DEFAULT_APPEARANCE} accessory={accessory.id} hat="none" size={110} title={accessory.label} />
          ))}
        </div>
      </section>
    </main>
  )
}
