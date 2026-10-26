import { useMemo, useState, type ReactNode } from 'react'
import { Breadcrumb, Icon, PageHeader, SegmentedTabs } from '@/shared/ui'
import { servicios, type Pais } from '@/data/services'
import { currencyViews, type CurrencyView } from '@/data/reporteria'
import { useBreadcrumbFrom } from '@/shared/lib/breadcrumb-origin'
import { ConsolidadoFiltersBar } from './components/consolidado-filters'
import { ConsolidadoKpiStrip } from './components/consolidado-kpi-strip'
import { ConsolidadoRubroCards } from './components/consolidado-rubro-cards'
import { ConsolidadoDetailCard } from './components/consolidado-detail-card'
import { ConsolidadoCriterios } from './components/consolidado-criterios'
import { PaisMonedaSelector } from '@/features/pais-moneda-selector'
import { ConsolidadoSelectPaisEmpty } from './components/consolidado-select-pais-empty'
import { useConsolidadoFilters } from './lib/use-consolidado-filters'
import { filterServicios } from './lib/filter-servicios'
import { requierePaisUnico } from './lib/vista-amounts'

const BREADCRUMB_TRAILS: Record<'default' | 'reportes', { label: string; to?: string }[]> = {
  default: [{ label: 'SIP', to: '/' }, { label: 'Presupuesto', to: '/ejercicios' }, { label: 'Tecnología' }],
  reportes: [{ label: 'SIP', to: '/' }, { label: 'Reportes', to: '/reportes' }, { label: 'Tecnología' }],
}

const TRAIL_PLAN = [{ label: 'SIP', to: '/' }, { label: 'Reporte de plan' }]

/** `selector`: dentro del Reporte de plan, las tarjetas para cambiar de reporte (el encabezado pasa a ser el del plan). */
export function ConsolidadoPage({ selector }: { selector?: ReactNode } = {}) {
  const breadcrumbFrom = useBreadcrumbFrom()
  const [vista, setVista] = useState<CurrencyView>('dolar')
  const [paisMoneda, setPaisMoneda] = useState<Pais | null>(null)
  const { filters, onChange } = useConsolidadoFilters()

  const filtrados = useMemo(() => filterServicios(servicios, filters), [filters])
  const necesitaPais = requierePaisUnico(vista)
  const listoParaMostrar = !necesitaPais || !!paisMoneda

  const cambiarVista = (v: CurrencyView) => {
    setVista(v)
    setPaisMoneda(null)
  }

  return (
    <div className="h-full overflow-y-auto">
      <Breadcrumb items={selector ? TRAIL_PLAN : BREADCRUMB_TRAILS[breadcrumbFrom === 'reportes' ? 'reportes' : 'default']} />
      <PageHeader
        title={selector ? 'Reporte de plan' : 'Reporte Tecnología Cencosud'}
        subtitle={selector ? undefined : 'Propuesta de plan, composición del gasto y distribución regional.'}
        action={
          <div className="flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-3">
              <div className="text-[12.5px] font-semibold text-primary">Ver montos por</div>
              <SegmentedTabs value={vista} onChange={cambiarVista} options={currencyViews.map((v) => ({ value: v.id, label: v.label }))} />
            </div>
            {necesitaPais && <PaisMonedaSelector vista={vista} value={paisMoneda} onChange={setPaisMoneda} />}
            {necesitaPais && !paisMoneda && (
              <span className="inline-flex items-center gap-1 text-[11.5px] text-muted-foreground">
                <Icon name="info" size={12} color="#8A90A2" /> Selecciona un {vista === 'origen' ? 'país origen' : 'país destino'}.
              </span>
            )}
            {necesitaPais && paisMoneda && (
              <button type="button" onClick={() => cambiarVista('dolar')} className="text-[12px] font-semibold text-primary hover:underline">
                Volver a Total Cencosud
              </button>
            )}
          </div>
        }
      />
      {selector && <div className="mx-8 mb-6">{selector}</div>}

      <ConsolidadoFiltersBar
        filters={filters}
        onChange={onChange}
        hidePaisOrigen={vista === 'origen' && !!paisMoneda}
        hidePaisDestino={vista === 'destino' && !!paisMoneda}
        paisMonedaChip={necesitaPais && paisMoneda ? { label: vista === 'origen' ? 'País origen' : 'País destino', value: paisMoneda } : null}
        onClearPaisMoneda={() => setPaisMoneda(null)}
      />

      {listoParaMostrar ? (
        <>
          <ConsolidadoKpiStrip servicios={filtrados} vista={vista} paisMoneda={paisMoneda} />
          <div className="mx-8 mb-7 flex flex-col gap-6">
            <ConsolidadoRubroCards servicios={filtrados} vista={vista} paisMoneda={paisMoneda} />
            <ConsolidadoDetailCard servicios={filtrados} vista={vista} paisMoneda={paisMoneda} />
          </div>
        </>
      ) : (
        <ConsolidadoSelectPaisEmpty vista={vista} />
      )}

      <ConsolidadoCriterios />
    </div>
  )
}
