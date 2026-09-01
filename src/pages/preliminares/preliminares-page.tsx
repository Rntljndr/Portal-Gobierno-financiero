import { useNavigate } from 'react-router'
import { Breadcrumb, Button, Modal, Pagination, Toast } from '@/shared/ui'
import { PRELIM_MES_OPEN_LABEL } from '@/data/preliminares'
import type { PreliminarN4Row, PreliminarRow } from '@/data/preliminares'
import { usePreliminares } from './lib/use-preliminares'
import { PreliminaresPageHeader } from './components/preliminares-page-header'
import { PreliminaresKpis } from './components/preliminares-kpis'
import { PreliminaresStatsRow } from './components/preliminares-stats-row'
import { PreliminaresToolbar } from './components/preliminares-toolbar'
import { PrelimFiltersPanel } from './components/preliminares-filters'
import { PreliminaresTable } from './components/preliminares-table'

export function PreliminaresPage() {
  const navigate = useNavigate()
  const s = usePreliminares()

  const goToN7 = (row: PreliminarN4Row | PreliminarRow) => navigate(`/preliminares/${encodeURIComponent(row.codigo)}`)

  return (
    <div className="h-full overflow-y-auto">
      <Breadcrumb items={[{ label: 'SIP', to: '/' }, { label: 'Presupuesto', to: '/ejercicios' }, { label: 'Reales', to: '/reales' }, { label: 'Preliminares' }]} />
      <PreliminaresPageHeader tab={s.tab} onTabChange={s.setTab} />
      <PreliminaresKpis {...s.kpi} />
      <PreliminaresStatsRow totalServicio={s.totalServicio} conPrelim={s.conPrelim} definitivos={s.definitivos} />
      <PreliminaresToolbar filtersOpen={s.filtersOpen} onToggleFilters={() => s.setFiltersOpen((v) => !v)} activeFilterCount={s.activeFilterCount} onGuardarDefinitivo={() => s.setShowConfirm(true)} />
      <PrelimFiltersPanel open={s.filtersOpen} isN7={s.isN7} filters={s.filters} options={s.options} onChange={s.onChangeFilter} onClear={s.clearFilters} activeCount={s.activeFilterCount} />
      <PreliminaresTable rows={s.paged} isN7={s.isN7} itemLabel={s.isN7 ? 'PEPs N7' : 'servicios'} mesLabel={PRELIM_MES_OPEN_LABEL.split(' ')[0]} onRowClick={s.isN7 ? undefined : goToN7} />
      <Pagination page={s.page} totalPages={s.totalPages} totalItems={s.totalFiltered} pageSize={s.pageSize} onPageChange={s.setPage} itemLabel={s.isN7 ? 'PEPs N7' : 'servicios'} />

      <Modal
        open={s.showConfirm}
        onClose={() => s.setShowConfirm(false)}
        title="¿Guardar como Definitivo?"
        footer={
          <>
            <Button variant="outline" onClick={() => s.setShowConfirm(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={s.onConfirmGuardar}>
              Sí, guardar definitivo
            </Button>
          </>
        }
      >
        <p className="text-[13.5px] leading-relaxed text-cs-gris-oscuro">
          Los preliminares de <strong className="text-foreground">{PRELIM_MES_OPEN_LABEL}</strong> quedarán bloqueados y no podrán modificarse. Esta acción no se puede deshacer.
        </p>
      </Modal>

      <Toast message={s.showToast ? 'Preliminares guardados como definitivos' : null} />
    </div>
  )
}
