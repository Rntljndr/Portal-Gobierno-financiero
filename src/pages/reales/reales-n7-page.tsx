import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Breadcrumb, BulkUploadDrawer, EmptyState, Toast, VolverBar } from '@/shared/ui'
import { realesRows } from '@/data/reales'
import { useRole } from '@/shared/context/use-role'
import { calcTotals } from './lib/reales-calc'
import { downloadRealesCsv } from './lib/download-csv'
import { useComparisonsState } from './lib/use-comparisons-state'
import { useBulkUploadToast } from './lib/use-bulk-upload-toast'
import { RealesComparisonDrawer } from './components/reales-comparison-drawer'
import { RealesDetailToolbar } from './components/reales-detail-toolbar'
import { RealesSearchPanel } from './components/reales-search-panel'
import { RealesDetailHeader } from './components/reales-detail-header'
import { RealesKpis } from './components/reales-kpis'
import { RealesTopActions } from './components/reales-top-actions'
import { RealesTable } from './components/reales-table'

export function RealesN7Page() {
  const { codigo } = useParams()
  const navigate = useNavigate()
  const n4 = realesRows.find((r) => r.codigo === codigo)
  const { role } = useRole()
  const isCdG = role === 'cdg'

  const [filtersOpen, setFiltersOpen] = useState(false)
  const [search, setSearch] = useState('')
  const cs = useComparisonsState()
  const [compOpen, setCompOpen] = useState(false)
  const [cargaMasivaOpen, setCargaMasivaOpen] = useState(false)
  const upload = useBulkUploadToast()

  const children = useMemo(() => {
    if (!n4) return []
    if (!search) return n4.children
    const q = search.toLowerCase()
    return n4.children.filter((c) => c.nombre.toLowerCase().includes(q) || c.codigo.toLowerCase().includes(q))
  }, [n4, search])

  if (!n4) {
    return (
      <div className="mx-8 my-8">
        <EmptyState icon="search" title="PEP no encontrado" text="No existe un PEP N4 con ese código." />
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto">
        <Breadcrumb
          items={[
            { label: 'SIP', to: '/' },
            { label: 'Presupuesto', to: '/ejercicios' },
            { label: 'Ejercicios', to: '/ejercicios' },
            { label: 'Reales', to: '/reales' },
            { label: `N4 — ${n4.nombre}` },
          ]}
        />
        <RealesDetailHeader title={n4.nombre} codigo={n4.codigo} />
        <RealesTopActions
          filtersOpen={filtersOpen}
          onToggleFilters={() => setFiltersOpen((v) => !v)}
          activeFilterCount={search ? 1 : 0}
          activeForecastLabel={cs.activeForecastLabel}
        />
        <RealesKpis totals={calcTotals(n4)} currency="USD" />
        <RealesDetailToolbar
          comparisonCount={cs.comparisonKeys.length}
          allComparisonsCollapsed={cs.allRowsCollapsed(children.map((c) => c.codigo))}
          onToggleAllComparisons={() => cs.toggleAllRows(children.map((c) => c.codigo))}
          onDownload={() => downloadRealesCsv(n4.children, `Reales_N7_${n4.codigo}.csv`)}
          onOpenComparar={() => setCompOpen(true)}
          onOpenCargaMasiva={isCdG ? () => setCargaMasivaOpen(true) : undefined}
          activeForecastLabel={cs.activeForecastLabel}
          showFiltros={false}
        />
        {filtersOpen && <RealesSearchPanel search={search} onSearchChange={setSearch} />}
        <RealesTable
          rows={children.map((c) => ({ ...c, parentCodigo: n4.codigo, parentNombre: n4.nombre }))}
          mode="n7"
          currency="USD"
          comparisons={cs.comparisonKeys}
          forecastRound={cs.forecastRound}
          collapsedRows={cs.collapsedRows}
          onToggleRowCollapse={cs.toggleRowCollapse}
          itemLabel="PEPs N7"
          onRowClick={(row) => navigate(`/reales/${encodeURIComponent(n4.codigo)}/${encodeURIComponent(row.codigo)}`)}
        />

        <RealesComparisonDrawer open={compOpen} onClose={() => setCompOpen(false)} applied={cs.comparisons} onApply={cs.setComparisons} />
        {isCdG && (
          <BulkUploadDrawer open={cargaMasivaOpen} onClose={() => setCargaMasivaOpen(false)} onApplied={upload.onApplied} title="Carga masiva de reales" applyLabel="Aplicar carga" />
        )}
        <Toast message={upload.toast} />
      </div>
      <VolverBar label="Volver a N4" onBack={() => navigate('/reales')} />
    </div>
  )
}
