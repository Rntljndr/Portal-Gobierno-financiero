import type { ForecastRound } from '@/data/forecast'
import { ForecastActivoCard } from './forecast-activo-card'

interface ForecastResumenSectionProps {
  activo: ForecastRound | undefined
  borrador: ForecastRound | undefined
  anterioresCount: number
  detalleOpen: boolean
  onToggleDetalle: () => void
  onVerTasas: () => void
  onOpenAnteriores: () => void
  onCerrar: () => void
}

/** Barra del Forecast Activo, de ancho completo (F). El detalle se despliega dentro del mismo
 * recuadro (F), no en uno aparte. Extraído aparte para mantener ForecastListPage bajo el límite de
 * líneas del linter. */
export function ForecastResumenSection({ activo, borrador, anterioresCount, detalleOpen, onToggleDetalle, onVerTasas, onOpenAnteriores, onCerrar }: ForecastResumenSectionProps) {
  return (
    <div className="mx-8 mb-5">
      <ForecastActivoCard
        round={activo}
        borrador={borrador}
        anterioresCount={anterioresCount}
        detalleOpen={detalleOpen}
        onToggleDetalle={onToggleDetalle}
        onVerTasas={onVerTasas}
        onOpenAnteriores={onOpenAnteriores}
        onCerrar={onCerrar}
      />
    </div>
  )
}
