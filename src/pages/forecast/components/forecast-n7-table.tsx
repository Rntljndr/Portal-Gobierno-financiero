import { Fragment, useMemo } from 'react'
import { EmptyState } from '@/shared/ui'
import type { ForecastRound } from '@/data/forecast'
import type { ForecastMesNota, ForecastN7Linea } from '@/data/forecast-lineas'
import { calcLlavePlanPct, calcN7Totals, findPlanN7 } from '../lib/forecast-edit-calc'
import { findN7EnRound } from '../lib/forecast-comparativa'
import { n7Identidad, forecastIdentitySortValue } from '../lib/forecast-identidad'
import type { ForecastTablaComparativa } from '../lib/forecast-tabla-comparativa'
import { forecastIdentityDefaultVisible } from '../lib/forecast-identity-cols'
import { sortForecastRows, useForecastSort } from '../lib/forecast-sort'
import { ForecastTableHeader } from './forecast-table-header'
import { ForecastN7TableRow } from './forecast-n7-table-row'
import { ForecastComparativaRows } from './forecast-comparativa-rows'

interface ForecastN7TableProps {
  roundId: string
  n4Codigo: string
  rows: ForecastN7Linea[]
  cutoff: number
  /** Notas del N4 padre — indicador de desvío por N7 (M5). */
  n4Notas: Record<string, ForecastMesNota>
  /** % de desvío máximo configurado del forecast (M5). */
  desvioMaximo: number
  onEditarN7?: (n7: ForecastN7Linea) => void
  onResetLlave?: (n7Codigo: string) => void
  /** Forecast anterior (F): todas las celdas quedan bloqueadas y se ocultan las acciones de edición. */
  readOnly?: boolean
  /** M7: selección múltiple para las acciones masivas — resultado directo de useForecastSeleccion, se
   * ofrece en todo forecast editable (ver ForecastEditarN7Page). */
  seleccion?: { seleccion: Set<string>; toggle: (n7Codigo: string) => void; allSelected: boolean; indeterminate: boolean; toggleAll: () => void }
  /** Filas de comparación bajo cada PEP N7 (botón "Comparar" del header) — Plan y/o un forecast anterior. */
  comparativa: ForecastTablaComparativa
  anteriorRound: ForecastRound | undefined
  /** "Contraer todo"/"Expandir todo" (mismo patrón que Reales) — colapsa las filas de comparación por línea. */
  colapso: { collapsed: Set<string>; toggle: (key: string) => void }
  /** Columnas de identidad visibles (botón "Columnas") — todas por defecto si no se pasa. */
  visibleCols?: string[]
}

interface RowGroupProps {
  roundId: string
  n4Codigo: string
  n7: ForecastN7Linea
  siblings: ForecastN7Linea[]
  cutoff: number
  n4Notas: Record<string, ForecastMesNota>
  desvioMaximo: number
  onEditarN7?: (n7: ForecastN7Linea) => void
  onResetLlave?: (n7Codigo: string) => void
  readOnly: boolean
  seleccion?: ForecastN7TableProps['seleccion']
  comparativa: ForecastTablaComparativa
  anteriorRound: ForecastRound | undefined
  colapso: ForecastN7TableProps['colapso']
  cols: string[]
}

/** Fila del PEP N7 + sus filas de comparación (Plan/Forecast anterior) — extraída para mantener
 * ForecastN7Table bajo el límite de líneas del linter. */
