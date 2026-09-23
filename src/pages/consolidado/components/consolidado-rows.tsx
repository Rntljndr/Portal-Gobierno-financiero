import { Badge, Icon } from '@/shared/ui'
import { formatNumber, formatPercentCL } from '@/shared/lib/format'
import type { DimNode } from '../lib/build-dimension-tree'
import { computeDimMetrics } from '../lib/dimension-metrics'
import type { DimFlatRow } from '../lib/flatten-dimension-tree'
import { countLeaves } from '../lib/build-dimension-tree'
import { ConsolidadoVarianceValue } from './consolidado-variance-cell'

const tdR = 'p-[9px_10px] text-right text-[13px] tabular-nums whitespace-nowrap'
const bord = 'border-l border-border-table'

function ChevronButton({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex items-center p-0.5 text-cs-gris-oscuro">
      <span className="inline-flex items-center transition-transform" style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}>
        <Icon name="chevron_right" size={12} color="currentColor" />
      </span>
    </button>
  )
}

function textStyleFor(depth: number, isLeaf: boolean): string {
  if (isLeaf) return 'text-[12.5px] text-foreground'
  if (depth === 0) return 'text-[14px] font-bold text-foreground'
  if (depth === 1) return 'text-[13px] font-semibold text-cs-gris-oscuro'
  return 'text-[12.5px] font-semibold text-cs-gris-oscuro'
}

interface ConsolidadoRowProps {
  row: DimFlatRow
  zebra: boolean
  levelLabels: string[]
  leafLabel: string
  totalPlanFiltrado: number
}

export function ConsolidadoRow({ row, zebra, levelLabels, leafLabel, totalPlanFiltrado }: ConsolidadoRowProps) {
  const { depth, node, hasChildren, isOpen, onToggle } = row
  const m = computeDimMetrics(node, totalPlanFiltrado)
  const isLeaf = depth >= levelLabels.length
  const text = textStyleFor(depth, isLeaf)
  const rowBg = isLeaf ? (zebra ? 'bg-[#F8FAFC]' : 'bg-white') : isOpen ? (depth === 0 ? 'bg-[#EFF4FF]' : 'bg-[#F0F6FF]') : ''
  const nivel = isLeaf ? leafLabel : levelLabels[depth]
  const count = isLeaf ? 0 : countLeaves(node)

  return (
    <tr className={`border-t border-border-table ${rowBg} transition-colors hover:bg-surface-hover`}>
      <td className={`p-[9px_10px] text-left ${text}`}>
        <div className="flex items-center justify-between gap-2" style={{ paddingLeft: 8 + depth * 24 }}>
          <span className="flex min-w-0 items-center gap-1.5">
            {hasChildren && onToggle ? <ChevronButton open={isOpen} onClick={onToggle} /> : <span className="inline-block w-[18px] shrink-0" />}
            <span className="min-w-0 truncate">
              {node.codigo && <Badge variant="primary" shape="chip" className="mr-1.5 text-[10px]">{node.codigo}</Badge>}
              {node.nombre}
              {!isLeaf && <div className="text-[10.5px] font-normal text-muted-foreground">{count} {leafLabel}</div>}
            </span>
          </span>
          <Badge variant="neutral" shape="chip" className="shrink-0 text-[9.5px] tracking-wide uppercase">{nivel}</Badge>
        </div>
      </td>
      <td className={`${tdR} ${bord} ${text}`}>{formatNumber(node.plan)}</td>
      <td className={`${tdR} ${text}`}>{formatNumber(node.fIPC)}</td>
      <td className={tdR}><ConsolidadoVarianceValue value={m.varMonto} bold={depth === 0} /></td>
      <td className={tdR}><ConsolidadoVarianceValue value={m.varPct} percent bold={depth === 0} /></td>
      <td className={`${tdR} ${bord} text-muted-foreground`}>{formatPercentCL(m.pctPlan)}</td>
    </tr>
  )
}

export function ConsolidadoTotalRow({ totals, label }: { totals: DimNode; label: string }) {
  const m = computeDimMetrics(totals, totals.plan)
  return (
    <tr className="border-t-2 border-border-table-strong bg-[#F8FAFC]">
      <td className="p-[10px] text-left text-[14px] font-bold text-foreground">
        <span className="inline-flex items-center gap-1.5 pl-2">
          <span className="inline-block w-[18px]" />
          {label}
        </span>
      </td>
      <td className={`${tdR} ${bord} font-bold text-foreground`}>{formatNumber(totals.plan)}</td>
      <td className={`${tdR} font-bold text-foreground`}>{formatNumber(totals.fIPC)}</td>
      <td className={tdR}><ConsolidadoVarianceValue value={m.varMonto} bold /></td>
      <td className={tdR}><ConsolidadoVarianceValue value={m.varPct} percent bold /></td>
      <td className={`${tdR} ${bord} font-bold text-foreground`}>{formatPercentCL(m.pctPlan)}</td>
    </tr>
  )
}
