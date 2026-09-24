import type { ForecastRound } from '@/data/forecast'
import { ForecastActivoCard } from './forecast-activo-card'
import { ForecastBorradorAnterioresCard } from './forecast-borrador-anteriores-card'
import { ForecastActivoDetalleInline } from './forecast-activo-detalle-inline'

interface ForecastResumenSectionProps {
  activo: ForecastRound | undefined
  borrador: ForecastRound | undefined
  anterioresCount: number
  detalleOpen: boolean
  onToggleDetalle: () => void
  onVerTasas: () => void
  onOpenAnteriores: () => void
}

/** Cards de resumen (F): Forecast Activo + Borrador y Anteriores (unificada en una sola card/botón).
 * El detalle del Activo se despliega debajo, inline y colapsable, en vez de abrir un drawer.
 * Extraído aparte para mantener ForecastListPage bajo el límite de líneas del linter. */
export function ForecastResumenSection({ activo, borrador, anterioresCount, detalleOpen, onToggleDetalle, onVerTasas, onOpenAnteriores }: ForecastResumenSectionProps) {
  return (
    <>
      <div className="mx-8 mb-5 flex flex-col gap-4 md:flex-row">
        <ForecastActivoCard round={activo} detalleOpen={detalleOpen} onToggleDetalle={onToggleDetalle} onVerTasas={onVerTasas} />
        <ForecastBorradorAnterioresCard borrador={borrador} anterioresCount={anterioresCount} onClick={onOpenAnteriores} />
      </div>
      {activo && detalleOpen && <ForecastActivoDetalleInline round={activo} />}
    </>
  )
}