function RowGroup({ roundId, n4Codigo, n7, siblings, cutoff, n4Notas, desvioMaximo, onEditarN7, onResetLlave, readOnly, seleccion, comparativa, anteriorRound, colapso, cols }: RowGroupProps) {
  const anteriorN7 = anteriorRound && findN7EnRound(anteriorRound, n4Codigo, n7.n7Codigo)
  const hasComparativa = comparativa.plan || !!anteriorN7
  const colapsado = hasComparativa && colapso.collapsed.has(n7.n7Codigo)
  const llaveColIndex = cols.indexOf('llave')

  return (
    <Fragment>
      <ForecastN7TableRow
        roundId={roundId}
        n4Codigo={n4Codigo}
        n7={n7}
        siblings={siblings}
        cutoff={cutoff}
        n4Notas={n4Notas}
        desvioMaximo={desvioMaximo}
        onEditarN7={onEditarN7}
        onResetLlave={onResetLlave}
        readOnly={readOnly}
        seleccion={
          seleccion && {
            checked: seleccion.seleccion.has(n7.n7Codigo),
            onToggle: () => seleccion.toggle(n7.n7Codigo),
            disabled: n7.envioEstado === 'Validado por Control de Gestión',
          }
        }
        colapso={hasComparativa ? { colapsado, onToggle: () => colapso.toggle(n7.n7Codigo) } : undefined}
        visibleCols={cols}
      />
      <ForecastComparativaRows
        comparativa={comparativa}
        variant="n7"
        cutoff={cutoff}
        totals={calcN7Totals(n4Codigo, n7, cutoff)}
        planMeses={findPlanN7(n4Codigo, n7.n7Codigo)}
        anteriorMeses={anteriorN7?.meses}
        anteriorTotals={anteriorN7 ? calcN7Totals(n4Codigo, anteriorN7, cutoff) : undefined}
        anteriorTitulo={anteriorRound?.titulo}
        identityExtra={llaveColIndex >= 0 ? { colIndex: llaveColIndex, content: `${calcLlavePlanPct(n4Codigo, n7.n7Codigo).toFixed(1)}%` } : undefined}
        hasCheckboxCol={!!seleccion}
        identityColCount={cols.length}
        colapsado={colapsado}
      />
    </Fragment>
  )
}

export function ForecastN7Table({ roundId, n4Codigo, rows, cutoff, n4Notas, desvioMaximo, onEditarN7, onResetLlave, readOnly = false, seleccion, comparativa, anteriorRound, colapso, visibleCols }: ForecastN7TableProps) {
  const { col, dir, onSort } = useForecastSort(n4Codigo)
  const cols = visibleCols ?? forecastIdentityDefaultVisible('n7')
  const sortedRows = useMemo(() => {
    const valueOf = (n7: ForecastN7Linea, c: string): string | number => (c === 'nombre' ? n7.n7Nombre : forecastIdentitySortValue(n7Identidad(n4Codigo, n7, rows, cutoff), c))
    return sortForecastRows(rows, col, dir, valueOf)
  }, [rows, col, dir, n4Codigo, cutoff])

  if (rows.length === 0) {
    return (
      <div className="mx-8 mb-6">
        <EmptyState icon="search" title="Sin PEPs N7 para mostrar" text="Este servicio no tiene PEPs N7 asociados." />
      </div>
    )
  }

  return (
    <div className="mx-8 mb-6 overflow-x-auto rounded-xl border border-border shadow-[0_1px_4px_rgba(0,20,60,0.06)]">
      <table className="w-full border-collapse text-xs">
        <ForecastTableHeader
          cutoff={cutoff}
          identityLabel="PEP N7"
          variant="n7"
          sortCol={col}
          sortDir={dir}
          onSort={onSort}
          seleccionTodo={seleccion && { checked: seleccion.allSelected, indeterminate: seleccion.indeterminate, onToggle: seleccion.toggleAll }}
          visibleCols={visibleCols}
        />
        <tbody>
          {sortedRows.map((n7) => (
            <RowGroup
              key={n7.n7Codigo}
              roundId={roundId}
              n4Codigo={n4Codigo}
              n7={n7}
              siblings={rows}
              cutoff={cutoff}
              n4Notas={n4Notas}
              desvioMaximo={desvioMaximo}
              onEditarN7={onEditarN7}
              onResetLlave={onResetLlave}
              readOnly={readOnly}
              seleccion={seleccion}
              comparativa={comparativa}
              anteriorRound={anteriorRound}
              colapso={colapso}
              cols={cols}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}
