import { Link } from 'react-router'
import { cn } from '@/shared/lib/utils'
import { Badge, Icon, ResumenCells } from '@/shared/ui'
import { monthKeys } from '@/data/reporteria'
import type { ForecastMesNota, ForecastN7Linea } from '@/data/forecast-lineas'
import { calcN7Totals } from '../lib/forecast-edit-calc'
import { n7Identidad } from '../lib/forecast-identidad'
import { formatForecastAmount } from '../lib/format-forecast-amount'
import { calcDesvioIndicador } from '../lib/forecast-desvio-indicador'
import { FORECAST_CHECKBOX_COL_W, FORECAST_NAME_STICKY_LEFT } from '../lib/forecast-checkbox-col'
import { ForecastIdentityCells } from './forecast-identity-cells'
import { ForecastN7TailExtraCells } from './forecast-n7-tail-extra'
import { ForecastMonthCell } from './forecast-month-cell'
import { TriCheckbox } from './tri-checkbox'

const td = 'p-[10px_8px] text-[12px] whitespace-nowrap text-cs-gris-oscuro'

function positionClass(closed: boolean, i: number, cutoff: number) {
  return cn(i === 0 && (closed ? 'border-l-2 border-l-[#C4DFFF]' : 'border-l-2 border-l-[#CBD5E1]'), i === cutoff && 'border-l-2 border-l-[#CBD5E1]')
}

interface ForecastN7TableRowProps {
  roundId: string
  n4Codigo: string
  n7: ForecastN7Linea
  siblings: ForecastN7Linea[]
  cutoff: number
  /** Notas del N4 padre — para el indicador de desvío (M5) cuando FORECAST_JUSTIFICACION_NIVEL es 'n4'. */
  n4Notas: Record<string, ForecastMesNota>
  /** % de desvío máximo configurado del forecast (M5: "Sin desvío" si no se supera). */
  desvioMaximo: number
  /** Forecast activo (A5): nombre o celda editable abren el drawer de edición completa del PEP N7, en
   * vez de navegar a otra pantalla. */
  onEditarN7?: (n7: ForecastN7Linea) => void
  onResetLlave?: (n7Codigo: string) => void
  /** Forecast anterior (F): todos los meses quedan bloqueados sin importar el cutoff, y no se ofrece
   * restablecer la llave ni editar — el nombre navega a ForecastN7DetallePage en solo lectura. */
  readOnly?: boolean
  /** M7: selección múltiple para las acciones masivas — ausente en tablas de solo lectura. */
  seleccion?: { checked: boolean; onToggle: () => void; disabled?: boolean }
  /** Botón "Contraer/Expandir" de las filas de comparación de esta línea (Comparar) — ausente cuando no
   * hay ninguna comparativa activa (nada que colapsar). */
  colapso?: { colapsado: boolean; onToggle: () => void }
  /** Columnas de identidad visibles (botón "Columnas") — todas por defecto si no se pasa. */
  visibleCols?: string[]
}

export function ForecastN7TableRow({ roundId, n4Codigo, n7, siblings, cutoff, n4Notas, desvioMaximo, onEditarN7, onResetLlave, readOnly = false, seleccion, colapso, visibleCols }: ForecastN7TableRowProps) {
  const totals = calcN7Totals(n4Codigo, n7, cutoff)
  const isManual = n7.tipoActualizacion === 'manual'
  const identidad = n7Identidad(n4Codigo, n7, siblings, cutoff)
  const desvioIndicador = calcDesvioIndicador(totals, desvioMaximo, { n4: n4Notas, n7: n7.notas })
  const editHref = `/forecast/${roundId}/editar/${encodeURIComponent(n4Codigo)}/${encodeURIComponent(n7.n7Codigo)}`

  return (
    <tr className="border-t border-border">
      {seleccion && (
        <td className={cn(td, FORECAST_CHECKBOX_COL_W, 'sticky left-0 z-[1] bg-white p-[10px_0_10px_14px]')}>
          <TriCheckbox checked={seleccion.checked} disabled={seleccion.disabled} onChange={seleccion.onToggle} ariaLabel={`Seleccionar ${n7.n7Nombre}`} />
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
          {readOnly ? (
            <Link to={editHref} title={n7.n7Nombre} className="max-w-[200px] truncate hover:text-primary hover:underline">
              {n7.n7Nombre}
            </Link>
          ) : (
            <button type="button" onClick={() => onEditarN7?.(n7)} title={n7.n7Nombre} className="max-w-[200px] truncate text-left hover:text-primary hover:underline">
              {n7.n7Nombre}
            </button>
          )}
          {isManual && (
            <Badge variant="warning">
              <Icon name="alert" size={9} color="currentColor" /> Edición manual
            </Badge>
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
            manual={isManual && !closed}
            positionClassName={positionClass(closed, i, cutoff)}
            onEdit={closed || !onEditarN7 ? undefined : () => onEditarN7(n7)}
          />
        )
      })}
      <ResumenCells totals={totals} fmt={formatForecastAmount} hideDesvio />
      <ForecastN7TailExtraCells
        n7={n7}
        desvioIndicador={desvioIndicador}
        ultimaEdicion={identidad.ultimaEdicion}
        editHref={readOnly ? editHref : undefined}
        onEditar={!readOnly && onEditarN7 ? () => onEditarN7(n7) : undefined}
        onResetLlave={isManual && !readOnly && onResetLlave ? () => onResetLlave(n7.n7Codigo) : undefined}
        readOnly={readOnly}
      />
    </tr>
  )
}
