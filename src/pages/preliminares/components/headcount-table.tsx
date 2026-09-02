import type { PreliminarHeadcountRow } from '@/data/preliminares'
import { prelimFmt } from '../lib/preliminares-calc'

const th = 'p-[8px_10px] text-left text-[11px] font-bold text-muted-foreground uppercase tracking-[0.03em] whitespace-nowrap border-b border-border bg-[#F4F6FB]'
const td = 'p-[10px_10px] text-[11.5px] whitespace-nowrap text-cs-gris-oscuro'

export function HeadcountTable({ rows }: { rows: PreliminarHeadcountRow[] }) {
  const totalCantidad = rows.reduce((s, r) => s + r.cantidad, 0)
  const totalCosto = rows.reduce((s, r) => s + r.cantidad * r.costoMensual, 0)

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr>
            <th className={th}>Cargo</th>
            <th className={th}>Equipo</th>
            <th className={`${th} text-right bg-primary/5`}>Cantidad</th>
            <th className={`${th} text-right bg-primary/5`}>Costo mensual (c/u)</th>
            <th className={`${th} text-right bg-primary/5`}>Total mensual</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={`${r.cargo}-${r.equipo}`} className="border-t border-border">
              <td className={`${td} font-semibold text-foreground`}>{r.cargo}</td>
              <td className={td}>{r.equipo}</td>
              <td className={`${td} bg-primary/[0.03] text-right tabular-nums`}>{r.cantidad}</td>
              <td className={`${td} bg-primary/[0.03] text-right tabular-nums`}>{prelimFmt(r.costoMensual, 'USD')}</td>
              <td className={`${td} bg-primary/[0.03] text-right font-bold text-primary tabular-nums`}>{prelimFmt(r.cantidad * r.costoMensual, 'USD')}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-border bg-[#FAFBFE] font-bold">
            <td colSpan={2} className="p-[10px_10px] text-[12px] text-foreground">Total</td>
            <td className="p-[10px_10px] text-right text-[12px] tabular-nums">{totalCantidad}</td>
            <td />
            <td className="p-[10px_10px] text-right text-[12px] tabular-nums text-primary">{prelimFmt(totalCosto, 'USD')}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
