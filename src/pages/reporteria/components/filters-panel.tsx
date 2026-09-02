import { useState } from 'react'
import { Icon } from '@/shared/ui'
import type { ReporteriaFilters } from '../lib/use-reporteria-filters'
import { AplicarFiltrosBar } from './aplicar-filtros-bar'
import { FiltersFieldsGrid } from './filters-fields-grid'

interface FiltersPanelProps {
  draft: ReporteriaFilters
  onChange: <K extends keyof ReporteriaFilters>(key: K, value: ReporteriaFilters[K]) => void
  onClear: () => void
  onApply: () => void
  pending: boolean
  activeCount: number
}

export function FiltersPanel({ draft, onChange, onClear, onApply, pending, activeCount }: FiltersPanelProps) {
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
        <div className="mt-2.5 flex flex-col rounded-xl border border-border bg-white shadow-[0_4px_16px_rgba(6,20,60,0.06)]">
          <FiltersFieldsGrid draft={draft} onChange={onChange} />
          <AplicarFiltrosBar pending={pending} onClear={onClear} onApply={onApply} />
        </div>
      )}
    </div>
  )
}
