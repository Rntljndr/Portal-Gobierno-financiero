import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Badge, Breadcrumb, Button, EmptyState, Icon } from '@/shared/ui'
import { realesRows } from '@/data/reales'
import { calcTotals } from './lib/reales-calc'
import { downloadRealesCsv } from './lib/download-csv'
import { EMPTY_COMPARISONS, activeComparisonKeys } from './lib/comparisons'
import { RealesComparisonDrawer } from './components/reales-comparison-drawer'
import { CompararButton } from './components/comparar-button'
import { RealesFilterToggle } from './components/reales-filters'
import { RealesDetailHeader } from './components/reales-detail-header'
import { RealesKpis } from './components/reales-kpis'
import { RealesTable } from './components/reales-table'

export function RealesSubPepPage() {
  const { codigo, n7codigo } = useParams()
  const navigate = useNavigate()
  const n4 = realesRows.find((r) => r.codigo === codigo)
  const n7 = n4?.children.find((c) => c.codigo === n7codigo)

  const [filtersOpen, setFiltersOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [comparisons, setComparisons] = useState(EMPTY_COMPARISONS)
  const [compOpen, setCompOpen] = useState(false)

  const rows = useMemo(() => {
    if (!n7) return []
    if (!search) return [n7]
    const q = search.toLowerCase()
    return n7.nombre.toLowerCase().includes(q) || n7.codigo.toLowerCase().includes(q) ? [n7] : []
  }, [n7, search])

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

      <div className="mx-8 mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <RealesFilterToggle open={filtersOpen} onToggle={() => setFiltersOpen((v) => !v)} activeCount={search ? 1 : 0} />
          <Badge variant="neutral" className="border border-[#DDD0F8] bg-[#F3EEFF] text-[#6922E7]">
            <Icon name="trendup" size={12} color="currentColor" />
            Forecast Agosto 2026
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => downloadRealesCsv([n7], `Reales_N7_${n7.codigo}.csv`)}>
            <Icon name="download" size={12} color="#0047B0" /> Descargar
          </Button>
          <CompararButton count={activeComparisonKeys(comparisons).length} onClick={() => setCompOpen(true)} />
        </div>
      </div>

      {filtersOpen && <SubPepSearchPanel search={search} onSearchChange={setSearch} />}

      <RealesTable
        rows={rows.map((r) => ({ ...r, parentCodigo: n4.codigo, parentNombre: n4.nombre }))}
        mode="n7"
        currency="USD"
        comparisons={activeComparisonKeys(comparisons)}
        itemLabel="PEP N7"
        showFooter={false}
      />

      <RealesComparisonDrawer open={compOpen} onClose={() => setCompOpen(false)} applied={comparisons} onApply={setComparisons} />
    </div>
  )
}

function SubPepSearchPanel({ search, onSearchChange }: { search: string; onSearchChange: (v: string) => void }) {
  return (
    <div className="mx-8 mb-4 rounded-xl border border-border bg-white p-4.5 shadow-[0_4px_16px_rgba(6,20,60,0.06)]">
      <label className="mb-1 block text-[11px] font-bold tracking-[0.04em] text-muted-foreground uppercase">Nombre / código PEP N7</label>
      <div className="flex h-9 w-full max-w-sm items-center gap-2 rounded-lg border border-border bg-white px-3">
        <Icon name="search" size={14} color="#8A90A2" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar..."
          className="h-full flex-1 bg-transparent text-[12.5px] outline-none placeholder:text-muted-foreground"
        />
      </div>
    </div>
  )
}
