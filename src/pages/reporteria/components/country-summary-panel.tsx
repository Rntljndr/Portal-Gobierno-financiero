import { useState } from 'react'
import { Icon } from '@/shared/ui'
import { countryBudgets, type CurrencyView, type MetricMode } from '@/data/reporteria'
import { CountrySummaryCard } from './country-summary-card'
import { PaisDrawer } from './pais-drawer'
import { VistaToggle } from './vista-toggle'

interface CountrySummaryPanelProps {
  paisSel: string[]
  metricMode: MetricMode
  onMetricModeChange: (m: MetricMode) => void
  vistaMoneda: CurrencyView
  onVistaMonedaChange: (v: CurrencyView) => void
}

export function CountrySummaryPanel({ paisSel, metricMode, onMetricModeChange, vistaMoneda, onVistaMonedaChange }: CountrySummaryPanelProps) {
  const [open, setOpen] = useState(true)
  const [selectedPais, setSelectedPais] = useState<string | null>(null)

  return (
    <div className="mx-8 mb-6 rounded-[18px] bg-[linear-gradient(180deg,var(--color-cs-azul)_0%,#003685_100%)] p-5.5">
      <div className="flex w-full flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={() => setOpen((v) => !v)} className="text-left">
          <div className="text-[17px] leading-tight font-extrabold tracking-tight text-white">Resumen presupuesto 2027</div>
          <div className="mt-0.5 text-xs text-white/72">Registro de montos, datos actualizados en tiempo real</div>
        </button>
        <div className="ml-auto flex items-center gap-3">
          <VistaToggle vistaMoneda={vistaMoneda} onVistaMonedaChange={onVistaMonedaChange} metricMode={metricMode} onMetricModeChange={onMetricModeChange} />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex size-[30px] shrink-0 items-center justify-center rounded-[9px] bg-white/14 hover:bg-white/24"
          >
            <Icon name={open ? 'chevron_left' : 'chevron_right'} size={15} color="#fff" />
          </button>
        </div>
      </div>

      {open && (
        <div className="mt-4.5 flex flex-wrap gap-2.5">
          {countryBudgets.map((c) => (
            <CountrySummaryCard
              key={c.pais}
              c={c}
              metricMode={metricMode}
              isDolar={vistaMoneda === 'dolar'}
              active={paisSel.length === 0 || paisSel.includes(c.pais)}
              selected={selectedPais === c.pais}
              onClick={() => setSelectedPais(c.pais)}
            />
          ))}
        </div>
      )}

      {selectedPais && <PaisDrawer pais={selectedPais} onClose={() => setSelectedPais(null)} />}
    </div>
  )
}
