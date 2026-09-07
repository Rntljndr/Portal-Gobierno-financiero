import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Breadcrumb, BulkUploadDrawer, ColumnsDrawer, Toast } from '@/shared/ui'
import { useRole } from '@/shared/context/use-role'
import { sumTotals } from './lib/reales-calc'
import { downloadRealesCsv } from './lib/download-csv'
import { useReales } from './lib/use-reales'
import { useInfiniteScroll } from './lib/use-infinite-scroll'
import { useBulkUploadToast } from './lib/use-bulk-upload-toast'
import { realesColsForMode } from './lib/reales-table-cols'
import { RealesPageHeader } from './components/reales-page-header'
import { RealesKpis } from './components/reales-kpis'
import { RealesToolbar } from './components/reales-toolbar'
import { RealesFiltersPanel } from './components/reales-filters'
import { RealesTable } from './components/reales-table'
import { RealesComparisonDrawer } from './components/reales-comparison-drawer'
import { RealesInfiniteFooter } from './components/reales-infinite-footer'
import type { RealesN7Row, RealesRow } from '@/data/reales'

export function RealesPage() {
  const navigate = useNavigate()
  const s = useReales()
  const { role } = useRole()
  const isCdG = role === 'cdg'
  const [cargaMasivaOpen, setCargaMasivaOpen] = useState(false)
  const upload = useBulkUploadToast()
  // Ajuste R3: scroll infinito en la vista general (N4 y N7), con posición/cantidad cargada recordada por pestaña.
  const infinite = useInfiniteScroll(`reales-${s.tab}`, s.totalFiltered)
  const paged = s.activeData.slice(0, infinite.visibleCount)

  const aggregateTotals = sumTotals(s.isN7 ? s.filteredN7 : s.filteredN4)
  const pagedCodigos = paged.map((r) => r.codigo)

  const goToN7 = (row: RealesRow | RealesN7Row) => navigate(`/reales/${encodeURIComponent(row.codigo)}`)

  return (
    <div ref={infinite.containerRef} className="h-full overflow-y-auto">
      <Breadcrumb items={[{ label: 'SIP', to: '/' }, { label: 'Presupuesto', to: '/ejercicios' }, { label: 'Ejercicios', to: '/ejercicios' }, { label: 'Reales' }]} />
      <RealesPageHeader tab={s.tab} onTabChange={s.setTab} />
      <RealesKpis totals={aggregateTotals} currency={s.currency} />
      <RealesToolbar
        filtersOpen={s.filtersOpen}
        onToggleFilters={() => s.setFiltersOpen((v) => !v)}
        activeFilterCount={s.activeFilterCount}
        comparisonCount={s.comparisonKeys.length}
        onOpenComparar={() => s.setCompDrawerOpen(true)}
        onDownload={() => downloadRealesCsv(s.filteredN4, 'Reales_N4_2026.csv')}
        onOpenColumnas={() => s.setColumnsDrawerOpen(true)}
        onOpenCargaMasiva={isCdG ? () => setCargaMasivaOpen(true) : undefined}
        allComparisonsCollapsed={s.allRowsCollapsed(pagedCodigos)}
        onToggleAllComparisons={() => s.toggleAllRows(pagedCodigos)}
        activeForecastLabel={s.activeForecastLabel}
      />
      <RealesFiltersPanel open={s.filtersOpen} isN7={s.isN7} filters={s.filters} options={s.options} onChange={s.onChangeFilter} onClear={s.clearFilters} activeCount={s.activeFilterCount} />
      <RealesTable
        rows={paged}
        mode={s.isN7 ? 'n7' : 'n4'}
        visibleCols={s.visibleCols}
        currency={s.currency}
        comparisons={s.comparisonKeys}
        forecastRound={s.forecastRound}
        collapsedRows={s.collapsedRows}
        onToggleRowCollapse={s.toggleRowCollapse}
        itemLabel={s.isN7 ? 'PEPs N7' : 'servicios'}
        onRowClick={s.isN7 ? (row) => navigate(`/reales/${encodeURIComponent((row as RealesN7Row).parentCodigo)}/${encodeURIComponent(row.codigo)}`) : goToN7}
      />
      <RealesInfiniteFooter
        visibleCount={paged.length}
        total={s.totalFiltered}
        itemLabel={s.isN7 ? 'PEPs N7' : 'servicios'}
        hasMore={infinite.hasMore}
        loadingMore={infinite.loadingMore}
        sentinelRef={infinite.sentinelRef}
      />
      <RealesComparisonDrawer open={s.compDrawerOpen} onClose={() => s.setCompDrawerOpen(false)} applied={s.comparisons} onApply={s.setComparisons} />
      {isCdG && (
        <BulkUploadDrawer
          open={cargaMasivaOpen}
          onClose={() => setCargaMasivaOpen(false)}
          onApplied={upload.onApplied}
          title="Carga masiva de reales"
          applyLabel="Aplicar carga"
        />
      )}
      <Toast message={upload.toast} />
      <ColumnsDrawer
        open={s.columnsDrawerOpen}
        cols={realesColsForMode(s.isN7 ? 'n7' : 'n4')}
        visibleCols={s.visibleCols}
        onApply={s.setVisibleCols}
        onClose={() => s.setColumnsDrawerOpen(false)}
      />
    </div>
  )
}
