import type { ForecastRound } from '@/data/forecast'
import { ForecastActivoCard } from './forecast-activo-card'
import { ForecastBorradorCard } from './forecast-borrador-card'
import { ForecastAnterioresCard } from './forecast-anteriores-card'

interface ForecastResumenSectionProps {
  activo: ForecastRound | undefined
  borrador: ForecastRound | undefined
  anterioresCount: number
  onOpenAnteriores: () => void
  onOpenDetalleActivo: () => void
  onRequestDelete: (round: ForecastRound) => void
}

/** Cards de resumen, en este orden (F): Forecast Activo, Forecast Borrador, Forecasts Anteriores.
 * Extraído aparte para mantener ForecastListPage bajo el límite de líneas del linter. */
export function ForecastResumenSection({ activo, borrador, anterioresCount, onOpenAnteriores, onOpenDetalleActivo, onRequestDelete }: ForecastResumenSectionProps) {
  return (
    <div className="mx-8 mb-5 flex flex-col gap-4 md:flex-row">
      <ForecastActivoCard round={activo} onVerDetalle={onOpenDetalleActivo} />
      <ForecastBorradorCard round={borrador} onRequestDelete={onRequestDelete} />
      <ForecastAnterioresCard count={anterioresCount} onClick={onOpenAnteriores} />
    </div>
  )
}
