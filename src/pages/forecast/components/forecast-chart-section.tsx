import { useState } from 'react'
import { Icon } from '@/shared/ui'
import type { ForecastN4Linea } from '@/data/forecast-lineas'
import { ForecastEvolucionChart } from './forecast-evolucion-chart'

interface ForecastChartSectionProps {
  n4: ForecastN4Linea
  cutoff: number
}

/** Sección colapsable (colapsada por defecto), patrón hand-rolled de pep-n4-card.tsx — no existe un Collapsible genérico en shared/ui. */
export function ForecastChartSection({ n4, cutoff }: ForecastChartSectionProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="mx-8 mb-8 overflow-hidden rounded-xl border border-border bg-white">
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between p-[16px_20px] text-left">
        <span className="flex items-center gap-2 text-[14px] font-bold text-foreground">
          <Icon name="chart" size={15} color="#0047B0" /> Evolución Forecast vs. Real
        </span>
        <Icon name={open ? 'chevron_up' : 'chevron_down'} size={16} color="#0047B0" />
      </button>
      {open && (
        <div className="border-t border-[#eef0f8] p-[20px]">
          <ForecastEvolucionChart n4={n4} cutoff={cutoff} />
        </div>
      )}
    </div>
  )
}
