import { Fragment, useMemo } from 'react'
import { EmptyState } from '@/shared/ui'
import type { ForecastRound } from '@/data/forecast'
import { calcLlavePlanPct, calcN7Totals, findPlanN7 } from '../lib/forecast-edit-calc'
import { findN7EnRound } from '../lib/forecast-comparativa'
import { forecastN7Key } from '../lib/forecast-envio'
import { n7Identidad, forecastIdentitySortValue } from '../lib/forecast-identidad'
import type { ForecastTablaComparativa } from '../lib/forecast-tabla-comparativa'
import { forecastIdentityDefaultVisible } from '../lib/forecast-identity-cols'
import { sortForecastRows, useForecastSort } from '../lib/forecast-sort'
import type { ForecastFlatN7Row } from '../lib/forecast-flat-n7'
import type { ForecastN7Linea } from '@/data/forecast-lineas'
import { ForecastTableHeader } from './forecast-table-header'
import { ForecastN7FlatRow } from './forecast-n7-flat-row'
import { ForecastComparativaRows } from './forecast-comparativa-rows'

interface ForecastN7FlatTableProps {
  roundId: string
  rows: ForecastFlatN7Row[]
  cutoff: number
  /** % de desvío máximo configurado del forecast (M5). */
  desvioMaximo: number
  /** Forecast activo (A5): nombre o celda editable abren el drawer de edición completa del PEP N7. */
  onEditarN7?: (n4Codigo: string, n7: ForecastN7Linea) => void
  /** F: columna fija "SubPEP" con botón "Ver" (default true) — en false dentro de ForecastSubPepPage,
   * que reusa esta misma tabla para listar los SubPEPs (mismo patrón que RealesTable#showSubPepCol). */
  showSubPepCol?: boolean
  onVerSubPeps?: (n4Codigo: string, n7: ForecastN7Linea) => void
  /** Forecast anterior (F): el nombre de cada fila navega a ForecastN7DetallePage en solo lectura en
   * vez de abrir el drawer — las celdas de esta tabla ya son de solo lectura siempre, edite o no. */
  readOnly?: boolean
  /** Default true. En false (ForecastSubPepPage) el nombre queda como texto plano: un SubPEP es un
   * código sintético sin pantalla de detalle propia a la que navegar. */
  linkToDetalle?: boolean
  /** M7: selección múltiple de N7 para la barra de acciones masivas — resultado directo de
   * useForecastSeleccion, se ofrece en todo forecast editable (F: "misma funcionalidad que Forecast
   * N4", ver ForecastListBody). */
  seleccion?: { seleccion: Set<string>; toggle: (key: string) => void; allSelected: boolean; indeterminate: boolean; toggleAll: () => void }
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
  row: ForecastFlatN7Row
  cutoff: number
  desvioMaximo: number
  onEditarN7?: ForecastN7FlatTableProps['onEditarN7']
  showSubPepCol?: boolean
  onVerSubPeps?: ForecastN7FlatTableProps['onVerSubPeps']
  readOnly: boolean
  linkToDetalle?: boolean
  seleccion?: ForecastN7FlatTableProps['seleccion']
  comparativa: ForecastTablaComparativa
  anteriorRound: ForecastRound | undefined
  colapso: ForecastN7FlatTableProps['colapso']
  cols: string[]
}

/** Fila del PEP N7 + sus filas de comparación (Plan/Forecast anterior) — extraída para mantener
 * ForecastN7FlatTable bajo el límite de líneas del linter. */
