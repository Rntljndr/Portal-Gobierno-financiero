import { Icon } from '@/shared/ui'
import { formatNumber, formatPercentCL } from '@/shared/lib/format'
import type { DimNode } from '../lib/build-dimension-tree'
import { computeDimMetrics } from '../lib/dimension-metrics'
import type { DimFlatRow } from '../lib/flatten-dimension-tree'
import { DimVarianceValue } from './dimension-variance-cell'

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

const DEPTH_STYLES = [
  { pad: 'pl-2', text: 'text-[14px] font-bold text-foreground', open: 'bg-[#EFF4FF]' },
  { pad: 'pl-8', text: 'text-[13px] font-semibold text-cs-gris-oscuro', open: 'bg-[#F0F6FF]' },
  { pad: 'pl-14', text: 'text-[12.5px] text-foreground', open: '' },
]

interface DimensionRowProps {
  row: DimFlatRow
  zebra: boolean
  nivelLabel: string
  unidad: string
  totalPlanFiltrado: number
}

export function DimensionRow({ row, zebra, nivelLabel, unidad, totalPlanFiltrado }: DimensionRowProps) {
  const { depth, node, hasChildren, isOpen, onToggle } = row
  const m = computeDimMetrics(node, totalPlanFiltrado)
  const style = DEPTH_STYLES[depth]
  const rowBg = depth < 2 ? (isOpen ? style.open : '') : zebra ? 'bg-[#F8FAFC]' : 'bg-white'
  const nivel = depth === 0 ? nivelLabel : depth === 1 ? 'Gerencia' : 'Servicio'

  return (
    <tr className={`border-t border-border-table ${rowBg} transition-colors hover:bg-surface-hover`}>
      <td className={`p-[9px_10px] text-left ${style.text}`}>
        <span className={`inline-flex items-center gap-1.5 ${style.pad}`}>
          {hasChildren && onToggle ? <ChevronButton open={isOpen} onClick={onToggle} /> : <span className="inline-block w-[18px]" />}
          {node.nombre}
        </span>
      </td>
      <td className="p-[9px_10px] text-left text-[10.5px] font-semibold tracking-wide text-muted-foreground uppercase">{nivel}</td>
      <td className={`${tdR} ${bord} text-muted-foreground`}>{unidad}</td>
      <td className={`${tdR} ${style.text}`}>{formatNumber(node.plan)}</td>
      <td className={`${tdR} text-muted-foreground`}>{formatPercentCL(m.pesoPlan)}</td>
      <td className={`${tdR} ${bord} ${style.text}`}>{formatNumber(node.fIPC)}</td>
      <td className={tdR}><DimVarianceValue value={m.varMonto} bold={depth === 0} /></td>
      <td className={tdR}><DimVarianceValue value={m.varPct} percent bold={depth === 0} /></td>
    </tr>
  )
}

export function DimensionTotalRow({ totals, unidad }: { totals: DimNode; unidad: string }) {
  const m = computeDimMetrics(totals, totals.plan)
  return (
    <tr className="border-t-2 border-border-table-strong bg-[#F8FAFC]">
      <td className="p-[10px] text-left text-[14px] font-bold text-foreground">
        <span className="inline-flex items-center gap-1.5 pl-2">
          <span className="inline-block w-[18px]" />
          {totals.nombre}
        </span>
      </td>
      <td className="p-[9px_10px] text-left text-[10.5px] font-semibold tracking-wide text-muted-foreground uppercase">Total</td>
      <td className={`${tdR} ${bord} text-muted-foreground`}>{unidad}</td>
      <td className={`${tdR} font-bold text-foreground`}>{formatNumber(totals.plan)}</td>
      <td className={`${tdR} font-semibold text-muted-foreground`}>{formatPercentCL(m.pesoPlan)}</td>
      <td className={`${tdR} ${bord} font-bold text-foreground`}>{formatNumber(totals.fIPC)}</td>
      <td className={tdR}><DimVarianceValue value={m.varMonto} bold /></td>
      <td className={tdR}><DimVarianceValue value={m.varPct} percent bold /></td>
    </tr>
  )
}
