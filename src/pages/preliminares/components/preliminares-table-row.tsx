import { cn } from '@/shared/lib/utils'
import type { PreliminarRow } from '@/data/preliminares'
import { prelimFmt, prelimPct } from '../lib/preliminares-calc'
import { AvanceBadge, DifChip } from './avance-badge'
import { EstadoBadge, TipoActualizacionBadge } from './estado-badge'
import { TriCheckbox } from './tri-checkbox'

const td = 'p-[10px_10px] text-[11.5px] whitespace-nowrap text-cs-gris-oscuro'
const tdNum = `${td} text-right bg-primary/[0.03]`
const tdSubPep = 'sticky left-0 z-[1] bg-white font-semibold text-foreground'

interface PreliminaresTableRowProps {
  row: PreliminarRow & { parentServicio?: string; parentCodigo?: string }
  isN7: boolean
  onRowClick?: (row: PreliminarRow) => void
  selectable: boolean
  checked: boolean
  indeterminate?: boolean
  checkDisabled?: boolean
  onToggleSelect?: () => void
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
}: PreliminaresTableRowProps) {
  const dif = row.preliminarMes > 0 ? row.forecastMes - row.preliminarMes : null
  const pct = row.preliminarMes > 0 ? prelimPct(row.preliminarMes, row.forecastMes) : null
  const hasPrelim = row.preliminarMes > 0
  const hasSubPeps = isN7 && !!row.subPeps?.length
  const clickable = isN7 ? hasSubPeps : true
  const rowOnClick = onRowClick && clickable ? () => onRowClick(row) : undefined

  return (
    <tr className={cn('border-t border-border', rowOnClick && 'cursor-pointer hover:bg-[#FBFCFE]')} onClick={rowOnClick} title={rowOnClick ? (isN7 ? 'Ver SubPEPs' : 'Ver PEPs N7') : undefined}>
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
      {isN7 ? (
        <td className={cn(td, tdSubPep)}>{row.parentServicio}</td>
      ) : (
        <td className={cn(td, 'font-semibold text-foreground')}>{row.servicio}</td>
      )}
      {isN7 && <td className={cn(td, 'font-semibold text-foreground')}>{row.servicio}</td>}
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
      {isN7 && (
        <td className={cn(td, 'text-center')}>
          <TipoActualizacionBadge tipo={row.tipoActualizacion} />
        </td>
      )}
      <td className={cn(tdNum, 'border-l-2 border-l-primary/20 font-bold text-foreground')}>{prelimFmt(row.acumReal, row.moneda)}</td>
      <td className={tdNum}>{prelimFmt(Math.round(row.acumReal / 7), row.moneda)}</td>
      <td className={cn(tdNum, 'font-bold text-foreground')}>{prelimFmt(row.forecastMes, row.moneda)}</td>
      <td className={tdNum}>{prelimFmt(Math.round(row.forecastMes * 1.03), row.moneda)}</td>
      <td className={tdNum}>
        {hasPrelim ? <span className="font-bold text-primary tabular-nums">{prelimFmt(row.preliminarMes, row.moneda)}</span> : <span className="text-[11px] text-border-strong italic">Sin ingresar</span>}
      </td>
      <td className={tdNum}>{hasPrelim ? <DifChip dif={dif} moneda={row.moneda} /> : <span className="text-border-strong">—</span>}</td>
      <td className={cn(tdNum, 'text-center')}>{hasPrelim ? <AvanceBadge pct={pct} /> : <span className="text-[11px] text-border-strong">—</span>}</td>
    </tr>
  )
}
