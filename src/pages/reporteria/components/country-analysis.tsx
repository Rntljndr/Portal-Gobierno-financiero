import { divisionData, gerenciaEquipoData, rubroCuentaData } from '@/data/reporteria'
import { AnalysisHierCard } from './analysis-hier-card'

export function CountryAnalysis({ country }: { country: string }) {
  const divisionForCountry = divisionData
    .map((g) => ({ nombre: g.nombre, children: g.children.filter((c) => c.nombre.startsWith(country)) }))
    .filter((g) => g.children.length > 0)

  return (
    <div className="mx-8 mb-7 flex flex-col gap-4">
      {divisionForCountry.length > 0 && <AnalysisHierCard title={`Vista País · ${country}`} groups={divisionForCountry} />}
      <AnalysisHierCard title={`Rubro / Cuenta Contable · ${country}`} groups={rubroCuentaData} />
      <AnalysisHierCard title={`Gerencia / Equipo · ${country}`} groups={gerenciaEquipoData} />
    </div>
  )
}
