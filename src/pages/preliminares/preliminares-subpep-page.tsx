import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Breadcrumb, BulkUploadDrawer, EmptyState, Toast, VolverBar } from '@/shared/ui'
import type { PreliminarRow } from '@/data/preliminares'
import { useRole } from '@/shared/context/use-role'
import { useComparisonsState } from '@/pages/reales/lib/use-comparisons-state'
import { usePreliminaresStore } from './lib/use-preliminares-store'
import { usePrelimToolbar } from './lib/use-prelim-toolbar'
import { calcPrelimKpis, calcPrelimStats } from './lib/preliminares-calc'
import { downloadPreliminaresCsv } from './lib/download-csv'
import { PreliminaresKpis } from './components/preliminares-kpis'
import { PreliminaresStatsRow } from './components/preliminares-stats-row'
import { PreliminaresToolbar } from './components/preliminares-toolbar'
import { PreliminaresTopActions } from './components/preliminares-top-actions'
import { PreliminaresSearchPanel } from './components/preliminares-search-panel'
import { PreliminaresSubPepHeader } from './components/preliminares-subpep-header'
import { PreliminaresTable } from './components/preliminares-table'

/** SubPEP como fila de tabla N7: hereda la identidad del N7 padre y prorratea sus montos según el peso de cada SubPEP. */
function buildSubPepRows(n7: PreliminarRow): PreliminarRow[] {
  const subPeps = n7.subPeps ?? []
  const totalMonto = subPeps.reduce((s, sp) => s + sp.monto, 0) || 1
  return subPeps.map((sp) => {
    const peso = sp.monto / totalMonto
    const meses = Object.fromEntries(Object.entries(n7.meses).map(([k, v]) => [k, v * peso]))
    return {
      ...n7,
      codigo: sp.codigo,
      servicio: sp.nombre,
      meses,
      acumReal: Math.round(n7.acumReal * peso),
      forecastMes: Math.round(n7.forecastMes * peso),
      preliminarMes: Math.round(n7.preliminarMes * peso),
      subPeps: undefined,
    }
  })
}

export function PreliminaresSubPepPage() {
  const { codigo, n7codigo } = useParams()
  const navigate = useNavigate()
  const store = usePreliminaresStore()
  const { role } = useRole()
  const isCdG = role === 'cdg'
  const n4 = store.rows.find((r) => r.codigo === codigo)
  const n7 = n4?.children.find((c) => c.codigo === n7codigo)

  const rows = useMemo(() => (n7 ? buildSubPepRows(n7) : []), [n7])
  const kpis = useMemo(() => calcPrelimKpis(rows), [rows])
  const stats = useMemo(() => calcPrelimStats(rows), [rows])
  const t = usePrelimToolbar({ rows, markCodigos: () => [] }) // P6: SubPEPs son solo visualización, sin Guardar Definitivo
  const { activeForecastLabel } = useComparisonsState()

  if (!n4 || !n7) {
    return (
      <div className="mx-8 my-8">
        <EmptyState icon="search" title="PEP N7 no encontrado" text="No existe un PEP N7 con ese código." />
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
          { label: 'Preliminares', to: '/preliminares' },
          { label: `N4 — ${n4.servicio}`, to: `/preliminares/${encodeURIComponent(n4.codigo)}` },
          { label: `N7 — ${n7.servicio}` },
        ]}
      />
      <PreliminaresSubPepHeader servicio={n7.servicio} codigo={n7.codigo} mesAbierto={t.mesAbierto} />

      <PreliminaresTopActions
        filtersOpen={t.filtersOpen}
        onToggleFilters={() => t.setFiltersOpen((v) => !v)}
        activeFilterCount={t.search ? 1 : 0}
        activeForecastLabel={activeForecastLabel}
        onCierreContable={() => {}}
        showCierreContable={false}
      />
      <PreliminaresKpis {...kpis} />
      {isCdG && <PreliminaresStatsRow totalServicio={stats.total} conPrelim={stats.conPrelim} definitivos={stats.definitivos} />}

      <PreliminaresToolbar
        filtersOpen={t.filtersOpen}
        onToggleFilters={() => t.setFiltersOpen((v) => !v)}
        activeFilterCount={t.search ? 1 : 0}
        onGuardarDefinitivo={() => {}}
        selectedCount={0}
        allSelected={false}
        onToggleSelectAll={() => {}}
        showSelection={false}
        onOpenCargaMasiva={() => t.setShowBulkUpload(true)}
        onDownload={() => downloadPreliminaresCsv(t.filteredRows, `Preliminares_SubPEP_${n7.codigo}.csv`)}
        onCierreContable={() => {}}
        showFiltros={false}
        showCierreContable={false}
      />
      {t.filtersOpen && <PreliminaresSearchPanel label="Nombre / código SubPEP" search={t.search} onSearchChange={t.setSearch} />}

      <PreliminaresTable
        rows={t.filteredRows}
        isN7
        showSubPepCol={false}
        identityLabel="SubPEP"
        itemLabel="SubPEPs"
        mesLabel={t.mesAbierto.split(' ')[0]}
      />

      <BulkUploadDrawer open={t.showBulkUpload} onClose={() => t.setShowBulkUpload(false)} onApplied={t.handleBulkUploadApplied} title="Carga masiva de preliminares" applyLabel="Aplicar carga" />
      <Toast message={t.toast} />
      </div>
      <VolverBar label="Volver a N7" onBack={() => navigate(`/preliminares/${encodeURIComponent(n4.codigo)}`)} />
    </div>
  )
}
