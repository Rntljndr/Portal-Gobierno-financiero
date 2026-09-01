import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Breadcrumb, EmptyState, Icon } from '@/shared/ui'
import { realesRows } from '@/data/reales'
import { calcTotals } from './lib/reales-calc'
import { downloadRealesCsv } from './lib/download-csv'
import { EMPTY_COMPARISONS, activeComparisonKeys } from './lib/comparisons'
import { RealesComparisonDrawer } from './components/reales-comparison-drawer'
import { RealesDetailHeader } from './components/reales-detail-header'
import { RealesKpis } from './components/reales-kpis'
import { RealesTable } from './components/reales-table'

export function RealesSubPepPage() {
  const { codigo, n7codigo } = useParams()
  const navigate = useNavigate()
  const n4 = realesRows.find((r) => r.codigo === codigo)
  const n7 = n4?.children.find((c) => c.codigo === n7codigo)

  const [comparisons, setComparisons] = useState(EMPTY_COMPARISONS)
  const [compOpen, setCompOpen] = useState(false)

  if (!n4 || !n7) {
    return (
      <div className="mx-8 my-8">
        <EmptyState icon="search" title="PEP N7 no encontrado" text="No existe un PEP N7 con ese código." />
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto">
      <Breadcrumb
        items={[
          { label: 'SIP', to: '/' },
          { label: 'Presupuesto', to: '/ejercicios' },
          { label: 'Ejercicios', to: '/ejercicios' },
          { label: 'Reales', to: '/reales' },
          { label: n4.nombre, to: `/reales/${encodeURIComponent(n4.codigo)}` },
          { label: n7.nombre },
        ]}
      />
      <RealesDetailHeader title={n7.nombre} codigo={n7.codigo} backLabel="Volver a N7" onBack={() => navigate(`/reales/${encodeURIComponent(n4.codigo)}`)} />
      <RealesKpis totals={calcTotals(n7)} currency="USD" />

      <div className="mx-8 mb-4 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => downloadRealesCsv([n7], `Reales_N7_${n7.codigo}.csv`)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border-strong bg-white px-3 py-[7px] text-xs font-semibold text-primary hover:bg-[#F4F7FE]"
        >
          <Icon name="download" size={12} color="#0047B0" /> Descarga
        </button>
        <button type="button" onClick={() => setCompOpen(true)} className="inline-flex items-center gap-2 rounded-lg border-[1.5px] border-border-strong bg-white px-3 py-[7px] text-xs font-semibold text-foreground hover:bg-[#F4F7FE]">
          Comparar
          {activeComparisonKeys(comparisons).length > 0 && (
            <span className="flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">{activeComparisonKeys(comparisons).length}</span>
          )}
        </button>
      </div>

      <RealesTable
        rows={[{ ...n7, parentCodigo: n4.codigo, parentNombre: n4.nombre }]}
        mode="n7"
        currency="USD"
        comparisons={activeComparisonKeys(comparisons)}
        itemLabel="PEP N7"
        showFooter={false}
      />

      <RealesComparisonDrawer open={compOpen} onClose={() => setCompOpen(false)} comparisons={comparisons} onChange={setComparisons} />
    </div>
  )
}
