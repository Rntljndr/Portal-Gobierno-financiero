import { OnColorSegmentToggle } from './on-color-segment-toggle'

export type VistaNumero = 'nominal' | 'millones'

const OPTIONS: { id: VistaNumero; label: string }[] = [
  { id: 'nominal', label: 'Vista nominal' },
  { id: 'millones', label: 'Vista en millones' },
]

interface VistaNumeroToggleProps {
  value: VistaNumero
  onChange: (v: VistaNumero) => void
}

/** Formato de despliegue de las cifras (nominal completa vs. abreviada en millones) — independiente
 * de la moneda, que se resuelve aparte vía el selector "Ver montos por". */
export function VistaNumeroToggle({ value, onChange }: VistaNumeroToggleProps) {
  return <OnColorSegmentToggle value={value} onChange={onChange} options={OPTIONS} />
}
