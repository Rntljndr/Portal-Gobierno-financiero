import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Breadcrumb, BulkUploadDrawer, EmptyState, Toast, VolverBar } from '@/shared/ui'
import { realesRows } from '@/data/reales'
import type { RealesN7Row } from '@/data/reales'
import { useRole } from '@/shared/context/use-role'
import { calcTotals } from './lib/reales-calc'
import { downloadRealesCsv } from './lib/download-csv'
import { useComparisonsState } from './lib/use-comparisons-state'
import { useBulkUploadToast } from './lib/use-bulk-upload-toast'
import { RealesComparisonDrawer } from './components/reales-comparison-drawer'
import { RealesDetailToolbar } from './components/reales-detail-toolbar'
import { RealesDetailHeader } from './components/reales-detail-header'
import { RealesKpis } from './components/reales-kpis'
import { RealesTopActions } from './components/reales-top-actions'
import { RealesTable } from './components/reales-table'

/** SubPEP como fila de tabla N7: hereda la identidad del N7 padre y prorratea sus meses según el peso del monto de cada SubPEP. */
function buildSubPepRows(n7: RealesN7Row): RealesN7Row[] {
  const subPeps = n7.subPeps ?? []
  const totalMonto = subPeps.reduce((s, sp) => s + sp.monto, 0) || 1
  return subPeps.map((sp) => {
    const peso = sp.monto / totalMonto
    const meses = Object.fromEntries(Object.entries(n7.meses).map(([k, v]) => [k, v * peso]))
    return { ...n7, codigo: sp.codigo, nombre: sp.nombre, meses, subPeps: undefined, parentCodigo: n7.codigo, parentNombre: n7.nombre }
  })
}

export function RealesSubPepPage() {
  const { codigo, n7codigo } = useParams()
  const navigate = useNavigate()
  const n4 = realesRows.find((r) => r.codigo === codigo)
  const n7 = n4?.children.find((c) => c.codigo === n7codigo)
  const { role } = useRole()
  const isCdG = role === 'cdg'

  const cs = useComparisonsState()
  const [compOpen, setCompOpen] = useState(false)
  const [cargaMasivaOpen, setCargaMasivaOpen] = useState(false)
  const upload = useBulkUploadToast()

  const rows = useMemo(() => (n7 ? buildSubPepRows({ ...n7, parentCodigo: n4!.codigo, parentNombre: n4!.nombre }) : []), [n7, n4])

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
            { label: 'Ejercicios', to: '/ejercicios' },
            { label: 'Reales', to: '/reales' },
            { label: `N4 — ${n4.nombre}`, to: `/reales/${encodeURIComponent(n4.codigo)}` },
            { label: `N7 — ${n7.codigo}` },
          ]}
        />
        <RealesDetailHeader title={n7.nombre} codigo={n7.codigo} />
        <RealesTopActions activeForecastLabel={cs.activeForecastLabel} />
        <RealesKpis totals={calcTotals(n7)} currency="USD" />

        <RealesDetailToolbar
          comparisonCount={cs.comparisonKeys.length}
          allComparisonsCollapsed={cs.allRowsCollapsed(rows.map((r) => r.codigo))}
          onToggleAllComparisons={() => cs.toggleAllRows(rows.map((r) => r.codigo))}
          onDownload={() => downloadRealesCsv(rows, `Reales_SubPEP_${n7.codigo}.csv`)}
          onOpenComparar={() => setCompOpen(true)}
          onOpenCargaMasiva={isCdG ? () => setCargaMasivaOpen(true) : undefined}
          activeForecastLabel={cs.activeForecastLabel}
          showFiltros={false}
        />

        <RealesTable
          rows={rows}
          mode="n7"
          showSubPepCol={false}
          identityLabel="SubPEP"
          currency="USD"
          comparisons={cs.comparisonKeys}
          forecastRound={cs.forecastRound}
          collapsedRows={cs.collapsedRows}
          onToggleRowCollapse={cs.toggleRowCollapse}
          itemLabel="SubPEPs"
        />

        <RealesComparisonDrawer open={compOpen} onClose={() => setCompOpen(false)} applied={cs.comparisons} onApply={cs.setComparisons} />
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
      </div>
      <VolverBar label="Volver a N7" onBack={() => navigate(`/reales/${encodeURIComponent(n4.codigo)}`)} />
    </div>
  )
}
