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
  onCierreContable: () => void
  mesCerrado: boolean
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
  onCierreContable,
  mesCerrado,
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
          <Button variant="outline" size="sm" onClick={onOpenCargaMasiva} disabled={mesCerrado} className="disabled:opacity-40">
            <Icon name="upload" size={12} color="#0047B0" /> Carga masiva
          </Button>
        )}
        {isCdG && (
          <Button variant="primary" size="sm" onClick={onGuardarDefinitivo} disabled={selectedCount === 0 || mesCerrado} className="disabled:opacity-40">
            <Icon name="check" size={13} color="#fff" /> Guardar Definitivo {selectedCount > 0 && `(${selectedCount})`}
          </Button>
        )}
        {isCdG && (
          <Button
            variant="outline"
            size="sm"
            onClick={onCierreContable}
            disabled={mesCerrado}
            className={mesCerrado ? 'disabled:opacity-40' : 'border-[#FECACA] text-[#B42318] hover:bg-[#FEE8E8]'}
          >
            <Icon name="lock" size={12} color={mesCerrado ? 'currentColor' : '#B42318'} /> {mesCerrado ? 'Mes cerrado' : 'Cierre Contable'}
          </Button>
        )}
      </div>
    </div>
  )
}
