import type { AnalysisGroup } from '@/data/reporteria'
import { formatTableAmount } from '@/shared/lib/format'

interface PaisDrawerDivisionesTabProps {
  pais: string
  divisiones: AnalysisGroup[]
}

export function PaisDrawerDivisionesTab({ pais, divisiones }: PaisDrawerDivisionesTabProps) {
  return (
    <div>
      <div className="mb-3.5">
        <div className="mb-[3px] text-[10px] font-bold tracking-[0.06em] text-muted-foreground uppercase">División · {pais}</div>
        <div className="text-xs text-muted-foreground">Estructura de divisiones del presupuesto 2027</div>
      </div>
      {divisiones.length === 0 ? (
        <div className="p-12 text-center text-xs text-muted-foreground">Sin divisiones para este país</div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-white">
          <table className="w-full table-fixed border-collapse text-xs">
            <thead>
              <tr>
                <th className="w-[40%] bg-[#F8FAFC] p-[9px_14px] text-left text-[10px] font-bold tracking-[0.06em] text-muted-foreground uppercase">División / Sub-división</th>
                <th className="border-l border-[#E2E8F0] bg-[#F8FAFC] p-[9px_14px] text-right text-[10px] font-bold tracking-[0.06em] text-muted-foreground uppercase">Plan</th>
                <th className="bg-[#F8FAFC] p-[9px_14px] text-right text-[10px] font-bold tracking-[0.06em] text-muted-foreground uppercase">Forecast</th>
                <th className="bg-[#F8FAFC] p-[9px_14px] text-right text-[10px] font-bold tracking-[0.06em] text-[#067647] uppercase">Var. $</th>
              </tr>
            </thead>
            <tbody>
              {divisiones.map((g) => (
                <DivisionGroupRows key={g.nombre} group={g} pais={pais} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function DivisionGroupRows({ group, pais }: { group: AnalysisGroup; pais: string }) {
  const totalPlan = group.children.reduce((s, c) => s + c.plan, 0)
  const totalFBase = group.children.reduce((s, c) => s + c.fBase, 0)
  const totalVar = totalFBase - totalPlan
  return (
    <>
      <tr className="border-t-2 border-[#E2E8F0] bg-[#F8FAFC]">
        <td className="p-[14px_14px_6px] text-left font-bold text-primary">{group.nombre}</td>
        <td className="border-l border-[#E2E8F0] p-[14px_14px_6px] text-right font-bold text-primary">{formatTableAmount(totalPlan)}</td>
        <td className="p-[14px_14px_6px] text-right font-bold text-primary">{formatTableAmount(totalFBase)}</td>
        <td className="p-[14px_14px_6px] text-right font-bold" style={{ color: totalVar > 0 ? '#DC2626' : totalVar < 0 ? '#067647' : 'var(--fg-muted)' }}>
          {totalVar > 0 ? '+' : ''}
          {formatTableAmount(totalVar)}
        </td>
      </tr>
      {group.children.map((c, ci) => {
        const varVal = c.fBase - c.plan
        return (
          <tr key={c.nombre} className={`border-t border-[#EEF2F7] ${ci % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFC]'}`}>
            <td className="p-[10px_14px] text-left font-medium text-muted-foreground">{c.nombre.replace(`${pais}-`, '')}</td>
            <td className="border-l border-[#E2E8F0] p-[10px_14px] text-right">{formatTableAmount(c.plan)}</td>
            <td className="p-[10px_14px] text-right font-semibold">{formatTableAmount(c.fBase)}</td>
            <td className="p-[10px_14px] text-right font-semibold" style={{ color: varVal > 0 ? '#DC2626' : varVal < 0 ? '#067647' : 'var(--fg-muted)' }}>
              {varVal > 0 ? '+' : ''}
              {formatTableAmount(varVal)}
            </td>
          </tr>
        )
      })}
    </>
  )
}