function RowGroup({ roundId, row, cutoff, desvioMaximo, onEditarN7, showSubPepCol, onVerSubPeps, readOnly, linkToDetalle, seleccion, comparativa, anteriorRound, colapso, cols }: RowGroupProps) {
  const key = forecastN7Key(row.n4Codigo, row.n7.n7Codigo)
  const anteriorN7 = anteriorRound && findN7EnRound(anteriorRound, row.n4Codigo, row.n7.n7Codigo)
  const hasComparativa = comparativa.plan || !!anteriorN7
  const colapsado = hasComparativa && colapso.collapsed.has(key)
  const llaveColIndex = cols.indexOf('llave')

  return (
    <Fragment>
      <ForecastN7FlatRow
        roundId={roundId}
        row={row}
        cutoff={cutoff}
        desvioMaximo={desvioMaximo}
        onEditarN7={onEditarN7}
        showSubPepCol={showSubPepCol}
        onVerSubPeps={onVerSubPeps}
        readOnly={readOnly}
        linkToDetalle={linkToDetalle}
        seleccion={
          seleccion && {
            checked: seleccion.seleccion.has(key),
            onToggle: () => seleccion.toggle(key),
            disabled: row.n7.envioEstado === 'Validado por Control de Gestión',
          }
        }
        colapso={hasComparativa ? { colapsado, onToggle: () => colapso.toggle(key) } : undefined}
        visibleCols={cols}
      />
      <ForecastComparativaRows
        comparativa={comparativa}
        variant="n7"
        cutoff={cutoff}
        totals={calcN7Totals(row.n4Codigo, row.n7, cutoff)}
        planMeses={findPlanN7(row.n4Codigo, row.n7.n7Codigo)}
        anteriorMeses={anteriorN7?.meses}
        anteriorTotals={anteriorN7 ? calcN7Totals(row.n4Codigo, anteriorN7, cutoff) : undefined}
        anteriorTitulo={anteriorRound?.titulo}
        identityExtra={llaveColIndex >= 0 ? { colIndex: llaveColIndex, content: `${calcLlavePlanPct(row.n4Codigo, row.n7.n7Codigo).toFixed(1)}%` } : undefined}
        hasCheckboxCol={!!seleccion}
        hasSubPepCol={showSubPepCol}
        identityColCount={cols.length}
        colapsado={colapsado}
      />
    </Fragment>
  )
}

/** Tabla del tab "Forecast N7" — todas las líneas N7 de todos los servicios en una sola tabla plana,
 * cada una con sus filas de comparación debajo (Plan y/o forecast anterior, según el botón "Comparar"). */
export function ForecastN7FlatTable({
  roundId,
  rows,
  cutoff,
  desvioMaximo,
  onEditarN7,
  showSubPepCol = true,
  onVerSubPeps,
  readOnly = false,
  linkToDetalle = true,
  seleccion,
  comparativa,
  anteriorRound,
  colapso,
  visibleCols,
}: ForecastN7FlatTableProps) {
  const { col, dir, onSort } = useForecastSort(`${roundId}-n7-flat`)
  const cols = visibleCols ?? forecastIdentityDefaultVisible('n7')
  const sortedRows = useMemo(() => {
    const valueOf = (r: ForecastFlatN7Row, c: string): string | number =>
      c === 'nombre' ? r.n7.n7Nombre : forecastIdentitySortValue(n7Identidad(r.n4Codigo, r.n7, r.n4Siblings, cutoff), c)
    return sortForecastRows(rows, col, dir, valueOf)
  }, [rows, col, dir, cutoff])

  if (rows.length === 0) {
    return (
      <div className="mx-8 mb-6">
        <EmptyState icon="search" title="Sin PEPs N7 para mostrar" text="Este forecast no tiene líneas N7 habilitadas." />
      </div>
    )
  }

  return (
    <div className="mx-8 mb-6 overflow-x-auto rounded-xl border border-border shadow-[0_1px_4px_rgba(0,20,60,0.06)]">
      <table className="w-full border-collapse text-xs">
        <ForecastTableHeader
          cutoff={cutoff}
          identityLabel="PEP N7 · Servicio N4"
          variant="n7"
          sortCol={col}
          sortDir={dir}
          onSort={onSort}
          seleccionTodo={seleccion && { checked: seleccion.allSelected, indeterminate: seleccion.indeterminate, onToggle: seleccion.toggleAll }}
          visibleCols={visibleCols}
          showSubPepCol={showSubPepCol}
        />
        <tbody>
          {sortedRows.map((r) => (
            <RowGroup
              key={r.n7.n7Codigo}
              roundId={roundId}
              row={r}
              cutoff={cutoff}
              desvioMaximo={desvioMaximo}
              onEditarN7={onEditarN7}
              showSubPepCol={showSubPepCol}
              onVerSubPeps={onVerSubPeps}
              readOnly={readOnly}
              linkToDetalle={linkToDetalle}
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
