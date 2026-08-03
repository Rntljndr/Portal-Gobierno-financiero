import type { Servicio } from '@/data/services'
import { StatusTabs, type StatusTab } from './status-tabs'
import { ViewModeToggle, type ViewMode } from './view-mode-toggle'

interface ServicesToolbarProps {
  statusTab: StatusTab
  onStatusChange: (tab: StatusTab) => void
  counts: Record<StatusTab, number>
  pageItems: Servicio[]
  selectedIds: Set<string>
  onToggleSelected: (id: string) => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
}

function isPendiente(s: Servicio) {
  return s.estado === 'Borrador' || s.estado === 'Requiere revisión'
}

export function ServicesToolbar({
  statusTab, onStatusChange, counts, pageItems, selectedIds, onToggleSelected, viewMode, onViewModeChange,
}: ServicesToolbarProps) {
  const pendientesEnPagina = pageItems.filter(isPendiente)
  const allSelected = pendientesEnPagina.length > 0 && pendientesEnPagina.every((s) => selectedIds.has(s.id))
  const showSelectAll = statusTab === 'todos' || statusTab === 'pendientes'

  const handleSelectAll = () => {
    pendientesEnPagina.forEach((s) => {
      const isSelected = selectedIds.has(s.id)
      if (allSelected ? isSelected : !isSelected) onToggleSelected(s.id)
    })
  }

  return (
    <div className="mx-8 mb-5 flex flex-wrap items-end justify-between gap-4">
      <StatusTabs active={statusTab} onChange={onStatusChange} counts={counts} />
      <div className="flex items-center gap-4">
        <ViewModeToggle value={viewMode} onChange={onViewModeChange} />
        {showSelectAll && (
          <button type="button" onClick={handleSelectAll} className="rounded-lg px-3 py-2 text-[12.5px] font-semibold text-primary hover:bg-primary/6">
            {allSelected ? 'Deseleccionar todo' : 'Seleccionar todo'}
          </button>
        )}
      </div>
    </div>
  )
}
