import { useState } from 'react'
import { Icon } from '@/shared/ui'
import { countryBudgets } from '@/data/reporteria'
import { CountrySummaryCard } from './country-summary-card'

interface CountrySummaryPanelProps {
  paisSel: string[]
}

export function CountrySummaryPanel({ paisSel }: CountrySummaryPanelProps) {
  const [open, setOpen] = useState(true)
  const visibles = paisSel.length ? countryBudgets.filter((c) => paisSel.includes(c.pais)) : countryBudgets

  return (
    <div className="mx-8 mb-6 rounded-[18px] bg-[linear-gradient(180deg,var(--color-cs-azul)_0%,#003685_100%)] p-5.5">
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between text-left">
        <div>
          <div className="text-[17px] leading-tight font-extrabold tracking-tight text-white">Resumen presupuesto 2027</div>
          <div className="mt-0.5 text-xs text-white/72">Registro de montos, datos actualizados en tiempo real</div>
        </div>
        <div className="flex size-[30px] shrink-0 items-center justify-center rounded-[9px] bg-white/14 hover:bg-white/24">
          <Icon name={open ? 'chevron_left' : 'chevron_right'} size={15} color="#fff" />
        </div>
      </button>

      {open && (
        <div className="mt-4.5 flex flex-wrap gap-2.5">
          {visibles.map((c) => (
            <CountrySummaryCard key={c.pais} c={c} />
          ))}
        </div>
      )}
    </div>
  )
}
