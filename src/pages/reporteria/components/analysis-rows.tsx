import { Icon } from '@/shared/ui'
import { formatTableAmount } from '@/shared/lib/format'
import type { AnalysisChild } from '@/data/reporteria'
import { VarianceCell } from './variance-cell'

const tdR = 'p-[6px_8px] text-right tabular-nums text-xs whitespace-nowrap'
const tdL = 'p-[6px_8px] text-left text-xs'
const bord = 'border-l border-[#E2E8F0]'

function ChevronButton({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex items-center p-1 text-[#64748B]">
      <span className="inline-flex items-center transition-transform" style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}>
        <Icon name="chevron_right" size={12} color="#64748B" />
      </span>
    </button>
  )
}

export function GroupRow({ nombre, totals, open, onToggle }: { nombre: string; totals: AnalysisChild; open: boolean; onToggle: () => void }) {
  return (
    <tr className={`border-t border-border ${open ? 'bg-[#EFF6FF]' : ''}`}>
      <td className="w-6 py-0 pl-1 text-center">
        <ChevronButton open={open} onClick={onToggle} />
      </td>
      <td className={`${tdL} pl-1 font-bold`}>{nombre}</td>
      <td className={`${tdR} ${bord} font-semibold`}>{formatTableAmount(totals.plan)}</td>
      <td className={`${tdR} font-semibold`}>{formatTableAmount(totals.fBase)}</td>
      <td className={`${tdR} font-bold`}>
        <VarianceCell a={totals.fBase} b={totals.plan} pct bold />
      </td>
      <td className={`${tdR} font-bold`}>
        <VarianceCell a={totals.fBase} b={totals.plan} pct={false} bold />
      </td>
      <td className={`${tdR} ${bord} font-semibold`}>{formatTableAmount(totals.fIPC)}</td>
      <td className={`${tdR} font-bold`}>
        <VarianceCell a={totals.fIPC} b={totals.fBase} pct bold />
      </td>
      <td className={`${tdR} font-bold`}>
        <VarianceCell a={totals.fIPC} b={totals.fBase} pct={false} bold />
      </td>
    </tr>
  )
}

export function ChildRow({ child }: { child: AnalysisChild }) {
  return (
    <tr className="border-t border-[#EEF2F7] bg-[#F8FAFC]">
      <td className="w-6" />
      <td className={`${tdL} pl-5 text-[11.5px] font-semibold text-cs-gris-oscuro`}>{child.nombre}</td>
      <td className={`${tdR} ${bord} text-[11.5px]`}>{formatTableAmount(child.plan)}</td>
      <td className={`${tdR} text-[11.5px]`}>{formatTableAmount(child.fBase)}</td>
      <td className={`${tdR} font-semibold`}>
        <VarianceCell a={child.fBase} b={child.plan} pct />
      </td>
      <td className={`${tdR} font-semibold`}>
        <VarianceCell a={child.fBase} b={child.plan} pct={false} />
      </td>
      <td className={`${tdR} ${bord} text-[11.5px]`}>{formatTableAmount(child.fIPC)}</td>
      <td className={`${tdR} font-semibold`}>
        <VarianceCell a={child.fIPC} b={child.fBase} pct />
      </td>
      <td className={`${tdR} font-semibold`}>
        <VarianceCell a={child.fIPC} b={child.fBase} pct={false} />
      </td>
    </tr>
  )
}

export function TotalRow({ totals }: { totals: AnalysisChild }) {
  return (
    <tr className="border-t-2 border-border-strong bg-[#F8FAFC]">
      <td className="w-6" />
      <td className={`${tdL} font-bold text-foreground`}>Total</td>
      <td className={`${tdR} ${bord} font-bold text-foreground`}>{formatTableAmount(totals.plan)}</td>
      <td className={`${tdR} font-bold text-foreground`}>{formatTableAmount(totals.fBase)}</td>
      <td className={`${tdR} font-bold`}>
        <VarianceCell a={totals.fBase} b={totals.plan} pct bold />
      </td>
      <td className={`${tdR} font-bold`}>
        <VarianceCell a={totals.fBase} b={totals.plan} pct={false} bold />
      </td>
      <td className={`${tdR} ${bord} font-bold text-foreground`}>{formatTableAmount(totals.fIPC)}</td>
      <td className={`${tdR} font-bold`}>
        <VarianceCell a={totals.fIPC} b={totals.fBase} pct bold />
      </td>
      <td className={`${tdR} font-bold`}>
        <VarianceCell a={totals.fIPC} b={totals.fBase} pct={false} bold />
      </td>
    </tr>
  )
}
