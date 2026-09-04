import { cn } from '@/shared/lib/utils'
import { ResumenCells } from '@/shared/ui'
import { REALES_LAST_CLOSED } from '@/data/reales'
import type { PreliminarRow } from '@/data/preliminares'
import { calcPrelimMonths, calcPrelimTotals, prelimFmt } from '../lib/preliminares-calc'
import { PRELIM_SUBPEP_COL_W } from '../lib/preliminares-table-cols'
import { EstadoBadge } from './estado-badge'
import { TriCheckbox } from './tri-checkbox'
import { PreliminaresSubPepCell } from './preliminares-subpep-cell'

const td = 'p-[10px_10px] text-[11.5px] whitespace-nowrap text-cs-gris-oscuro'
const tdSubPep = 'sticky z-[1] bg-white font-semibold text-foreground'

function monthCellClass(i: number) {
  const closed = i < REALES_LAST_CLOSED
  const current = i === REALES_LAST_CLOSED
  return cn(
    'p-[10px_6px] text-right font-mono text-[11.5px] tabular-nums',
    closed ? 'bg-primary/[0.03] text-foreground' : current ? 'bg-[#FFFBEB] font-bold text-[#B45309]' : 'text-muted-foreground',
    i === 0 && 'border-l-2 border-l-[#C4DFFF]',
    current && 'border-l-2 border-l-[#FDE68A]',
    i === REALES_LAST_CLOSED + 1 && 'border-l-2 border-l-[#CBD5E1]',
  )
}

interface PreliminaresTableRowProps {
  row: PreliminarRow & { parentServicio?: string; parentCodigo?: string }
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
  const months = calcPrelimMonths(row)
  const totals = calcPrelimTotals(row)
  const fmt = (n: number) => prelimFmt(n, row.moneda)
  const hasSubPeps = isN7 && !!row.subPeps?.length
  const showSubPep = isN7 && showSubPepCol
  const identitySticky = showSubPep ? 'left-[72px]' : 'left-0'
  const rowClickable = isN7 ? hasSubPeps && !!onRowClick : !!onRowClick
  const rowOnClick = rowClickable ? () => onRowClick?.(row) : undefined

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
      {isN7 && (
        <td className={cn(td, 'text-center')}>
          <EstadoBadge estado={row.estado} />
        </td>
      )}
      {months.map((v, i) => (
        <td key={i} className={monthCellClass(i)}>
          {fmt(v)}
        </td>
      ))}
      <ResumenCells totals={totals} fmt={fmt} />
    </tr>
  )
}
