import { Link } from 'react-router'
import { cn } from '@/shared/lib/utils'
import { Icon, ResumenCells } from '@/shared/ui'
import { monthKeys } from '@/data/reporteria'
import type { ForecastN4Linea } from '@/data/forecast-lineas'
import { calcN4Meses, calcN4Totals } from '../lib/forecast-edit-calc'
import { n4Identidad } from '../lib/forecast-identidad'
import { formatForecastAmount } from '../lib/format-forecast-amount'
import { FORECAST_CHECKBOX_COL_W, FORECAST_NAME_STICKY_LEFT } from '../lib/forecast-checkbox-col'
import { ForecastMonthCell } from './forecast-month-cell'
import { ForecastIdentityCells } from './forecast-identity-cells'
import { ForecastN4AccionesCell } from './forecast-n4-acciones'
import { TriCheckbox } from './tri-checkbox'

const td = 'p-[10px_8px] text-[12px] whitespace-nowrap text-cs-gris-oscuro'

function positionClass(closed: boolean, i: number, cutoff: number) {
  return cn(i === 0 && (closed ? 'border-l-2 border-l-[#C4DFFF]' : 'border-l-2 border-l-[#CBD5E1]'), i === cutoff && 'border-l-2 border-l-[#CBD5E1]')
}

interface ForecastN4TableRowProps {
  roundId: string
  n4: ForecastN4Linea
  cutoff: number
  /** F: "en los meses de forecast no debe existir una selección para editar" — la edición del N4 ya no
   * se abre haciendo clic en una celda de mes, sino desde el botón de la columna Acciones. */
  onEditar?: (n4: ForecastN4Linea) => void
  /** Forecast anterior (F): todas las celdas quedan bloqueadas sin importar el cutoff. */
  readOnly?: boolean
  /** M7: selección múltiple para las acciones masivas (enviar/aprobar/rechazar) — ausente en tablas de
   * solo lectura. */
  seleccion?: { checked: boolean; onToggle: () => void; disabled?: boolean }
  /** Botón "Contraer/Expandir" de las filas de comparación de esta línea (Comparar) — ausente cuando no
   * hay ninguna comparativa activa (nada que colapsar). */
  colapso?: { colapsado: boolean; onToggle: () => void }
  /** Columnas de identidad visibles (botón "Columnas") — todas por defecto si no se pasa. */
  visibleCols?: string[]
}

export function ForecastN4TableRow({ roundId, n4, cutoff, onEditar, readOnly = false, seleccion, colapso, visibleCols }: ForecastN4TableRowProps) {
  const meses = calcN4Meses(n4)
  const totals = calcN4Totals(n4, cutoff)
  const hasManual = n4.n7.some((l) => l.tipoActualizacion === 'manual')

  return (
    <tr className="border-t border-border">
      {seleccion && (
        <td className={cn(td, FORECAST_CHECKBOX_COL_W, 'sticky left-0 z-[1] bg-white p-[10px_0_10px_14px]')}>
          <TriCheckbox checked={seleccion.checked} disabled={seleccion.disabled} onChange={seleccion.onToggle} ariaLabel={`Seleccionar ${n4.n4Nombre}`} />
        </td>
      )}
      <td className={cn(td, 'sticky z-[1] bg-white font-semibold text-foreground', seleccion ? FORECAST_NAME_STICKY_LEFT : 'left-0')}>
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
          <Link
            to={`/forecast/${roundId}/editar/${encodeURIComponent(n4.n4Codigo)}`}
            className="flex min-w-0 items-center gap-1.5 hover:text-primary hover:underline"
            title={hasManual ? `${n4.n4Nombre} — Tiene N7 con edición manual` : n4.n4Nombre}
          >
            {hasManual && <Icon name="alert" size={11} color="#B45309" />}
            <span className="max-w-[200px] truncate">{n4.n4Nombre}</span>
          </Link>
        </div>
      </td>
      <ForecastIdentityCells identidad={n4Identidad(n4)} visibleCols={visibleCols} />
      {monthKeys.map((k, i) => {
        const closed = readOnly || i < cutoff
        return <ForecastMonthCell key={k} value={meses[k] || 0} locked={closed} positionClassName={positionClass(closed, i, cutoff)} />
      })}
      <ResumenCells totals={totals} fmt={formatForecastAmount} hideDesvio />
      <ForecastN4AccionesCell onEditar={!readOnly && onEditar ? () => onEditar(n4) : undefined} />
    </tr>
  )
}
