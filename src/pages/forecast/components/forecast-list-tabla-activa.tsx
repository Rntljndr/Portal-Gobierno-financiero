import { useNavigate } from 'react-router'
import { EmptyState } from '@/shared/ui'
import type { ForecastRound } from '@/data/forecast'
import type { ForecastN4Linea, ForecastN7Linea } from '@/data/forecast-lineas'
import type { useForecastEditarN4 } from '../lib/use-forecast-editar-n4'
import type { useForecastFilters } from '../lib/use-forecast-filters'
import type { useForecastListSeleccion } from '../lib/use-forecast-seleccion'
import type { ForecastTablaComparativa } from '../lib/forecast-tabla-comparativa'
import { ForecastN4Table } from './forecast-n4-table'
import { ForecastN7FlatTable } from './forecast-n7-flat-table'

interface ForecastListTablaActivaProps {
  roundMostrado: ForecastRound | undefined
  tab: 'n4' | 'n7'
  tabla: ReturnType<typeof useForecastEditarN4>
  filtros: ReturnType<typeof useForecastFilters>
  readOnly: boolean
  seleccion: ReturnType<typeof useForecastListSeleccion>
  onEditarN7: (n4Codigo: string, n7: ForecastN7Linea) => void
  /** F: "a nivel 4... se debe agregar una columna con el botón de editar" — abre la asignación
   * anualizada (ForecastEditarMontosModal) para ese N4, igual componente que en ForecastEditarN7Page. */
  onEditarMontosN4: (n4: ForecastN4Linea) => void
  comparativa: ForecastTablaComparativa
  anteriorRound: ForecastRound | undefined
  colapso: { collapsed: Set<string>; toggle: (key: string) => void }
  visibleCols: string[]
}

/** Tabla N4 o N7 del tab activo, con su selección múltiple (M7) — extraído de ForecastListBody para
 * mantenerlo bajo el límite de líneas del linter. */
export function ForecastListTablaActiva({ roundMostrado, tab, tabla, filtros, readOnly, seleccion, onEditarN7, onEditarMontosN4, comparativa, anteriorRound, colapso, visibleCols }: ForecastListTablaActivaProps) {
  const navigate = useNavigate()

  if (!roundMostrado) {
    return (
      <div className="mx-8 mb-8">
        <EmptyState icon="search" title="No hay ningún forecast" text="Creá un forecast para ver y editar sus servicios acá." />
      </div>
    )
  }

  if (tab === 'n4') {
    return (
      <ForecastN4Table
        roundId={roundMostrado.id}
        rows={filtros.filteredN4}
        cutoff={tabla.cutoff}
        onEditar={readOnly ? undefined : onEditarMontosN4}
        readOnly={readOnly}
        seleccion={seleccion.mostrarSeleccionN4 ? seleccion.seleccionN4 : undefined}
        comparativa={comparativa}
        anteriorRound={anteriorRound}
        colapso={colapso}
        visibleCols={visibleCols}
      />
    )
  }

  return (
    <ForecastN7FlatTable
      roundId={roundMostrado.id}
      rows={filtros.filteredN7}
      cutoff={tabla.cutoff}
      desvioMaximo={roundMostrado.desvio}
      onEditarN7={readOnly ? undefined : onEditarN7}
      onVerSubPeps={(n4Codigo, n7) => navigate(`/forecast/${roundMostrado.id}/subpep/${encodeURIComponent(n4Codigo)}/${encodeURIComponent(n7.n7Codigo)}`)}
      readOnly={readOnly}
      seleccion={seleccion.mostrarSeleccionN7 ? seleccion.seleccionN7 : undefined}
      comparativa={comparativa}
      anteriorRound={anteriorRound}
      colapso={colapso}
      visibleCols={visibleCols}
    />
  )
}
