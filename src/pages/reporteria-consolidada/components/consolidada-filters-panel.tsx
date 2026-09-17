import { useState } from 'react'
import { Icon } from '@/shared/ui'
import type { ConsolidadaFilters } from '../lib/use-consolidada-filters'
import { ConsolidadaFiltersFields } from './consolidada-filters-fields'

interface ConsolidadaFiltersPanelProps {
  filters: ConsolidadaFilters
  onChange: <K extends keyof ConsolidadaFilters>(key: K, value: ConsolidadaFilters[K]) => void
  onClear: () => void
  activeCount: number
}

export function ConsolidadaFiltersPanel({ filters, onChange, onClear, activeCount }: ConsolidadaFiltersPanelProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="mx-8 mb-[26px]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2.5 rounded-[10px] border-[1.5px] border-primary/30 bg-white px-4 py-2.5 text-[13.5px] font-bold text-primary hover:border-primary hover:bg-[#F4F7FE]"
      >
        <Icon name="filter" size={15} color="#0047B0" />
        <span>Filtros</span>
        {activeCount > 0 && (
          <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1.5 text-[10.5px] font-bold text-white">{activeCount}</span>
        )}
        <Icon name={open ? 'chevron_left' : 'chevron_right'} size={13} color="#0047B0" />
      </button>

      {open && (
        <div className="mt-2.5 rounded-xl border border-border bg-white shadow-[0_4px_16px_rgba(6,20,60,0.06)]">
          <ConsolidadaFiltersFields filters={filters} onChange={onChange} />
          <div className="flex items-center justify-end p-[2px_18px_12px]">
            <button type="button" onClick={onClear} className="text-[12.5px] font-semibold text-primary hover:underline">
              Limpiar todos los filtros
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
