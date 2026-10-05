import { Link } from 'react-router'
import { cn } from '@/shared/lib/utils'
import { monthKeys } from '@/data/reporteria'
import type { ForecastN7Linea } from '@/data/forecast-lineas'
import { calcN7Totals } from '../lib/forecast-edit-calc'
import { n7Identidad } from '../lib/forecast-identidad'
import { formatForecastAmount } from '../lib/format-forecast-amount'
import { calcDesvioIndicador } from '../lib/forecast-desvio-indicador'
import { FORECAST_CHECKBOX_COL_W, FORECAST_SUBPEP_COL_W, forecastNameStickyLeft, forecastSubPepStickyLeft } from '../lib/forecast-checkbox-col'
import { forecastN7TieneSubPeps } from '../lib/forecast-subpep'
import { Icon, ResumenCells } from '@/shared/ui'
import type { ForecastFlatN7Row } from '../lib/forecast-flat-n7'
import { ForecastIdentityCells } from './forecast-identity-cells'
import { ForecastN7TailExtraCells } from './forecast-n7-tail-extra'
import { ForecastMonthCell } from './forecast-month-cell'
import { ForecastSubPepCell } from './forecast-subpep-cell'
import { TriCheckbox } from './tri-checkbox'

const td = 'p-[10px_8px] text-[12px] whitespace-nowrap text-cs-gris-oscuro'

function positionClass(closed: boolean, i: number, cutoff: number) {
  return cn(i === 0 && (closed ? 'border-l-2 border-l-[#C4DFFF]' : 'border-l-2 border-l-[#CBD5E1]'), i === cutoff && 'border-l-2 border-l-[#CBD5E1]')
}

interface ForecastN7FlatRowProps {
  roundId: string
  row: ForecastFlatN7Row
  cutoff: number
  /** % de desvío máximo configurado del forecast (M5). */
  desvioMaximo: number
  /** Forecast activo (A5): nombre o celda editable abren el drawer de edición completa del PEP N7 —
   * recibe también el n4Codigo porque acá cada fila puede pertenecer a un N4 distinto. */
  onEditarN7?: (n4Codigo: string, n7: ForecastN7Linea) => void
  readOnly?: boolean
  /** M7: selección múltiple para las acciones masivas (enviar/aprobar/rechazar) — ausente en tablas de
   * solo lectura. */
  seleccion?: { checked: boolean; onToggle: () => void; disabled?: boolean }
  /** Botón "Contraer/Expandir" de las filas de comparación de esta línea (Comparar) — ausente cuando no
   * hay ninguna comparativa activa (nada que colapsar). */
  colapso?: { colapsado: boolean; onToggle: () => void }
  /** Columnas de identidad visibles (botón "Columnas") — todas por defecto si no se pasa. */
  visibleCols?: string[]
  /** F: columna fija "SubPEP" con botón "Ver" — navega al detalle de SubPEPs de este PEP N7. Ausente en
   * la propia pantalla de SubPEPs (ForecastSubPepPage), para no anidar "SubPEP de un SubPEP". */
  showSubPepCol?: boolean
  onVerSubPeps?: (n4Codigo: string, n7: ForecastN7Linea) => void
  /** Default true. En false (ForecastSubPepPage) el nombre queda como texto plano en vez de Link: un
   * SubPEP es un código sintético (ej. "N7-001a-S1") sin pantalla de detalle propia a la que navegar. */
  linkToDetalle?: boolean
}

/** Fila del tab "Forecast N7" (F: tabs como en Reales) — todas las líneas N7 de todos los servicios,
 * sin scope a un N4 puntual. Nombre y meses editables abren el mismo drawer de edición completa (A5);
 * en un forecast anterior el nombre navega a ForecastN7DetallePage en solo lectura. */
