import { useState } from 'react'
import { Icon } from '@/shared/ui'
import { monthlyBase, monthKeys, monthLabelsShort } from '@/data/reporteria'
import { toUSD } from '@/shared/lib/format'
import { CHART_W, CHART_H, PAD_L, chartScale, fmtK, type ChartMonth } from '../lib/chart-geometry'
import { ChartBars, ChartDots } from './chart-marks'
import { ChartTooltip, type TooltipState } from './chart-tooltip'

interface PlanForecastChartProps {
  title: string
  selMonths: Record<string, boolean>
  isDolar?: boolean
}

export function PlanForecastChart({ title, selMonths, isDolar = false }: PlanForecastChartProps) {
  const [mode, setMode] = useState<'bars' | 'dots'>('bars')
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)

  const months: ChartMonth[] = monthlyBase
    .filter((d) => selMonths[d.mes])
    .map((d) => ({
      mes: d.mes,
      label: monthLabelsShort[monthKeys.indexOf(d.mes)] ?? d.mes,
      plan: isDolar ? toUSD(d.plan) : d.plan,
      fBase: isDolar ? toUSD(d.fBase) : d.fBase,
    }))
  const scale = chartScale(months)

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white">
      <div className="flex items-center justify-between border-b border-border p-[12px_16px_10px]">
        <span className="text-[13px] font-bold text-foreground">{title}</span>
        <ChartModeToggle mode={mode} onChange={setMode} />
      </div>
      <div className="relative min-h-0 flex-1 overflow-x-auto p-[8px_0_12px]">
        {months.length === 0 ? (
          <div className="p-6 text-center text-xs text-muted-foreground">Sin datos para el período seleccionado</div>
        ) : (
          <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} width="100%" height="100%" className="block overflow-visible font-inherit text-[11px]">
            {scale.yTicks.map((v, i) => (
              <g key={i}>
                <line x1={PAD_L} y1={scale.yVal(v)} x2={PAD_L + scale.chartW} y2={scale.yVal(v)} stroke="#F1F5F9" strokeWidth={v === 0 ? 1.5 : 1} />
                <text x={PAD_L - 6} y={scale.yVal(v) + 4} textAnchor="end" fill="#94A3B8" fontSize={9}>
                  {fmtK(v)}
                </text>
              </g>
            ))}
            {mode === 'bars' ? (
              <ChartBars months={months} scale={scale} onHover={setTooltip} />
            ) : (
              <ChartDots months={months} scale={scale} onHover={setTooltip} />
            )}
            {months.map((m, mi) => (
              <text key={m.mes} x={scale.monthCx(mi)} y={CHART_H - 36 + 16} textAnchor="middle" fill="#94A3B8" fontSize={9}>
                {m.label}
              </text>
            ))}
          </svg>
        )}
        {tooltip && <ChartTooltip tooltip={tooltip} months={months} isDolar={isDolar} />}
      </div>
      <ChartLegend />
    </div>
  )
}

function ChartModeToggle({ mode, onChange }: { mode: 'bars' | 'dots'; onChange: (m: 'bars' | 'dots') => void }) {
  return (
    <div className="flex overflow-hidden rounded-md border border-border">
      {(['bars', 'dots'] as const).map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => onChange(m)}
          className={`flex min-w-[64px] items-center justify-center gap-1 p-[4px_10px] text-[11px] ${m === 'dots' ? 'border-l border-border' : ''} ${mode === m ? 'bg-primary text-white' : 'bg-white text-muted-foreground'}`}
        >
          {m === 'bars' ? <Icon name="chart" size={12} color={mode === m ? '#fff' : '#64748B'} /> : <span className="text-sm leading-none">•</span>}
          {m === 'bars' ? 'Barras' : 'Puntos'}
        </button>
      ))}
    </div>
  )
}

function ChartLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 border-t border-border p-[8px_16px_10px]">
      <LegendDot opacity={1} label="Plan" />
      <LegendDot opacity={0.45} label="Forecast" />
    </div>
  )
}

function LegendDot({ opacity, label }: { opacity: number; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] whitespace-nowrap text-muted-foreground">
      <span className="inline-block size-2 rounded-sm bg-primary" style={{ opacity }} />
      {label}
    </span>
  )
}
