import type { ForecastRound } from '@/data/forecast'
import { ForecastRoundCard } from './forecast-round-card'
import { ForecastActivoCard } from './forecast-activo-card'
import { ForecastAnterioresCard } from './forecast-anteriores-card'

interface ForecastResumenSectionProps {
  activo: ForecastRound | undefined
  borradores: ForecastRound[]
  anterioresCount: number
  onOpenAnteriores: () => void
  onRequestClose: (round: ForecastRound) => void
  onRequestDelete: (round: ForecastRound) => void
}

/** Cards de resumen (Activo / Anteriores) + listado de Borradores — extraído aparte para mantener
 * ForecastListPage bajo el límite de líneas del linter. */
export function ForecastResumenSection({ activo, borradores, anterioresCount, onOpenAnteriores, onRequestClose, onRequestDelete }: ForecastResumenSectionProps) {
  return (
    <>
      <div className="mx-8 mb-5 flex flex-col gap-4 md:flex-row">
        <ForecastActivoCard round={activo} />
        <ForecastAnterioresCard count={anterioresCount} onClick={onOpenAnteriores} />
      </div>

      {borradores.length > 0 && (
        <div className="mx-8 mb-5">
          <div className="mb-2.5 text-[11px] font-bold tracking-[0.07em] text-muted-foreground uppercase">Borradores</div>
          {borradores.map((r) => (
            <ForecastRoundCard key={r.id} round={r} onRequestClose={onRequestClose} onRequestDelete={onRequestDelete} />
          ))}
        </div>
      )}
    </>
  )
}
