import { useMemo } from 'react'
import { gerenciaEquipoData, rubroCuentaData } from '@/data/reporteria'
import { AnalysisHierCard } from './analysis-hier-card'
import { buildConsolidadoPorPais } from '../lib/consolidado-data'

export function ConsolidadoView() {
  const porPais = useMemo(() => buildConsolidadoPorPais(), [])

  return (
    <div className="mx-8 mb-7 flex flex-col gap-4">
      <AnalysisHierCard title="Vista País · Consolidado por División (USD)" groups={porPais} />
      <AnalysisHierCard title="Rubro / Cuenta Contable · Consolidado (USD)" groups={rubroCuentaData} />
      <AnalysisHierCard title="Gerencia / Equipo · Consolidado (USD)" groups={gerenciaEquipoData} />
    </div>
  )
}
