import { useState } from 'react'
import { Icon } from '@/shared/ui'
import { cn } from '@/shared/lib/utils'
import type { ForecastRound } from '@/data/forecast'
import { buildForecastCountrySummary } from '../lib/forecast-country-summary'
import { ForecastCountrySummaryCard } from './forecast-country-summary-card'

interface ForecastCountrySummaryPanelProps {
  activo: ForecastRound
  anterior: ForecastRound | undefined
}

/** Resumen forecast por país del forecast activo (M2) — mismo componente que CountryBudgetPanel de
 * Presupuesto (gradiente azul, plegable), pero sin el selector Origen/Destino (Forecast no distribuye
 * entre países, cada PEP N4 vive en uno solo) y siempre en moneda de origen. Muestra 6 países a la vez;
 * con 7 países dados de alta (forecastPaisesMoneda incluye EEUU), el séptimo queda accesible con scroll
 * lateral en vez de agregar una fila nueva. */
export function ForecastCountrySummaryPanel({ activo, anterior }: ForecastCountrySummaryPanelProps) {
  const [open, setOpen] = useState(true)
  const rows = buildForecastCountrySummary(activo, anterior)

  return (
    <div className="mx-8 mb-5 rounded-[18px] bg-[linear-gradient(180deg,var(--color-cs-azul)_0%,#003685_100%)] p-5.5">
      <div className={cn('flex items-center gap-4', open && 'mb-4.5')}>
        <button type="button" onClick={() => setOpen((v) => !v)} className="min-w-0 flex-1 text-left">
          <div className="text-[17px] leading-tight font-extrabold tracking-tight text-white">Resumen forecast por país</div>
          <div className="mt-0.5 text-xs text-white/72">Forecast actual vs. forecast anterior y plan, en moneda de origen</div>
        </button>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Contraer' : 'Expandir'}
          className="flex size-[30px] shrink-0 items-center justify-center rounded-[9px] bg-white/14 hover:bg-white/24"
        >
          <Icon name={open ? 'chevron_left' : 'chevron_right'} size={15} color="#fff" />
        </button>
      </div>

      {open && (
        <div className="flex gap-2.5 overflow-x-auto pb-1">
          {rows.map((c) => (
            <div key={c.pais} className="w-[calc((100%-12.5px)/6)] shrink-0">
              <ForecastCountrySummaryCard c={c} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
