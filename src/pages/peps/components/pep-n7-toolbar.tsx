import { Button, Icon } from '@/shared/ui'
import type { PepN7Filters } from '../lib/pep-n7-filters-types'
import { PepN7FiltersBar } from './pep-n7-filters'

interface PepN7ToolbarProps {
  filters: PepN7Filters
  onChangeFilter: <K extends keyof PepN7Filters>(k: K, v: PepN7Filters[K]) => void
  onClearFilters: () => void
  onMasivo: () => void
  onCrear: () => void
}

export function PepN7Toolbar({ filters, onChangeFilter, onClearFilters, onMasivo, onCrear }: PepN7ToolbarProps) {
  return (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
      <PepN7FiltersBar filters={filters} onChange={onChangeFilter} onClear={onClearFilters} />
      <div className="mb-3 flex gap-2">
        <Button variant="outline" size="sm" onClick={onMasivo}>
          <Icon name="upload" size={12} color="#0047B0" /> Crear PEP N7 masivamente
        </Button>
        <Button size="sm" variant="onGreenCard" className="border-[#1F8A5B] bg-[#22976B] text-white hover:bg-[#1F8A5B]" onClick={onCrear}>
          <Icon name="plus" size={13} color="#fff" /> Crear PEP N7
        </Button>
      </div>
    </div>
  )
}
