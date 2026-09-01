import { useState } from 'react'
import { Icon } from '@/shared/ui'
import type { PepN7Filters } from '../lib/pep-n7-filters-types'

const N7_LABELS: Record<keyof PepN7Filters, string> = { servicio: 'Servicio', cod: 'Código PEP', bandera: 'Bandera', destino: 'Destino', ceco: 'Centro de costo' }

interface PepN7FiltersBarProps {
  filters: PepN7Filters
  onChange: <K extends keyof PepN7Filters>(key: K, value: string) => void
  onClear: () => void
}

export function PepN7FiltersBar({ filters, onChange, onClear }: PepN7FiltersBarProps) {
  const [open, setOpen] = useState(false)
  const activeCount = Object.values(filters).filter(Boolean).length

  return (
    <div className="mb-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2.5 rounded-[10px] border-[1.5px] border-primary/30 bg-white px-4 py-2.5 text-[13.5px] font-bold text-primary hover:border-primary hover:bg-[#F4F7FE]"
      >
        <Icon name="filter" size={15} color="#0047B0" />
        <span>Filtro PEP N7</span>
        {activeCount > 0 && (
          <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1.5 text-[10.5px] font-bold text-white">
            {activeCount}
          </span>
        )}
        <Icon name={open ? 'chevron_up' : 'chevron_down'} size={13} color="#0047B0" />
      </button>

      {open && (
        <div className="mt-2.5 flex flex-col gap-3.5 rounded-xl border border-border bg-white p-4.5 shadow-[0_4px_16px_rgba(6,20,60,0.06)]">
          <div className="grid grid-cols-5 gap-3">
            {(Object.keys(N7_LABELS) as (keyof PepN7Filters)[]).map((key) => (
              <div key={key}>
                <label className="mb-1 block text-[11px] font-bold tracking-[0.04em] text-muted-foreground uppercase">{N7_LABELS[key]}</label>
                <input
                  className="h-[38px] w-full rounded-[10px] border-[1.5px] border-border bg-white px-3 text-[12.5px] outline-none placeholder:text-muted-foreground focus:border-primary"
                  placeholder={`Buscar ${N7_LABELS[key].toLowerCase()}...`}
                  value={filters[key]}
                  onChange={(e) => onChange(key, e.target.value)}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end border-t border-primary/10 pt-2">
            <button type="button" onClick={onClear} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12.5px] font-semibold text-cs-gris-oscuro hover:bg-[#F1F4FA]">
              <Icon name="trash" size={13} color="currentColor" /> Limpiar filtros
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
