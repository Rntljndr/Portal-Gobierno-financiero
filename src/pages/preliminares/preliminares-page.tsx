import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Breadcrumb, BulkUploadModal, Button, Modal, Pagination, Toast } from '@/shared/ui'
import { PRELIM_MES_OPEN_LABEL } from '@/data/preliminares'
import type { PreliminarN4Row, PreliminarRow } from '@/data/preliminares'
import { useRole } from '@/shared/context/use-role'
import { usePreliminares } from './lib/use-preliminares'
import { downloadPreliminaresCsv } from './lib/download-csv'
import { PreliminaresPageHeader } from './components/preliminares-page-header'
import { PreliminaresKpis } from './components/preliminares-kpis'
import { PreliminaresStatsRow } from './components/preliminares-stats-row'
import { PreliminaresToolbar } from './components/preliminares-toolbar'
import { PrelimFiltersPanel } from './components/preliminares-filters'
import { PreliminaresTable } from './components/preliminares-table'

export function PreliminaresPage() {
  const navigate = useNavigate()
  const { role } = useRole()
  const isCdG = role === 'cdg'
  const s = usePreliminares()
  const [showBulkUpload, setShowBulkUpload] = useState(false)

  const goToN7 = (row: PreliminarN4Row | PreliminarRow) => navigate(`/preliminares/${encodeURIComponent(row.codigo)}`)

  return (
    <div className="h-full overflow-y-auto">
      <Breadcrumb items={[{ label: 'SIP', to: '/' }, { label: 'Presupuesto', to: '/ejercicios' }, { label: 'Reales', to: '/reales' }, { label: 'Preliminares' }]} />
      <PreliminaresPageHeader tab={s.tab} onTabChange={s.setTab} />
      <PreliminaresKpis {...s.kpi} />
      <PreliminaresStatsRow totalServicio={s.totalServicio} conPrelim={s.conPrelim} definitivos={s.definitivos} />
      <PreliminaresToolbar
        filtersOpen={s.filtersOpen}
        onToggleFilters={() => s.setFiltersOpen((v) => !v)}
        activeFilterCount={s.activeFilterCount}
        onGuardarDefinitivo={() => s.setShowConfirm(true)}
        selectedCount={s.selected.size}
        allSelected={s.allSelected}
        onToggleSelectAll={s.toggleSelectAll}
        onOpenCargaMasiva={() => setShowBulkUpload(true)}
        onDownload={() => downloadPreliminaresCsv(s.activeData, `Preliminares_${s.isN7 ? 'N7' : 'N4'}_Agosto2026.csv`)}
      />
      <PrelimFiltersPanel open={s.filtersOpen} isN7={s.isN7} filters={s.filters} options={s.options} onChange={s.onChangeFilter} onClear={s.clearFilters} activeCount={s.activeFilterCount} />
      <PreliminaresTable
        rows={s.paged}
        isN7={s.isN7}
        itemLabel={s.isN7 ? 'PEPs N7' : 'servicios'}
        mesLabel={PRELIM_MES_OPEN_LABEL.split(' ')[0]}
        onRowClick={s.isN7 ? undefined : goToN7}
        selectable={isCdG}
        selected={s.selected}
        onToggleSelect={s.toggleSelected}
        onToggleSelectN4={s.toggleSelectedN4}
      />
      <Pagination page={s.page} totalPages={s.totalPages} totalItems={s.totalFiltered} pageSize={s.pageSize} onPageChange={s.setPage} itemLabel={s.isN7 ? 'PEPs N7' : 'servicios'} />

      <Modal
        open={s.showConfirm}
        onClose={() => s.setShowConfirm(false)}
        title="Guardar definitivo"
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
          Estás a punto de guardar a definitivos "{s.selected.size} PEP"?
        </p>
      </Modal>

      <BulkUploadModal
        open={showBulkUpload}
        onClose={() => setShowBulkUpload(false)}
        onApplied={s.onBulkUploadApplied}
        title="Carga masiva de reales"
        applyLabel="Aplicar carga"
      />

      <Toast message={s.showToast} />
    </div>
  )
}
