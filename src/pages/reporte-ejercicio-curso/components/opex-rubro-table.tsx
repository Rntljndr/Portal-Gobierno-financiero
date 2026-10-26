import { opexRubro } from '@/data/opex-it-chile'
import type { OpexFiltros } from '../lib/opex-it-chile-helpers'
import { RowChevron, VarCells, th, thRight } from './opex-var-cells'

interface OpexRubroTableProps {
  rubro: OpexFiltros['rubro']
}

export function OpexRubroTable({ rubro }: OpexRubroTableProps) {
  const filas = rubro.length ? opexRubro.filter((r) => rubro.includes(r.nombre)) : opexRubro
  const totalProy = filas.reduce((acc, r) => acc + r.proy, 0)
  const totalPlan = filas.reduce((acc, r) => acc + r.plan, 0)

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#FAFBFE]">
            <th className={th}>Rubro</th>
            <th className={thRight}>FC</th>
            <th className={thRight}>Plan</th>
            <th className={thRight}>Var.</th>
            <th className={thRight}>% Var.</th>
          </tr>
        </thead>
        <tbody>
          {filas.map((r) => (
            <tr key={r.nombre} className="border-t border-[#F1F3F8]">
              <td className="p-[8px_10px] text-[13px] text-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <RowChevron open={false} />
                  {r.nombre}
                </span>
              </td>
              <VarCells proy={r.proy} plan={r.plan} />
            </tr>
          ))}
          <tr className="border-t-2 border-[#455B85]">
            <td className="p-[8px_10px] text-[13px] font-bold text-foreground">Total</td>
            <VarCells proy={totalProy} plan={totalPlan} bold />
          </tr>
        </tbody>
      </table>
    </div>
  )
}
