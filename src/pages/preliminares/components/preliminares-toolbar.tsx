import { Button, Icon } from '@/shared/ui'
import { useRole } from '@/shared/context/use-role'
import { PrelimFilterToggle } from './preliminares-filters'

interface PreliminaresToolbarProps {
  filtersOpen: boolean
  onToggleFilters: () => void
  activeFilterCount: number
  onGuardarDefinitivo: () => void
  selectedCount: number
  allSelected: boolean
  onToggleSelectAll: () => void
  onOpenCargaMasiva: () => void
  onDownload: () => void
}

export function PreliminaresToolbar({
  filtersOpen,
  onToggleFilters,
  activeFilterCount,
  onGuardarDefinitivo,
  selectedCount,
  allSelected,
  onToggleSelectAll,
  onOpenCargaMasiva,
  onDownload,
}: PreliminaresToolbarProps) {
  const { role } = useRole()
  const isCdG = role === 'cdg'

  return (
    <div className="mx-8 mb-4 flex flex-wrap items-center justify-between gap-3">
      <PrelimFilterToggle open={filtersOpen} onToggle={onToggleFilters} activeCount={activeFilterCount} />
      <div className="flex items-center gap-2">
        {isCdG && (
          <Button variant="outline" size="sm" onClick={onToggleSelectAll}>
            <Icon name={allSelected ? 'minus' : 'check'} size={12} color="#0047B0" /> {allSelected ? 'Deseleccionar todo' : 'Seleccionar todos'}
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={onDownload}>
          <Icon name="download" size={12} color="#0047B0" /> Descargar
        </Button>
        {isCdG && (
          <Button variant="outline" size="sm" onClick={onOpenCargaMasiva}>
            <Icon name="upload" size={12} color="#0047B0" /> Carga masiva
          </Button>
        )}
        {isCdG && (
          <Button variant="primary" size="sm" onClick={onGuardarDefinitivo} disabled={selectedCount === 0} className="disabled:opacity-40">
            <Icon name="check" size={13} color="#fff" /> Guardar Definitivo {selectedCount > 0 && `(${selectedCount})`}
          </Button>
        )}
      </div>
    </div>
  )
}
