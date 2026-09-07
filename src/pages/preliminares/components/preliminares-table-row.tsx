import { cn } from '@/shared/lib/utils'
import { DesvioChip } from '@/shared/ui'
import type { PreliminarN4Row, PreliminarRow } from '@/data/preliminares'
import { calcCompletitud, calcPrelimRowTotals, prelimFmt } from '../lib/preliminares-calc'
import { PRELIM_SUBPEP_COL_W } from '../lib/preliminares-table-cols'
import { EstadoBadge, CompletitudBadge } from './estado-badge'
import { TriCheckbox } from './tri-checkbox'
import { PreliminaresSubPepCell } from './preliminares-subpep-cell'

const td = 'p-[10px_10px] text-[11.5px] whitespace-nowrap text-cs-gris-oscuro'
const tdSubPep = 'sticky z-[1] bg-white font-semibold text-foreground'
const tdData = 'p-[10px_10px] text-right font-mono text-[11.5px] tabular-nums whitespace-nowrap text-cs-gris-oscuro'

function desvioTone(monto: number) {
  if (monto > 0) return 'text-destructive'
  if (monto < 0) return 'text-success'
  return 'text-muted-foreground'
}

interface PreliminaresTableRowProps {
  row: (PreliminarRow & { parentServicio?: string; parentCodigo?: string }) | PreliminarN4Row
  isN7: boolean
  onRowClick?: (row: PreliminarRow) => void
  selectable: boolean
  checked: boolean
  indeterminate?: boolean
  checkDisabled?: boolean
  onToggleSelect?: () => void
  showSubPepCol?: boolean
}

export function PreliminaresTableRow({
  row,
  isN7,
  onRowClick,
  selectable,
  checked,
  indeterminate,
  checkDisabled,
  onToggleSelect,
  showSubPepCol = true,
}: PreliminaresTableRowProps) {
  const t = calcPrelimRowTotals(row)
  const fmt = (n: number) => prelimFmt(n, row.moneda)
  const hasSubPeps = isN7 && !!row.subPeps?.length
  const showSubPep = isN7 && showSubPepCol
  const identitySticky = showSubPep ? 'left-[72px]' : 'left-0'
  const rowClickable = isN7 ? hasSubPeps && !!onRowClick : !!onRowClick
  const rowOnClick = rowClickable ? () => onRowClick?.(row) : undefined
  const isN4WithChildren = 'children' in row

  return (
    <tr
      className={cn('border-t border-border', rowOnClick && 'cursor-pointer hover:bg-[#FBFCFE]')}
      onClick={rowOnClick}
      title={rowOnClick ? (isN7 ? 'Ver SubPEPs' : 'Ver PEPs N7') : undefined}
    >
      {selectable && (
        <td className={cn(td, 'text-center')} onClick={(e) => e.stopPropagation()}>
          <TriCheckbox
            checked={checked}
            indeterminate={indeterminate}
            disabled={checkDisabled ?? row.estado === 'definitivo'}
            onChange={() => onToggleSelect?.()}
          />
        </td>
      )}
      {showSubPep && <PreliminaresSubPepCell hasSubPeps={hasSubPeps} className={cn(td, 'sticky left-0 z-[1] bg-white text-center', PRELIM_SUBPEP_COL_W)} />}
      <td className={cn(td, isN7 ? cn(tdSubPep, identitySticky) : 'font-semibold text-foreground')}>{row.servicio}</td>
      <td className={td}>{row.codigo}</td>
      <td className={td}>{row.pais}</td>
      <td className={td}>{row.gerenciaPadre}</td>
      <td className={td}>{row.gerencia}</td>
      {isN7 && <td className={td}>{row.equipo}</td>}
      {isN7 && <td className={td}>{row.centroCosto}</td>}
      {isN7 && <td className={td}>{row.asignacion}</td>}
      <td className={td}>{row.cuentaContable}</td>
      <td className={td}>{row.moneda}</td>
      <td className={cn(td, 'text-center')}>
        {isN4WithChildren ? <CompletitudBadge pct={calcCompletitud(row.children)} /> : <EstadoBadge estado={row.estado} />}
      </td>
      <td className={cn(tdData, 'border-l-2 border-l-border')}>{fmt(t.realAcum)}</td>
      <td className={tdData}>{fmt(t.forecastMes)}</td>
      <td className={tdData}>{fmt(t.planMes)}</td>
      <td className={cn(tdData, 'bg-[#EEF4FF] font-bold text-primary')}>{fmt(t.preliminarMes)}</td>
      <td className={cn(tdData, 'border-l-2 border-l-border font-semibold', desvioTone(t.desvioPlanMonto))}>
        {t.desvioPlanMonto >= 0 ? '+' : ''}
        {fmt(t.desvioPlanMonto)}
      </td>
      <td className="p-[10px_10px] text-center">
        <DesvioChip pct={t.desvioPlanPct} />
      </td>
      <td className={cn(tdData, 'border-l-2 border-l-border font-semibold', desvioTone(t.desvioForecastMonto))}>
        {t.desvioForecastMonto >= 0 ? '+' : ''}
        {fmt(t.desvioForecastMonto)}
      </td>
      <td className="p-[10px_10px] text-center">
        <DesvioChip pct={t.desvioForecastPct} />
      </td>
    </tr>
  )
}
