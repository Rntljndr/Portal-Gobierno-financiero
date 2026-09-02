import type { MetricMode } from '@/data/reporteria'
import { Icon } from '@/shared/ui'
import { formatTableAmount } from '@/shared/lib/format'
import { VarianceCell } from './variance-cell'
import { applyMetricMode, type HierGroup, type HierChild } from '../lib/hier-tree'
import { PepN4Row } from './analysis-subrows'

export const tdR = 'p-[6px_8px] text-right tabular-nums text-xs whitespace-nowrap'
export const tdL = 'p-[6px_8px] text-left text-xs'
export const bord = 'border-l border-[#E2E8F0]'

function hcCell(v: number) {
  return v > 0 ? v.toLocaleString('es-CL') : '—'
}

export function ChevronButton({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex items-center p-1 text-[#64748B]">
      <span className="inline-flex items-center transition-transform" style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}>
        <Icon name="chevron_right" size={12} color="#64748B" />
      </span>
    </button>
  )
}

export function GroupRow({ group, metricMode, open, onToggle }: { group: HierGroup; metricMode: MetricMode; open: boolean; onToggle: () => void }) {
  const metric = applyMetricMode(group.fIPC, metricMode)
  return (
    <tr className={`border-t border-border ${open ? 'bg-[#EFF6FF]' : ''}`}>
      <td className="w-6 py-0 pl-1 text-center">
        <ChevronButton open={open} onClick={onToggle} />
      </td>
      <td className={`${tdL} pl-1 font-bold`}>{group.nombre}</td>
      <td className={`${tdR} ${bord} font-semibold`}>{formatTableAmount(group.plan)}</td>
      <td className={`${tdR} font-semibold`}>{formatTableAmount(group.fBase)}</td>
      <td className={`${tdR} font-bold`}><VarianceCell a={group.fBase} b={group.plan} pct bold /></td>
      <td className={`${tdR} font-bold`}><VarianceCell a={group.fBase} b={group.plan} pct={false} bold /></td>
      <td className={`${tdR} ${bord} font-semibold`}>{formatTableAmount(metric)}</td>
      <td className={`${tdR} font-bold`}><VarianceCell a={metric} b={group.fBase} pct bold /></td>
      <td className={`${tdR} font-bold`}><VarianceCell a={metric} b={group.fBase} pct={false} bold /></td>
      <td className={`${tdR} ${bord} font-semibold text-foreground`}>{hcCell(group.hcPlan)}</td>
      <td className={`${tdR} font-semibold text-foreground`}>{hcCell(group.hcFBase)}</td>
    </tr>
  )
}

interface ChildRowProps {
  child: HierChild
  metricMode: MetricMode
  open: boolean
  onToggle: () => void
  expandedN4: Record<number, boolean>
  onToggleN4: (i: number) => void
  rowRef?: (el: HTMLTableRowElement | null) => void
}

export function ChildRow({ child, metricMode, open, onToggle, expandedN4, onToggleN4, rowRef }: ChildRowProps) {
  const metric = applyMetricMode(child.fIPC, metricMode)
  return (
    <>
      <tr ref={rowRef} className={`border-t border-[#EEF2F7] ${open ? 'bg-[#F0F6FF]' : 'bg-[#F8FAFC]'}`}>
        <td className="w-6 pl-2 text-center">
          <ChevronButton open={open} onClick={onToggle} />
        </td>
        <td className={`${tdL} pl-5 text-[11.5px] font-semibold text-cs-gris-oscuro`}>{child.nombre}</td>
        <td className={`${tdR} ${bord} text-[11.5px]`}>{formatTableAmount(child.plan)}</td>
        <td className={`${tdR} text-[11.5px]`}>{formatTableAmount(child.fBase)}</td>
        <td className={`${tdR} font-semibold`}><VarianceCell a={child.fBase} b={child.plan} pct /></td>
        <td className={`${tdR} font-semibold`}><VarianceCell a={child.fBase} b={child.plan} pct={false} /></td>
        <td className={`${tdR} ${bord} text-[11.5px]`}>{formatTableAmount(metric)}</td>
        <td className={`${tdR} font-semibold`}><VarianceCell a={metric} b={child.fBase} pct /></td>
        <td className={`${tdR} font-semibold`}><VarianceCell a={metric} b={child.fBase} pct={false} /></td>
        <td className={`${tdR} ${bord} text-[11.5px] text-foreground`}>{hcCell(child.hcPlan)}</td>
        <td className={`${tdR} text-[11.5px] text-foreground`}>{hcCell(child.hcFBase)}</td>
      </tr>
      {open &&
        child.pepN4.map((p4, pi) => (
          <PepN4Row key={p4.nombre} p4={p4} metricMode={metricMode} open={!!expandedN4[pi]} onToggle={() => onToggleN4(pi)} />
        ))}
    </>
  )
}

export function TotalRow({ totals }: { totals: HierGroup }) {
  return (
    <tr className="border-t-2 border-border-strong bg-[#F8FAFC]">
      <td className="w-6" />
      <td className={`${tdL} font-bold text-foreground`}>Total</td>
      <td className={`${tdR} ${bord} font-bold text-foreground`}>{formatTableAmount(totals.plan)}</td>
      <td className={`${tdR} font-bold text-foreground`}>{formatTableAmount(totals.fBase)}</td>
      <td className={`${tdR} font-bold`}><VarianceCell a={totals.fBase} b={totals.plan} pct bold /></td>
      <td className={`${tdR} font-bold`}><VarianceCell a={totals.fBase} b={totals.plan} pct={false} bold /></td>
      <td className={`${tdR} ${bord} font-bold text-foreground`}>{formatTableAmount(totals.fIPC)}</td>
      <td className={`${tdR} font-bold`}><VarianceCell a={totals.fIPC} b={totals.fBase} pct bold /></td>
      <td className={`${tdR} font-bold`}><VarianceCell a={totals.fIPC} b={totals.fBase} pct={false} bold /></td>
      <td className={`${tdR} ${bord} font-bold text-foreground`}>{hcCell(totals.hcPlan)}</td>
      <td className={`${tdR} font-bold text-foreground`}>{hcCell(totals.hcFBase)}</td>
    </tr>
  )
}
