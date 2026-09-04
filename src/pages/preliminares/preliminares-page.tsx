import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Breadcrumb, BulkUploadDrawer, Pagination, Toast } from '@/shared/ui'
import { PRELIM_MES_OPEN_LABEL } from '@/data/preliminares'
import type { PreliminarN4Row, PreliminarRow } from '@/data/preliminares'
import { useRole } from '@/shared/context/use-role'
import { useMesCierre } from '@/shared/context/use-mes-cierre'
import { usePreliminares } from './lib/use-preliminares'
import { downloadPreliminaresCsv } from './lib/download-csv'
import { PreliminaresPageHeader } from './components/preliminares-page-header'
import { PreliminaresKpis } from './components/preliminares-kpis'
import { PreliminaresStatsRow } from './components/preliminares-stats-row'
import { PreliminaresToolbar } from './components/preliminares-toolbar'
import { PrelimFiltersPanel } from './components/preliminares-filters'
import { PreliminaresTable } from './components/preliminares-table'
import { CierreContableModal } from './components/cierre-contable-modal'
import { GuardarDefinitivoModal } from './components/guardar-definitivo-modal'

export function PreliminaresPage() {
  const navigate = useNavigate()
  const { role } = useRole()
  const isCdG = role === 'cdg'
  const s = usePreliminares()
  const { mesCerrado, cerrarMes } = useMesCierre()
  const [showBulkUpload, setShowBulkUpload] = useState(false)
  const [showCierre, setShowCierre] = useState(false)
  const [cierreToast, setCierreToast] = useState<string | null>(null)

  const confirmCierre = () => {
    cerrarMes()
    setShowCierre(false)
    setCierreToast(`Cierre Contable de ${PRELIM_MES_OPEN_LABEL} ejecutado. Los datos ya están disponibles en Reales.`)
    setTimeout(() => setCierreToast(null), 4000)
  }

  const goToN7 = (row: PreliminarN4Row | PreliminarRow) => navigate(`/preliminares/${encodeURIComponent(row.codigo)}`)
  const goToSubPep = (row: PreliminarRow & { parentCodigo?: string }) => {
    if (!row.parentCodigo) return
    navigate(`/preliminares/${encodeURIComponent(row.parentCodigo)}/${encodeURIComponent(row.codigo)}`)
  }

  return (
    <div className="h-full overflow-y-auto">
      <Breadcrumb items={[{ label: 'SIP', to: '/' }, { label: 'Presupuesto', to: '/ejercicios' }, { label: 'Reales', to: '/reales' }, { label: 'Preliminares' }]} />
      <PreliminaresPageHeader tab={s.tab} onTabChange={s.setTab} />
      <PreliminaresKpis {...s.kpi} />
      {isCdG && <PreliminaresStatsRow totalServicio={s.totalServicio} conPrelim={s.conPrelim} definitivos={s.definitivos} />}
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
        onCierreContable={() => setShowCierre(true)}
        mesCerrado={mesCerrado}
      />
      <PrelimFiltersPanel open={s.filtersOpen} isN7={s.isN7} filters={s.filters} options={s.options} onChange={s.onChangeFilter} onClear={s.clearFilters} activeCount={s.activeFilterCount} />
      <PreliminaresTable
        rows={s.paged}
        isN7={s.isN7}
        itemLabel={s.isN7 ? 'PEPs N7' : 'servicios'}
        mesLabel={PRELIM_MES_OPEN_LABEL.split(' ')[0]}
        onRowClick={s.isN7 ? goToSubPep : goToN7}
        selectable={isCdG}
        selected={s.selected}
        onToggleSelect={s.toggleSelected}
        onToggleSelectN4={s.toggleSelectedN4}
      />
      <Pagination page={s.page} totalPages={s.totalPages} totalItems={s.totalFiltered} pageSize={s.pageSize} onPageChange={s.setPage} itemLabel={s.isN7 ? 'PEPs N7' : 'servicios'} />

      <GuardarDefinitivoModal open={s.showConfirm} count={s.selected.size} onClose={() => s.setShowConfirm(false)} onConfirm={s.onConfirmGuardar} />

      <BulkUploadDrawer
        open={showBulkUpload}
        onClose={() => setShowBulkUpload(false)}
        onApplied={s.onBulkUploadApplied}
        title="Carga masiva de reales"
        applyLabel="Aplicar carga"
      />

      <CierreContableModal open={showCierre} mesLabel={PRELIM_MES_OPEN_LABEL} onClose={() => setShowCierre(false)} onConfirm={confirmCierre} />

      <Toast message={s.showToast} />
      <Toast message={cierreToast} />
    </div>
  )
}
