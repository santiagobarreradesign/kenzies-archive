import {
  ACCESSORIES,
  BODIES,
  COLORS,
  EFFECTS,
  EYES,
  HATS,
  MOUTHS,
} from '../pickle/catalog'
import type { Appearance } from '../../lib/types'

type Option<T extends string> = { id: T; label: string }

function OptionSet<T extends string>({
  legend,
  value,
  options,
  onChange,
}: {
  legend: string
  value: T
  options: Option<T>[]
  onChange: (value: T) => void
}) {
  return (
    <fieldset className="builder-sections" style={{ border: 0, padding: 0, margin: 0 }}>
      <legend className="field-label">{legend}</legend>
      <div className="option-grid">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            aria-pressed={option.id === value}
            onClick={() => onChange(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

export function PickleCustomizer({
  value,
  onChange,
}: {
  value: Appearance
  onChange: (next: Appearance) => void
}) {
  function patch<K extends keyof Appearance>(key: K, next: Appearance[K]) {
    onChange({ ...value, [key]: next })
  }

  return (
    <div className="builder-sections">
      <OptionSet legend="Body" value={value.body} options={BODIES} onChange={(body) => patch('body', body)} />
      <OptionSet legend="Eyes" value={value.eyes} options={EYES} onChange={(eyes) => patch('eyes', eyes)} />
      <OptionSet legend="Mouth" value={value.mouth} options={MOUTHS} onChange={(mouth) => patch('mouth', mouth)} />
      <OptionSet legend="Hat" value={value.hat} options={HATS} onChange={(hat) => patch('hat', hat)} />
      <OptionSet legend="Accessory" value={value.accessory} options={ACCESSORIES} onChange={(accessory) => patch('accessory', accessory)} />
      <OptionSet legend="Color" value={value.color} options={COLORS} onChange={(color) => patch('color', color)} />
      <OptionSet legend="Effect" value={value.effect} options={EFFECTS} onChange={(effect) => patch('effect', effect)} />
    </div>
  )
}
