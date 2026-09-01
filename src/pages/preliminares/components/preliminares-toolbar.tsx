import { Button, Icon } from '@/shared/ui'
import { PrelimFilterToggle } from './preliminares-filters'

interface PreliminaresToolbarProps {
  filtersOpen: boolean
  onToggleFilters: () => void
  activeFilterCount: number
  onGuardarDefinitivo: () => void
}

export function PreliminaresToolbar({ filtersOpen, onToggleFilters, activeFilterCount, onGuardarDefinitivo }: PreliminaresToolbarProps) {
  return (
    <div className="mx-8 mb-4 flex flex-wrap items-center justify-between gap-3">
      <PrelimFilterToggle open={filtersOpen} onToggle={onToggleFilters} activeCount={activeFilterCount} />
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" disabled className="opacity-50">
          <Icon name="download" size={12} color="#0047B0" /> Descargar
        </Button>
        <Button variant="primary" size="sm" onClick={onGuardarDefinitivo}>
          <Icon name="check" size={13} color="#fff" /> Guardar Definitivo
        </Button>
      </div>
    </div>
  )
}
