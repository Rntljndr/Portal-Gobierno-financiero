import { useMemo, useState } from 'react'
import { Breadcrumb, PageHeader, SegmentedTabs, type VistaNumero } from '@/shared/ui'
import { currencyViews, type CurrencyView } from '@/data/reporteria'
import { useBreadcrumbFrom } from '@/shared/lib/breadcrumb-origin'
import { DireccionFiltersPanel } from './components/direccion-filters-panel'
import { DireccionCountrySummary } from './components/direccion-country-summary'
import { DireccionKpiRow } from './components/direccion-kpi-row'
import { DireccionTable } from './components/direccion-table'
import { useDireccionFilters } from './lib/use-direccion-filters'
import { filterDireccionTree, buildCountrySummaryTree, sumLeaves } from './lib/filter-tree'

const BREADCRUMB_TRAILS: Record<'default' | 'reportes', { label: string; to?: string }[]> = {
  default: [
    { label: 'SIP', to: '/' },
    { label: 'Presupuesto', to: '/ejercicios' },
    { label: 'Ejercicios', to: '/ejercicios' },
    { label: 'Reporte de dirección' },
  ],
  reportes: [{ label: 'SIP', to: '/' }, { label: 'Reportes', to: '/reportes' }, { label: 'Reporte de dirección' }],
}

export function ReporteDireccionPage() {
  const breadcrumbFrom = useBreadcrumbFrom()
  const { filters, onChange, activeCount } = useDireccionFilters()
  const [vista, setVista] = useState<CurrencyView>('dolar')
  const [vistaNumero, setVistaNumero] = useState<VistaNumero>('nominal')

  // El filtro de País (multi-select, en el panel de filtros) es la única forma de acotar por país —
  // en Destino ML no hace falta elegir uno solo: cada país ya se muestra en su propia moneda local,
  // sin necesidad de convertir ni de consolidar en una moneda común.
  const paisesActivos = filters.pais.length > 0 ? filters.pais : null

  const summaryTree = useMemo(() => buildCountrySummaryTree(filters), [filters])
  const tree = useMemo(() => filterDireccionTree(filters), [filters])
  const totals = useMemo(() => sumLeaves('Total Cencosud', tree), [tree])

  return (
    <div className="h-full overflow-y-auto">
      <Breadcrumb items={BREADCRUMB_TRAILS[breadcrumbFrom === 'reportes' ? 'reportes' : 'default']} />
      <PageHeader
        title="Reporte de dirección"
        subtitle="Consolidado ejecutivo por país, división y bandera"
        action={
          <div className="flex items-center gap-3">
            <div className="text-[12.5px] font-semibold text-primary">Ver montos por</div>
            <SegmentedTabs
              value={vista}
              onChange={setVista}
              options={currencyViews.filter((v) => v.id !== 'origen').map((v) => ({ value: v.id, label: v.label }))}
            />
          </div>
        }
      />
      <DireccionFiltersPanel filters={filters} onChange={onChange} activeCount={activeCount} />
      <DireccionCountrySummary
        tree={summaryTree}
        vista={vista}
        vistaNumero={vistaNumero}
        onVistaNumeroChange={setVistaNumero}
        paisesActivos={paisesActivos}
      />
      {vista !== 'destino' && <DireccionKpiRow totals={totals} vista={vista} vistaNumero={vistaNumero} />}
      <DireccionTable tree={tree} totals={totals} vista={vista} vistaNumero={vistaNumero} />
    </div>
  )
}
