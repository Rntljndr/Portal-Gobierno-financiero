import { useState } from 'react'
import { Icon, SegmentedTabs } from '@/shared/ui'
import { ForecastEvolucionChart } from './forecast-evolucion-chart'
import { ForecastEvolucionPointsChart } from './forecast-evolucion-points-chart'

interface ForecastChartSectionProps {
  meses: Record<string, number>
  cutoff: number
}

/** Sección colapsable, expandida por defecto (F: "se debe ver el gráfico de barras") — patrón
 * hand-rolled de pep-n4-card.tsx, no existe un Collapsible genérico en shared/ui. Dos visiones con
 * selector (F): barras (ForecastEvolucionChart, la que se ve por defecto) o puntos
 * (ForecastEvolucionPointsChart), misma escala/datos en ambas. */
export function ForecastChartSection({ meses, cutoff }: ForecastChartSectionProps) {
  const [open, setOpen] = useState(true)
  const [vista, setVista] = useState<'barras' | 'puntos'>('barras')

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white">
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between p-[16px_20px] text-left">
        <span className="flex items-center gap-2 text-[14px] font-bold text-foreground">
          <Icon name="chart" size={15} color="#0047B0" /> Evolución Forecast vs. Real
        </span>
        <Icon name={open ? 'chevron_up' : 'chevron_down'} size={16} color="#0047B0" />
      </button>
      {open && (
        <div className="border-t border-[#eef0f8] p-[20px]">
          <div className="mb-3 flex justify-end">
            <SegmentedTabs
              value={vista}
              onChange={setVista}
              options={[
                { value: 'barras', label: 'Barras' },
                { value: 'puntos', label: 'Puntos' },
              ]}
            />
          </div>
          {vista === 'barras' ? <ForecastEvolucionChart meses={meses} cutoff={cutoff} /> : <ForecastEvolucionPointsChart meses={meses} cutoff={cutoff} />}
        </div>
      )}
    </div>
  )
}
