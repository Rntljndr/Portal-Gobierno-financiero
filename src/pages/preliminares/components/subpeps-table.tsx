import { EmptyState } from '@/shared/ui'
import type { PreliminarRow } from '@/data/preliminares'
import { prelimFmt } from '../lib/preliminares-calc'

const th = 'p-[8px_10px] text-left text-[11px] font-bold text-muted-foreground uppercase tracking-[0.03em] whitespace-nowrap border-b border-border bg-[#F4F6FB]'
const td = 'p-[10px_10px] text-[11.5px] whitespace-nowrap text-cs-gris-oscuro'

export function SubPepsTable({ n7Rows }: { n7Rows: PreliminarRow[] }) {
  const items = n7Rows.flatMap((n7) => (n7.subPeps ?? []).map((sp) => ({ ...sp, n7Codigo: n7.codigo, n7Nombre: n7.servicio, moneda: n7.moneda })))

  if (items.length === 0) {
    return <EmptyState icon="search" title="Sin SubPEPs asociados" text="Este servicio no tiene SubPEPs registrados en el mes abierto." />
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr>
            <th className={th}>SubPEP</th>
            <th className={th}>Código</th>
            <th className={th}>PEP N7</th>
            <th className={`${th} text-right bg-primary/5`}>Monto</th>
          </tr>
        </thead>
        <tbody>
          {items.map((sp) => (
            <tr key={sp.codigo} className="border-t border-border">
              <td className={`${td} font-semibold text-foreground`}>{sp.nombre}</td>
              <td className={td}>{sp.codigo}</td>
              <td className={td}>{sp.n7Codigo}</td>
              <td className={`${td} bg-primary/[0.03] text-right font-bold text-primary tabular-nums`}>{prelimFmt(sp.monto, sp.moneda)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
