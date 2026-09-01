import { useMemo, useState } from 'react'
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

export function RealesN7Page() {
  const { codigo } = useParams()
  const navigate = useNavigate()
  const n4 = realesRows.find((r) => r.codigo === codigo)

  const [search, setSearch] = useState('')
  const [comparisons, setComparisons] = useState(EMPTY_COMPARISONS)
  const [compOpen, setCompOpen] = useState(false)

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
    <div className="h-full overflow-y-auto">
      <Breadcrumb
        items={[
          { label: 'SIP', to: '/' },
          { label: 'Presupuesto', to: '/ejercicios' },
          { label: 'Ejercicios', to: '/ejercicios' },
          { label: 'Reales', to: '/reales' },
          { label: n4.nombre },
        ]}
      />
      <RealesDetailHeader title={n4.nombre} codigo={n4.codigo} backLabel="Volver a N4" onBack={() => navigate('/reales')} />
      <RealesKpis totals={calcTotals(n4)} currency="USD" />

      <div className="mx-8 mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex h-9 w-72 items-center gap-2 rounded-lg border border-border bg-white px-3">
          <Icon name="search" size={14} color="#8A90A2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar nombre o código PEP N7..."
            className="h-full flex-1 bg-transparent text-[12.5px] outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => downloadRealesCsv(n4.children, `Reales_N7_${n4.codigo}.csv`)} className="inline-flex items-center gap-1.5 rounded-lg border border-border-strong bg-white px-3 py-[7px] text-xs font-semibold text-primary hover:bg-[#F4F7FE]">
            <Icon name="download" size={12} color="#0047B0" /> Descarga
          </button>
          <button type="button" onClick={() => setCompOpen(true)} className="inline-flex items-center gap-2 rounded-lg border-[1.5px] border-border-strong bg-white px-3 py-[7px] text-xs font-semibold text-foreground hover:bg-[#F4F7FE]">
            Comparar
            {activeComparisonKeys(comparisons).length > 0 && (
              <span className="flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">{activeComparisonKeys(comparisons).length}</span>
            )}
          </button>
        </div>
      </div>

      <RealesTable
        rows={children.map((c) => ({ ...c, parentCodigo: n4.codigo, parentNombre: n4.nombre }))}
        mode="n7"
        currency="USD"
        comparisons={activeComparisonKeys(comparisons)}
        itemLabel="PEPs N7"
        onRowClick={(row) => navigate(`/reales/${encodeURIComponent(n4.codigo)}/${encodeURIComponent(row.codigo)}`)}
      />

      <RealesComparisonDrawer open={compOpen} onClose={() => setCompOpen(false)} comparisons={comparisons} onChange={setComparisons} />
    </div>
  )
}
