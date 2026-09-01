import { cn } from '@/shared/lib/utils'
import { EmptyState } from '@/shared/ui'
import type { PreliminarRow } from '@/data/preliminares'
import { prelimFmt, prelimPct } from '../lib/preliminares-calc'
import { AvanceBadge, DifChip } from './avance-badge'

const th = 'p-[8px_10px] text-left text-[11px] font-bold text-muted-foreground uppercase tracking-[0.03em] whitespace-nowrap border-b border-border bg-[#F4F6FB]'
const thNum = `${th} text-right bg-primary/5`
const td = 'p-[10px_10px] text-[11.5px] whitespace-nowrap text-cs-gris-oscuro'
const tdNum = `${td} text-right bg-primary/[0.03]`

interface PreliminaresTableProps {
  rows: (PreliminarRow & { parentServicio?: string })[]
  isN7: boolean
  onRowClick?: (row: PreliminarRow) => void
  itemLabel: string
  mesLabel: string
}

export function PreliminaresTable({ rows, isN7, onRowClick, itemLabel, mesLabel }: PreliminaresTableProps) {
  if (rows.length === 0) {
    return (
      <div className="mx-8 mb-6">
        <EmptyState icon="filter" title="Sin resultados con los filtros aplicados" text="Ajustá o limpiá los filtros para ver datos." />
      </div>
    )
  }

  return (
    <div className="mx-8 mb-6 overflow-x-auto rounded-xl border border-border">
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr>
            <th className={cn(th, 'font-bold text-cs-gris-oscuro')}>{isN7 ? 'PEP N7' : 'PEP N4'}</th>
            {isN7 && <th className={th}>Servicio N4</th>}
            <th className={th}>Código</th>
            <th className={th}>País</th>
            <th className={th}>Ger. Padre</th>
            <th className={th}>Gerencia</th>
            {isN7 && <th className={th}>Equipo</th>}
            {isN7 && <th className={th}>C. Costo</th>}
            {isN7 && <th className={th}>Asignación</th>}
            <th className={th}>Cta. Cont.</th>
            <th className={th}>Moneda</th>
            <th className={cn(thNum, 'border-l-2 border-l-primary/20')}>Acum. Real (Ene-Jul)</th>
            <th className={thNum}>Real del mes</th>
            <th className={thNum}>FC {mesLabel}</th>
            <th className={thNum}>Plan del mes</th>
            <th className={thNum}>Preliminar</th>
            <th className={thNum}>Desvío</th>
            <th className={cn(thNum, 'text-center')}>% Desvío</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const dif = row.preliminarMes > 0 ? row.forecastMes - row.preliminarMes : null
            const pct = row.preliminarMes > 0 ? prelimPct(row.preliminarMes, row.forecastMes) : null
            const hasPrelim = row.preliminarMes > 0
            return (
              <tr key={row.codigo} className={cn('border-t border-border', onRowClick && 'cursor-pointer hover:bg-[#FBFCFE]')} onClick={onRowClick ? () => onRowClick(row) : undefined}>
                <td className={cn(td, 'font-semibold text-foreground')}>{row.servicio}</td>
                {isN7 && <td className={td}>{row.parentServicio}</td>}
                <td className={td}>{row.codigo}</td>
                <td className={td}>{row.pais}</td>
                <td className={td}>{row.gerenciaPadre}</td>
                <td className={td}>{row.gerencia}</td>
                {isN7 && <td className={td}>{row.equipo}</td>}
                {isN7 && <td className={td}>{row.centroCosto}</td>}
                {isN7 && <td className={td}>{row.asignacion}</td>}
                <td className={td}>{row.cuentaContable}</td>
                <td className={td}>{row.moneda}</td>
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
          })}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-border bg-[#FAFBFE] font-bold">
            <td colSpan={isN7 ? 11 : 7} className="p-[10px_14px] text-[12.5px] text-foreground">
              Total · {rows.length} {itemLabel}
            </td>
            <td colSpan={7} className="p-[10px_14px] border-l-2 border-l-primary/20 text-center text-xs text-muted-foreground">
              Monedas mixtas — ver por servicio
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
