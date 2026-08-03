import { fmtM, varInfo } from '../../lib/pep-n4-table-helpers'

interface RowTotalsProps {
  totProy: number
  totPlan: number
  totFIPC: number
}

export function RowTotals({ totProy, totPlan, totFIPC }: RowTotalsProps) {
  const vPlan = varInfo(totProy, totPlan, false)
  const vFipc = varInfo(totFIPC, totPlan, false)
  const base = 'border-b border-border bg-[#F5F9FF] px-2 py-[7px] text-right text-xs font-bold whitespace-nowrap'

  return (
    <>
      <td className={`${base} min-w-[80px] border-l-2 border-l-[#C4DFFF] text-primary`}>{fmtM(totPlan)}</td>
      <td className={`${base} min-w-[80px] text-primary`}>{fmtM(totProy)}</td>
      <td className={`${base} min-w-[65px]`} style={{ color: vPlan.color }}>{vPlan.pctLabel}</td>
      <td className={`${base} min-w-[80px]`} style={{ color: vPlan.color }}>{vPlan.absLabel}</td>
      <td className={`${base} min-w-[80px] border-l-2 border-l-[#C4DFFF] text-[#185FA5]`}>{fmtM(totFIPC)}</td>
      <td className={`${base} min-w-[65px]`} style={{ color: vFipc.color }}>{vFipc.pctLabel}</td>
      <td className={`${base} min-w-[80px]`} style={{ color: vFipc.color }}>{vFipc.absLabel}</td>
    </>
  )
}
