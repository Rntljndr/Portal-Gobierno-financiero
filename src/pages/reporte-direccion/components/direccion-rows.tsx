import { Icon, type VistaNumero } from '@/shared/ui'
import { formatNumber, formatMillones, formatPercentCL, toUSD } from '@/shared/lib/format'
import type { DireccionLeaf } from '@/data/reporte-direccion'
import { computeDireccionMetrics } from '../lib/direccion-metrics'
import type { DireccionFlatRow } from '../lib/flatten-tree'
import type { CurrencyView } from '@/data/reporteria'
import { VarianceValue } from './direccion-variance-cell'

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

interface DireccionRowProps {
  row: DireccionFlatRow
  zebra: boolean
  vista: CurrencyView
  vistaNumero: VistaNumero
}

export function DireccionRow({ row, zebra, vista, vistaNumero }: DireccionRowProps) {
  const { depth, node, hasChildren, isOpen, onToggle } = row
  const m = computeDireccionMetrics(node)
  const style = DEPTH_STYLES[depth]
  const rowBg = depth < 2 ? (isOpen ? style.open : '') : zebra ? 'bg-[#F8FAFC]' : 'bg-white'
  const isDolar = vista === 'dolar'
  const fmt = (v: number) => {
    const converted = isDolar ? toUSD(v) : v
    return vistaNumero === 'millones' ? formatMillones(converted) : formatNumber(converted)
  }

  return (
    <tr className={`border-t border-border-table ${rowBg} transition-colors hover:bg-surface-hover`}>
      <td className={`p-[9px_10px] text-left ${style.text}`}>
        <span className={`inline-flex items-center gap-1.5 ${style.pad}`}>
          {hasChildren && onToggle ? <ChevronButton open={isOpen} onClick={onToggle} /> : <span className="inline-block w-[18px]" />}
          {node.nombre}
        </span>
      </td>
      <td className={`${tdR} ${bord} ${style.text}`}>{fmt(node.real)}</td>
      <td className={`${tdR} text-muted-foreground`}>{formatPercentCL(m.sIngresosReal)}</td>
      <td className={`${tdR} ${bord} ${style.text}`}>{fmt(node.plan)}</td>
      <td className={`${tdR} text-muted-foreground`}>{formatPercentCL(m.sIngresosPlan)}</td>
      <td className={`${tdR} ${bord}`}><VarianceValue value={m.varVsPlan} bold={depth === 0} isDolar={isDolar} vistaNumero={vistaNumero} /></td>
      <td className={tdR}><VarianceValue value={m.varPct} percent bold={depth === 0} /></td>
      <td className={`${tdR} ${bord} ${style.text}`}>{fmt(node.realAnterior)}</td>
      <td className={`${tdR} text-muted-foreground`}>{formatPercentCL(m.sIngresosAnterior)}</td>
      <td className={`${tdR} ${bord}`}><VarianceValue value={m.varAA} bold={depth === 0} isDolar={isDolar} vistaNumero={vistaNumero} /></td>
      <td className={tdR}><VarianceValue value={m.varAAPct} percent bold={depth === 0} /></td>
    </tr>
  )
}

export function DireccionTotalRow({ totals, vista, vistaNumero }: { totals: DireccionLeaf; vista: CurrencyView; vistaNumero: VistaNumero }) {
  const m = computeDireccionMetrics(totals)
  const isDolar = vista === 'dolar'
  const fmt = (v: number) => {
    const converted = isDolar ? toUSD(v) : v
    return vistaNumero === 'millones' ? formatMillones(converted) : formatNumber(converted)
  }

  return (
    <tr className="border-t-2 border-border-table-strong bg-[#F8FAFC]">
      <td className="p-[10px] text-left text-[14px] font-bold text-foreground">
        <span className="inline-flex items-center gap-1.5 pl-2">
          <span className="inline-block w-[18px]" />
          {totals.nombre}
        </span>
      </td>
      <td className={`${tdR} ${bord} font-bold text-foreground`}>{fmt(totals.real)}</td>
      <td className={`${tdR} font-semibold text-muted-foreground`}>{formatPercentCL(m.sIngresosReal)}</td>
      <td className={`${tdR} ${bord} font-bold text-foreground`}>{fmt(totals.plan)}</td>
      <td className={`${tdR} font-semibold text-muted-foreground`}>{formatPercentCL(m.sIngresosPlan)}</td>
      <td className={`${tdR} ${bord}`}><VarianceValue value={m.varVsPlan} bold isDolar={isDolar} vistaNumero={vistaNumero} /></td>
      <td className={tdR}><VarianceValue value={m.varPct} percent bold /></td>
      <td className={`${tdR} ${bord} font-bold text-foreground`}>{fmt(totals.realAnterior)}</td>
      <td className={`${tdR} font-semibold text-muted-foreground`}>{formatPercentCL(m.sIngresosAnterior)}</td>
      <td className={`${tdR} ${bord}`}><VarianceValue value={m.varAA} bold isDolar={isDolar} vistaNumero={vistaNumero} /></td>
      <td className={tdR}><VarianceValue value={m.varAAPct} percent bold /></td>
    </tr>
  )
}
