import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Breadcrumb, EmptyState, PageHeader, VolverBar } from '@/shared/ui'
import { FORECAST_MES_ACTUAL } from '@/data/forecast'
import { useForecastStore } from './lib/use-forecast-store'
import { buildFlatN7Rows } from './lib/forecast-flat-n7'
import { buildForecastSubPepRows } from './lib/forecast-subpep'
import { EMPTY_COLAPSO } from './lib/use-forecast-colapso'
import { ForecastN7FlatTable } from './components/forecast-n7-flat-table'

const SIN_COMPARATIVA = { plan: false, forecastRoundId: null }

/** F: "en esa pantalla o nivel se deben mostrar los subpep del servicio, copia la misma tabla de N7 que
 * está actualmente" — reusa ForecastN7FlatTable con filas sintéticas (ver forecast-subpep.ts), de solo
 * lectura: un SubPEP es una vista derivada del monto del N7 padre, no una línea de forecast propia. */
export function ForecastSubPepPage() {
  const { id, n4Codigo, n7Codigo } = useParams()
  const navigate = useNavigate()
  const { rounds } = useForecastStore()
  const round = rounds.find((r) => r.id === id)

  const flatRow = useMemo(() => {
    if (!round) return undefined
    return buildFlatN7Rows(round.lineas).find((r) => r.n4Codigo === n4Codigo && r.n7.n7Codigo === n7Codigo)
  }, [round, n4Codigo, n7Codigo])

  const subRows = useMemo(() => (flatRow ? buildForecastSubPepRows(flatRow) : []), [flatRow])

  if (!round || !flatRow) {
    return (
      <div className="mx-8 my-8">
        <EmptyState icon="search" title="PEP N7 no encontrado" text="No existe un PEP N7 con ese código en este forecast." />
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto">
        <Breadcrumb
          items={[
            { label: 'SIP', to: '/' },
            { label: 'Forecast', to: '/forecast' },
            { label: round.titulo, to: `/forecast/${round.id}` },
            { label: `SubPEPs — ${flatRow.n7.n7Nombre}` },
          ]}
        />
        <PageHeader title={`SubPEPs — ${flatRow.n7.n7Nombre}`} subtitle={`${flatRow.n7.n7Codigo} · ${flatRow.n4Nombre}`} />

        <ForecastN7FlatTable
          roundId={round.id}
          rows={subRows}
          cutoff={FORECAST_MES_ACTUAL}
          desvioMaximo={round.desvio}
          readOnly
          linkToDetalle={false}
          showSubPepCol={false}
          comparativa={SIN_COMPARATIVA}
          anteriorRound={undefined}
          colapso={EMPTY_COLAPSO}
        />
      </div>
      <VolverBar label="Volver al Forecast" onBack={() => navigate(`/forecast/${round.id}`)} />
    </div>
  )
}
