import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Breadcrumb, BulkUploadDrawer, Pagination, Toast } from '@/shared/ui'
import type { PreliminarN4Row, PreliminarRow } from '@/data/preliminares'
import { useRole } from '@/shared/context/use-role'
import { useComparisonsState } from '@/pages/reales/lib/use-comparisons-state'
import { usePreliminares } from './lib/use-preliminares'
import { usePreliminaresStore } from './lib/use-preliminares-store'
import { downloadPreliminaresCsv } from './lib/download-csv'
import { PreliminaresPageHeader } from './components/preliminares-page-header'
import { PreliminaresKpis } from './components/preliminares-kpis'
import { PreliminaresStatsRow } from './components/preliminares-stats-row'
import { PreliminaresToolbar } from './components/preliminares-toolbar'
import { PreliminaresTopActions } from './components/preliminares-top-actions'
import { PrelimFiltersPanel } from './components/preliminares-filters'
import { PreliminaresTable } from './components/preliminares-table'
import { CierreContableModal } from './components/cierre-contable-modal'
import { GuardarDefinitivoModal } from './components/guardar-definitivo-modal'

export function PreliminaresPage() {
  const navigate = useNavigate()
  const { role } = useRole()
  const isCdG = role === 'cdg'
  const s = usePreliminares()
  const store = usePreliminaresStore()
  const { activeForecastLabel } = useComparisonsState()
  const [showBulkUpload, setShowBulkUpload] = useState(false)
  const [showCierre, setShowCierre] = useState(false)
  const [cierreToast, setCierreToast] = useState<string | null>(null)

  const confirmCierre = () => {
    const mesQueCierra = store.mesAbierto
    store.ejecutarCierreContable()
    setShowCierre(false)
    setCierreToast(`Cierre Contable de ${mesQueCierra} ejecutado. Los datos están disponibles en Reales.`)
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
      <PreliminaresPageHeader tab={s.tab} onTabChange={s.setTab} mesAbierto={store.mesAbierto} />
      <PreliminaresTopActions
        filtersOpen={s.filtersOpen}
        onToggleFilters={() => s.setFiltersOpen((v) => !v)}
        activeFilterCount={s.activeFilterCount}
        activeForecastLabel={activeForecastLabel}
        onCierreContable={() => setShowCierre(true)}
      />
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
        onDownload={() => downloadPreliminaresCsv(s.activeData, `Preliminares_${s.isN7 ? 'N7' : 'N4'}_${store.mesAbierto.replace(' ', '')}.csv`)}
        onCierreContable={() => setShowCierre(true)}
        showFiltros={false}
        showCierreContable={false}
      />
      <PrelimFiltersPanel open={s.filtersOpen} isN7={s.isN7} filters={s.filters} options={s.options} onChange={s.onChangeFilter} onClear={s.clearFilters} activeCount={s.activeFilterCount} />
      <PreliminaresTable
        rows={s.paged}
        isN7={s.isN7}
        itemLabel={s.isN7 ? 'PEPs N7' : 'servicios'}
        mesLabel={store.mesAbierto.split(' ')[0]}
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

      <CierreContableModal open={showCierre} mesLabel={store.mesAbierto} onClose={() => setShowCierre(false)} onConfirm={confirmCierre} />

      <Toast message={s.showToast} />
      <Toast message={cierreToast} />
    </div>
  )
}
