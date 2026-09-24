import type { ForecastRound } from '@/data/forecast'
import { ForecastActivoCard } from './forecast-activo-card'

interface ForecastResumenSectionProps {
  activo: ForecastRound | undefined
  detalleOpen: boolean
  onToggleDetalle: () => void
  onVerTasas: () => void
}

/** Barra del Forecast Activo, de ancho completo (F) — "Borrador y Anteriores" se movió al header de
 * página (ver ForecastListHeaderActions). El detalle se despliega dentro del mismo recuadro (F), no
 * en uno aparte. Extraído aparte para mantener ForecastListPage bajo el límite de líneas del linter. */
export function ForecastResumenSection({ activo, detalleOpen, onToggleDetalle, onVerTasas }: ForecastResumenSectionProps) {
  return (
    <div className="mx-8 mb-5">
      <ForecastActivoCard round={activo} detalleOpen={detalleOpen} onToggleDetalle={onToggleDetalle} onVerTasas={onVerTasas} />
    </div>
  )
}
