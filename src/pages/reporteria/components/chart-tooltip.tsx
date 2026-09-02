import { formatTableAmount } from '@/shared/lib/format'
import { CHART_W, chartScale, type ChartMonth } from '../lib/chart-geometry'

export interface TooltipState {
  mi: number
}

interface ChartTooltipProps {
  tooltip: TooltipState
  months: ChartMonth[]
  isDolar: boolean
}

export function ChartTooltip({ tooltip, months, isDolar }: ChartTooltipProps) {
  const m = months[tooltip.mi]
  if (!m) return null
  const scale = chartScale(months)
  const leftPct = (scale.monthCx(tooltip.mi) / CHART_W) * 100
  const suffix = isDolar ? ' US$' : ''
  const fmt = (v: number) => formatTableAmount(v) + suffix
  const flip = leftPct > 65

  return (
    <div
      className="pointer-events-none absolute top-2 z-10 min-w-[150px] rounded-lg bg-[rgba(30,30,30,0.93)] p-[10px_14px] text-white shadow-[0_6px_24px_rgba(0,0,0,0.38)]"
      style={{ left: `${leftPct}%`, transform: flip ? 'translateX(-100%)' : 'none' }}
    >
      <div className="mb-1.5 border-b border-white/10 pb-1 text-[13px] font-semibold">{m.label}</div>
      <div className="flex items-center justify-between gap-2 text-[11px]">
        <span className="flex items-center gap-1.5 text-[#D0D0D0]">
          <span className="inline-block size-2 rounded-full bg-primary" />
          Plan
        </span>
        <span className="font-medium whitespace-nowrap">{fmt(m.plan)}</span>
      </div>
      <div className="mt-1 flex items-center justify-between gap-2 text-[11px]">
        <span className="flex items-center gap-1.5 text-[#A0A0A0]">
          <span className="inline-block size-2 rounded-full bg-primary opacity-45" />
          Forecast
        </span>
        <span className="font-normal whitespace-nowrap text-[#E0E0E0]">{fmt(m.fBase)}</span>
      </div>
    </div>
  )
}
