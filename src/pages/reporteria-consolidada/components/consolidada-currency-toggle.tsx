import { currencyViews, type CurrencyView } from '@/data/reporteria'
import { OnColorSegmentToggle } from '@/shared/ui'

interface ConsolidadaCurrencyToggleProps {
  value: CurrencyView
  onChange: (v: CurrencyView) => void
}

/** Las 3 vías reales del tablero (Origen ML / Destino ML / Destino USD) — a diferencia de Reporte de
 * Dirección, esta vista sí necesita Origen porque replica el tablero ad hoc completo. */
export function ConsolidadaCurrencyToggle({ value, onChange }: ConsolidadaCurrencyToggleProps) {
  return <OnColorSegmentToggle value={value} onChange={onChange} options={currencyViews} />
}
