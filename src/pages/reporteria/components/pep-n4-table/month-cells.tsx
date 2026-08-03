import { fmtM, varInfo } from '../../lib/pep-n4-table-helpers'

interface MonthCellsProps {
  proy: number
  plan: number
  fIPC: number
  bg: string
  bold?: boolean
  isTotal?: boolean
}

export function MonthCells({ proy, plan, fIPC, bg, bold, isTotal }: MonthCellsProps) {
  const vPlan = varInfo(proy, plan, !!isTotal)
  const vFipc = varInfo(fIPC, plan, !!isTotal)
  const fw = bold || isTotal ? 'font-bold' : 'font-normal'
  const pad = isTotal ? 'py-[7px]' : 'py-1.5'
  const size = isTotal ? 'text-xs' : 'text-[11.5px]'

  return (
    <>
      <td style={{ background: bg }} className={`border-l-2 border-l-[rgba(6,20,148,0.10)] border-b ${isTotal ? 'border-b-2' : ''} border-border px-1.5 ${pad} text-right ${size} ${fw} whitespace-nowrap text-foreground`}>
        {fmtM(proy)}
      </td>
      <td style={{ background: bg }} className={`border-l border-l-dotted border-l-[rgba(6,20,148,0.08)] border-b ${isTotal ? 'border-b-2' : ''} border-border px-1.5 ${pad} text-right ${size} whitespace-nowrap text-muted-foreground`}>
        {fmtM(plan)}
      </td>
      <td style={{ background: bg, color: vPlan.color }} className={`border-l border-l-dotted border-l-[rgba(6,20,148,0.08)] border-b ${isTotal ? 'border-b-2' : ''} border-border px-1.5 ${pad} text-right ${size} ${isTotal ? 'font-bold' : 'font-semibold'} whitespace-nowrap`}>
        {vPlan.pctLabel}
      </td>
      <td style={{ background: bg, color: vPlan.color }} className={`border-l border-l-dotted border-l-[rgba(6,20,148,0.08)] border-b ${isTotal ? 'border-b-2' : ''} border-border px-1.5 ${pad} text-right ${size} ${isTotal ? 'font-bold' : 'font-semibold'} whitespace-nowrap`}>
        {vPlan.absLabel}
      </td>
      <td style={{ background: bg }} className={`border-l-2 border-l-[rgba(6,20,148,0.15)] border-b ${isTotal ? 'border-b-2' : ''} border-border px-1.5 ${pad} text-right ${size} ${fw} whitespace-nowrap text-[#185FA5]`}>
        {fmtM(fIPC)}
      </td>
      <td style={{ background: bg, color: vFipc.color }} className={`border-l border-l-dotted border-l-[rgba(6,20,148,0.08)] border-b ${isTotal ? 'border-b-2' : ''} border-border px-1.5 ${pad} text-right ${size} ${isTotal ? 'font-bold' : 'font-semibold'} whitespace-nowrap`}>
        {vFipc.pctLabel}
      </td>
      <td style={{ background: bg, color: vFipc.color }} className={`border-l border-l-dotted border-l-[rgba(6,20,148,0.08)] border-b ${isTotal ? 'border-b-2' : ''} border-border px-1.5 ${pad} text-right ${size} ${isTotal ? 'font-bold' : 'font-semibold'} whitespace-nowrap`}>
        {vFipc.absLabel}
      </td>
    </>
  )
}
