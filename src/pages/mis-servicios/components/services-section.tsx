import type { Servicio } from '@/data/services'
import { Pagination } from '@/shared/ui'
import { PepN4Actions } from './pep-n4-actions'
import { ServicesToolbar } from './services-toolbar'
import { ServicesGrid } from './services-grid'
import { ServicesTable } from './services-table'
import type { useMisServicios } from '../lib/use-mis-servicios'

interface ServicesSectionProps {
  state: ReturnType<typeof useMisServicios>
  onOpenModal: (modal: 'crear' | 'cargaMasiva' | 'edicionMasiva' | 'descargar') => void
  onOpenServicio: (s: Servicio) => void
}

export function ServicesSection({ state, onOpenModal, onOpenServicio }: ServicesSectionProps) {
  return (
    <>
      <div className="mx-8 mb-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="block text-[17px] leading-tight font-extrabold tracking-tight text-primary">PEP N4</span>
          <span className="mt-0.5 block text-[12.5px] text-muted-foreground">Gestioná las líneas bajo tu responsabilidad</span>
        </div>
        <PepN4Actions
          onCargaMasiva={() => onOpenModal('cargaMasiva')}
          onCrear={() => onOpenModal('crear')}
          onEdicionMasiva={() => onOpenModal('edicionMasiva')}
          onDescargar={() => onOpenModal('descargar')}
        />
      </div>

      <ServicesToolbar
        statusTab={state.statusTab}
        onStatusChange={state.setStatusTab}
        counts={state.counts}
        pageItems={state.paged}
        selectedIds={state.selectedIds}
        onToggleSelected={state.toggleSelected}
        viewMode={state.viewMode}
        onViewModeChange={state.setViewMode}
      />

      {state.viewMode === 'tabla' ? (
        <ServicesTable items={state.paged} selectedIds={state.selectedIds} onToggleSelected={state.toggleSelected} onOpen={onOpenServicio} />
      ) : (
        <ServicesGrid items={state.paged} selectedIds={state.selectedIds} onToggleSelected={state.toggleSelected} onOpen={onOpenServicio} />
      )}

      <Pagination
        page={state.page}
        totalPages={state.totalPages}
        totalItems={state.filteredCount}
        pageSize={state.pageSize}
        onPageChange={state.setPage}
        itemLabel="servicios"
      />
    </>
  )
}
