import { divisionData, gerenciaEquipoData, rubroCuentaData, type MetricMode } from '@/data/reporteria'
import { AnalysisHierCard } from './analysis-hier-card'
import { Top5Card } from './top5-card'
import { PlanForecastChart } from './plan-forecast-chart'
import type { ScrollTarget } from '../lib/scroll-target'

interface CountryAnalysisProps {
  country: string
  metricMode: MetricMode
  selMonths: Record<string, boolean>
  scrollTarget: ScrollTarget | null
  onItemClick: (item: ScrollTarget) => void
}

export function CountryAnalysis({ country, metricMode, selMonths, scrollTarget, onItemClick }: CountryAnalysisProps) {
  const divisionForCountry = divisionData
    .map((g) => ({ nombre: g.nombre, children: g.children.filter((c) => c.nombre.startsWith(country)) }))
    .filter((g) => g.children.length > 0)
  const gerenciaForCountry = gerenciaEquipoData
    .map((g) => ({ nombre: g.nombre, children: g.children.filter((c) => !c.pais || c.pais === country) }))
    .filter((g) => g.children.length > 0)

  if (divisionForCountry.length === 0 && gerenciaForCountry.length === 0) {
    return <EmptyCountryState country={country} />
  }

  return (
    <div className="mx-8 mb-7 flex flex-col gap-4">
      {divisionForCountry.length > 0 && (
        <AnalysisHierCard title={`Vista País · ${country}`} groups={divisionForCountry} metricMode={metricMode} highlightTarget={scrollTarget} />
      )}
      <AnalysisHierCard title={`Rubro / Cuenta Contable · ${country}`} groups={rubroCuentaData} metricMode={metricMode} highlightTarget={scrollTarget} />
      {gerenciaForCountry.length > 0 && (
        <AnalysisHierCard title={`Gerencia / Equipo · ${country}`} groups={gerenciaForCountry} metricMode={metricMode} highlightTarget={scrollTarget} />
      )}
      <div className="grid grid-cols-2 items-stretch gap-4">
        <PlanForecastChart title={`Plan vs Forecast · ${country}`} selMonths={selMonths} />
        <Top5Card groups={gerenciaForCountry.length > 0 ? gerenciaForCountry : gerenciaEquipoData} onItemClick={onItemClick} />
      </div>
    </div>
  )
}

function EmptyCountryState({ country }: { country: string }) {
  return (
    <div className="mx-8 mb-7 flex flex-col items-center justify-center rounded-2xl border border-border bg-white p-[60px_32px] text-center">
      <Icon />
      <div className="mb-2 text-base font-medium text-foreground">Sin datos para este país con los filtros aplicados</div>
      <div className="max-w-[420px] text-sm leading-relaxed text-muted-foreground">
        Los filtros seleccionados no incluyen información disponible para {country}. Intentá ajustar los filtros de País Origen, País Destino o Período para ver resultados.
      </div>
    </div>
  )
}

function Icon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--fg-muted,#94A3B8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-50">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  )
}