export function ForecastN7FlatRow({ roundId, row, cutoff, desvioMaximo, onEditarN7, readOnly = false, seleccion, colapso, visibleCols, showSubPepCol, onVerSubPeps, linkToDetalle = true }: ForecastN7FlatRowProps) {
  const { n4Codigo, n4Nombre, n7, n4Siblings, n4Notas } = row
  const totals = calcN7Totals(n4Codigo, n7, cutoff)
  const identidad = n7Identidad(n4Codigo, n7, n4Siblings, cutoff)
  const desvioIndicador = calcDesvioIndicador(totals, desvioMaximo, { n4: n4Notas, n7: n7.notas })
  const editHref = `/forecast/${roundId}/editar/${encodeURIComponent(n4Codigo)}/${encodeURIComponent(n7.n7Codigo)}`
  const hasCheckbox = !!seleccion
  const hasSubPeps = !!showSubPepCol && forecastN7TieneSubPeps(n7.n7Codigo)

  return (
    <tr className="border-t border-border">
      {seleccion && (
        <td className={cn(td, FORECAST_CHECKBOX_COL_W, 'sticky left-0 z-[1] bg-white p-[10px_0_10px_14px]')}>
          <TriCheckbox checked={seleccion.checked} disabled={seleccion.disabled} onChange={seleccion.onToggle} ariaLabel={`Seleccionar ${n7.n7Nombre}`} />
        </td>
      )}
      {showSubPepCol && (
        <ForecastSubPepCell
          hasSubPeps={hasSubPeps}
          onVer={() => onVerSubPeps?.(n4Codigo, n7)}
          className={cn(td, FORECAST_SUBPEP_COL_W, 'sticky z-[1] bg-white text-center', forecastSubPepStickyLeft(hasCheckbox))}
        />
      )}
      <td className={cn(td, 'sticky z-[1] bg-white font-semibold text-foreground', forecastNameStickyLeft(hasCheckbox, !!showSubPepCol))}>
        <div className="flex flex-wrap items-center gap-1.5">
          {colapso && (
            <button
              type="button"
              onClick={colapso.onToggle}
              aria-label={colapso.colapsado ? 'Expandir comparativa' : 'Contraer comparativa'}
              className="shrink-0 text-muted-foreground hover:text-primary"
            >
              <Icon name={colapso.colapsado ? 'chevron_down' : 'chevron_up'} size={12} color="currentColor" />
            </button>
          )}
          {readOnly && linkToDetalle ? (
            <Link to={editHref} title={`${n7.n7Nombre} · ${n4Nombre}`} className="min-w-0 hover:text-primary hover:underline">
              <div className="max-w-[200px] truncate">{n7.n7Nombre}</div>
              <div className="max-w-[200px] truncate text-[10.5px] font-normal text-muted-foreground">{n4Nombre}</div>
            </Link>
          ) : readOnly ? (
            <div className="min-w-0">
              <div className="max-w-[200px] truncate">{n7.n7Nombre}</div>
              <div className="max-w-[200px] truncate text-[10.5px] font-normal text-muted-foreground">{n4Nombre}</div>
            </div>
          ) : (
            <button type="button" onClick={() => onEditarN7?.(n4Codigo, n7)} title={`${n7.n7Nombre} · ${n4Nombre}`} className="min-w-0 text-left hover:text-primary hover:underline">
              <div className="max-w-[200px] truncate">{n7.n7Nombre}</div>
              <div className="max-w-[200px] truncate text-[10.5px] font-normal text-muted-foreground">{n4Nombre}</div>
            </button>
          )}
        </div>
      </td>
      <ForecastIdentityCells identidad={identidad} visibleCols={visibleCols} />
      {monthKeys.map((k, i) => {
        const closed = readOnly || i < cutoff
        return (
          <ForecastMonthCell
            key={k}
            value={n7.meses[k] || 0}
            locked={closed}
            positionClassName={positionClass(closed, i, cutoff)}
            onEdit={closed || !onEditarN7 ? undefined : () => onEditarN7(n4Codigo, n7)}
          />
        )
      })}
      <ResumenCells totals={totals} fmt={formatForecastAmount} hideDesvio />
      <ForecastN7TailExtraCells
        n7={n7}
        desvioIndicador={desvioIndicador}
        ultimaEdicion={identidad.ultimaEdicion}
        editHref={readOnly && linkToDetalle ? editHref : undefined}
        onEditar={!readOnly && onEditarN7 ? () => onEditarN7(n4Codigo, n7) : undefined}
        readOnly={readOnly}
      />
    </tr>
  )
}
