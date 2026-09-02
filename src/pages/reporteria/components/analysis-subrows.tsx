import type { MetricMode } from '@/data/reporteria'
import { formatTableAmount } from '@/shared/lib/format'
import { VarianceCell } from './variance-cell'
import { applyMetricMode, type HierLeaf, type HierN4 } from '../lib/hier-tree'
import { ChevronButton, tdR, tdL, bord } from './analysis-rows'

function hcCell(v: number) {
  return v > 0 ? v.toLocaleString('es-CL') : '—'
}

export function PepN7Row({ p7, metricMode }: { p7: HierLeaf; metricMode: MetricMode }) {
  const metric = applyMetricMode(p7.fIPC, metricMode)
  return (
    <tr className="border-t border-dotted border-[#E2E8F0] bg-[#FAFAFA]">
      <td className="w-6" />
      <td className={`${tdL} pl-[60px] text-[10.5px] text-[#94A3B8] italic`}>{p7.nombre}</td>
      <td className={`${tdR} ${bord} text-[10.5px] text-[#94A3B8]`}>{formatTableAmount(p7.plan)}</td>
      <td className={`${tdR} text-[10.5px] text-[#94A3B8]`}>{formatTableAmount(p7.fBase)}</td>
      <td className={`${tdR} text-[10.5px]`}><VarianceCell a={p7.fBase} b={p7.plan} pct /></td>
      <td className={`${tdR} text-[10.5px]`}><VarianceCell a={p7.fBase} b={p7.plan} pct={false} /></td>
      <td className={`${tdR} ${bord} text-[10.5px] text-[#94A3B8]`}>{formatTableAmount(metric)}</td>
      <td className={`${tdR} text-[10.5px]`}><VarianceCell a={metric} b={p7.fBase} pct /></td>
      <td className={`${tdR} text-[10.5px]`}><VarianceCell a={metric} b={p7.fBase} pct={false} /></td>
      <td className={`${tdR} ${bord} text-[10.5px] text-[#94A3B8]`}>{hcCell(p7.hcPlan)}</td>
      <td className={`${tdR} text-[10.5px] text-[#94A3B8]`}>{hcCell(p7.hcFBase)}</td>
    </tr>
  )
}

interface PepN4RowProps {
  p4: HierN4
  metricMode: MetricMode
  open: boolean
  onToggle: () => void
}

export function PepN4Row({ p4, metricMode, open, onToggle }: PepN4RowProps) {
  const metric = applyMetricMode(p4.fIPC, metricMode)
  return (
    <>
      <tr className={`border-t border-[#F1F5F9] ${open ? 'bg-[#FAFCFF]' : 'bg-[#F8FAFC]'}`}>
        <td className="w-6 pl-4 text-center">
          <ChevronButton open={open} onClick={onToggle} />
        </td>
        <td className={`${tdL} pl-10 text-[11px] font-medium text-[#475569]`}>{p4.nombre}</td>
        <td className={`${tdR} ${bord} text-[11px] text-muted-foreground`}>{formatTableAmount(p4.plan)}</td>
        <td className={`${tdR} text-[11px] text-muted-foreground`}>{formatTableAmount(p4.fBase)}</td>
        <td className={tdR}><VarianceCell a={p4.fBase} b={p4.plan} pct /></td>
        <td className={tdR}><VarianceCell a={p4.fBase} b={p4.plan} pct={false} /></td>
        <td className={`${tdR} ${bord} text-[11px] text-muted-foreground`}>{formatTableAmount(metric)}</td>
        <td className={tdR}><VarianceCell a={metric} b={p4.fBase} pct /></td>
        <td className={tdR}><VarianceCell a={metric} b={p4.fBase} pct={false} /></td>
        <td className={`${tdR} ${bord} text-[11px] text-[#475569]`}>{hcCell(p4.hcPlan)}</td>
        <td className={`${tdR} text-[11px] text-[#475569]`}>{hcCell(p4.hcFBase)}</td>
      </tr>
      {open && p4.pepN7.map((p7) => <PepN7Row key={p7.nombre} p7={p7} metricMode={metricMode} />)}
    </>
  )
}
