import { useMemo, useState } from 'react'
import { Breadcrumb, Icon, PageHeader, SegmentedTabs, type VistaNumero } from '@/shared/ui'
import { currencyViews, requierePaisUnico, type CurrencyView } from '@/data/reporteria'
import type { Pais } from '@/data/services'
import { useBreadcrumbFrom } from '@/shared/lib/breadcrumb-origin'
import { PaisMonedaSelector } from '@/features/pais-moneda-selector'
import { DireccionFiltersPanel } from './components/direccion-filters-panel'
import { DireccionCountrySummary } from './components/direccion-country-summary'
import { DireccionKpiRow } from './components/direccion-kpi-row'
import { DireccionTable } from './components/direccion-table'
import { DireccionSelectPaisEmpty } from './components/direccion-select-pais-empty'
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

  const necesitaPais = requierePaisUnico(vista)
  const cambiarVista = (v: CurrencyView) => setVista(v)
  const volverATotalCencosud = () => {
    setVista('dolar')
    onChange('pais', [])
  }

  // El selector de "Ver montos por" y el filtro de País son el mismo campo: seleccionar un país en
  // cualquiera de los dos lugares deja el otro con la misma selección. En Destino ML se exige uno
  // solo (moneda común); en Destino USD el filtro admite varios países a la vez.
  const paisUnico: Pais | null = filters.pais.length === 1 ? (filters.pais[0] as Pais) : null
  const paisesActivos = filters.pais.length > 0 ? filters.pais : null
  const bloqueadoPorPais = necesitaPais && !paisUnico

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
          <div className="flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-3">
              <div className="text-[12.5px] font-semibold text-primary">Ver montos por</div>
              <SegmentedTabs
                value={vista}
                onChange={cambiarVista}
                options={currencyViews.filter((v) => v.id !== 'origen').map((v) => ({ value: v.id, label: v.label }))}
              />
            </div>
            {necesitaPais && (
              <PaisMonedaSelector vista={vista} value={paisUnico} onChange={(p) => onChange('pais', p ? [p] : [])} />
            )}
            {necesitaPais && !paisUnico && (
              <span className="inline-flex items-center gap-1 text-[11.5px] text-muted-foreground">
                <Icon name="info" size={12} color="#8A90A2" /> Selecciona un país destino.
              </span>
            )}
            {necesitaPais && paisUnico && (
              <button type="button" onClick={volverATotalCencosud} className="text-[12px] font-semibold text-primary hover:underline">
                Volver a Total Cencosud
              </button>
            )}
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
      {bloqueadoPorPais ? (
        <DireccionSelectPaisEmpty vista={vista} />
      ) : (
        <>
          <DireccionKpiRow totals={totals} vista={vista} vistaNumero={vistaNumero} />
          <DireccionTable tree={tree} totals={totals} vista={vista} vistaNumero={vistaNumero} />
        </>
      )}
    </div>
  )
}
