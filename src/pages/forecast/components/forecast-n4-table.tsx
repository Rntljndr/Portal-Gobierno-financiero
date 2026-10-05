import { Fragment, useMemo } from 'react'
import { EmptyState } from '@/shared/ui'
import type { ForecastRound } from '@/data/forecast'
import type { ForecastN4Linea } from '@/data/forecast-lineas'
import { calcN4Meses, calcN4Totals, findPlanN4 } from '../lib/forecast-edit-calc'
import { findN4EnRound } from '../lib/forecast-comparativa'
import { n4Identidad, forecastIdentitySortValue } from '../lib/forecast-identidad'
import type { ForecastTablaComparativa } from '../lib/forecast-tabla-comparativa'
import { sortForecastRows, useForecastSort } from '../lib/forecast-sort'
import { ForecastTableHeader } from './forecast-table-header'
import { ForecastN4TableRow } from './forecast-n4-table-row'
import { ForecastComparativaRows } from './forecast-comparativa-rows'

interface ForecastN4TableProps {
  roundId: string
  rows: ForecastN4Linea[]
  cutoff: number
  /** F: "se debe agregar una columna con el botón de editar" — abre la asignación anualizada
   * (ForecastEditarMontosModal) para ese N4. */
  onEditar?: (n4: ForecastN4Linea) => void
  readOnly?: boolean
  /** M7: selección múltiple de N4 para la barra de acciones masivas — resultado directo de
   * useForecastSeleccion, se ofrece en todo forecast editable (ver ForecastListBody). */
  seleccion?: { seleccion: Set<string>; toggle: (n4Codigo: string) => void; allSelected: boolean; indeterminate: boolean; toggleAll: () => void }
  /** Filas de comparación bajo cada N4 (botón "Comparar" del header) — Plan y/o un forecast anterior. */
  comparativa: ForecastTablaComparativa
  anteriorRound: ForecastRound | undefined
  /** "Contraer todo"/"Expandir todo" (mismo patrón que Reales) — colapsa las filas de comparación por línea. */
  colapso: { collapsed: Set<string>; toggle: (key: string) => void }
  /** Columnas de identidad visibles (botón "Columnas") — todas por defecto si no se pasa. */
  visibleCols?: string[]
}

interface RowGroupProps {
  roundId: string
  n4: ForecastN4Linea
  cutoff: number
  onEditar?: ForecastN4TableProps['onEditar']
  readOnly: boolean
  seleccion?: ForecastN4TableProps['seleccion']
  comparativa: ForecastTablaComparativa
  anteriorRound: ForecastRound | undefined
  colapso: ForecastN4TableProps['colapso']
  visibleCols?: string[]
}

/** Fila del N4 + sus filas de comparación (Plan/Forecast anterior) — extraída para mantener
 * ForecastN4Table bajo el límite de líneas del linter. */
function RowGroup({ roundId, n4, cutoff, onEditar, readOnly, seleccion, comparativa, anteriorRound, colapso, visibleCols }: RowGroupProps) {
  const anteriorN4 = anteriorRound && findN4EnRound(anteriorRound, n4.n4Codigo)
  const hasComparativa = comparativa.plan || !!anteriorN4
  const colapsado = hasComparativa && colapso.collapsed.has(n4.n4Codigo)

  return (
    <Fragment>
      <ForecastN4TableRow
        roundId={roundId}
        n4={n4}
        cutoff={cutoff}
        onEditar={onEditar}
        readOnly={readOnly}
        seleccion={
          seleccion && {
            checked: seleccion.seleccion.has(n4.n4Codigo),
            onToggle: () => seleccion.toggle(n4.n4Codigo),
            disabled: n4.envioEstado === 'Validado por Control de Gestión',
          }
        }
        colapso={hasComparativa ? { colapsado, onToggle: () => colapso.toggle(n4.n4Codigo) } : undefined}
        visibleCols={visibleCols}
      />
      <ForecastComparativaRows
        comparativa={comparativa}
        variant="n4"
        cutoff={cutoff}
        totals={calcN4Totals(n4, cutoff)}
        planMeses={findPlanN4(n4.n4Codigo)}
        anteriorMeses={anteriorN4 ? calcN4Meses(anteriorN4) : undefined}
        anteriorTotals={anteriorN4 ? calcN4Totals(anteriorN4, cutoff) : undefined}
        anteriorTitulo={anteriorRound?.titulo}
        hasCheckboxCol={!!seleccion}
        identityColCount={visibleCols?.length}
        colapsado={colapsado}
      />
    </Fragment>
  )
}

export function ForecastN4Table({ roundId, rows, cutoff, onEditar, readOnly = false, seleccion, comparativa, anteriorRound, colapso, visibleCols }: ForecastN4TableProps) {
  const { col, dir, onSort } = useForecastSort(roundId)
  const sortedRows = useMemo(() => {
    const valueOf = (n4: ForecastN4Linea, c: string): string | number => (c === 'nombre' ? n4.n4Nombre : forecastIdentitySortValue(n4Identidad(n4), c))
    return sortForecastRows(rows, col, dir, valueOf)
  }, [rows, col, dir])

  if (rows.length === 0) {
    return (
      <div className="mx-8 mb-6">
        <EmptyState icon="search" title="Sin servicios para mostrar" text="Este forecast no tiene PEPs N4 habilitados." />
      </div>
    )
  }

  return (
    <div className="mx-8 mb-6 overflow-x-auto rounded-xl border border-border shadow-[0_1px_4px_rgba(0,20,60,0.06)]">
      <table className="w-full border-collapse text-xs">
        <ForecastTableHeader
          cutoff={cutoff}
          identityLabel="Servicio N4"
          variant="n4"
          sortCol={col}
          sortDir={dir}
          onSort={onSort}
          seleccionTodo={seleccion && { checked: seleccion.allSelected, indeterminate: seleccion.indeterminate, onToggle: seleccion.toggleAll }}
          visibleCols={visibleCols}
        />
        <tbody>
          {sortedRows.map((n4) => (
            <RowGroup
              key={n4.n4Codigo}
              roundId={roundId}
              n4={n4}
              cutoff={cutoff}
              onEditar={onEditar}
              readOnly={readOnly}
              seleccion={seleccion}
              comparativa={comparativa}
              anteriorRound={anteriorRound}
              colapso={colapso}
              visibleCols={visibleCols}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}
