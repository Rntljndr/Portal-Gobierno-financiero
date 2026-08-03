import { formatNumber } from '@/shared/lib/format'
import type { Servicio } from '@/data/services'
import type { PepN7Row } from '../lib/build-pep-n7-rows'

const th = 'p-[8px_12px] text-left text-[10.5px] font-bold tracking-[0.06em] text-muted-foreground uppercase whitespace-nowrap'
const td = 'p-[10px_12px] text-[12.5px] text-foreground whitespace-nowrap'

export function PepN7Table({ rows, moneda }: { rows: PepN7Row[]; moneda: Servicio['moneda'] }) {
  return (
    <div className="mx-8 mb-7 overflow-hidden rounded-xl border border-border bg-white">
      <div className="border-b border-border p-[14px_20px] text-[13px] font-bold text-foreground">
        PEP N7 <span className="font-normal text-muted-foreground">({rows.length})</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-[#F8FAFC]">
            <tr>
              <th className={th}>PEP N7</th>
              <th className={th}>País destino</th>
              <th className={th}>Bandera</th>
              <th className={th}>Centro de costos</th>
              <th className={`${th} text-right`}>% Distribución</th>
              <th className={th}>Driver</th>
              <th className={`${th} text-right`}>Monto total</th>
              <th className={th}>Última edición</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-border">
                <td className={`${td} font-semibold text-primary tabular-nums`}>{r.pepN7}</td>
                <td className={td}>{r.pais}</td>
                <td className={td}>{r.bandera}</td>
                <td className={`${td} tabular-nums`}>{r.centroCosto}</td>
                <td className={`${td} text-right font-semibold tabular-nums`}>{r.pctDistribucion}%</td>
                <td className={td}>{r.driver}</td>
                <td className={`${td} text-right font-semibold tabular-nums`}>
                  {moneda} {formatNumber(r.montoTotal)}
                </td>
                <td className={`${td} text-muted-foreground`}>
                  {r.ultimaEdicion} · {r.ultimaEdicionPor}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
