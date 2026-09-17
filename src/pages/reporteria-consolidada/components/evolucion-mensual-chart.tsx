import { useState } from 'react'
import { CHART_W, CHART_H, PAD_L, chartScale, fmtK } from '@/shared/lib/chart-geometry'
import { ChartDots, ChartTooltip, type TooltipState } from '@/shared/ui'
import { buildEvolucionMensual } from '../lib/build-evolucion-mensual'

interface EvolucionMensualChartProps {
  totalPlan: number
  totalFIPC: number
  isDolar: boolean
}

/** Línea Plan vs Forecast Base + IPC, igual al gráfico real. Ver build-evolucion-mensual.ts para la
 * limitación honesta: el mock no tiene granularidad mensual real por servicio. */
export function EvolucionMensualChart({ totalPlan, totalFIPC, isDolar }: EvolucionMensualChartProps) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)
  const months = buildEvolucionMensual(totalPlan, totalFIPC)
  const scale = chartScale(months)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white">
      <div className="border-b border-border p-[12px_16px_10px]">
        <div className="text-[13px] font-bold text-foreground">📈 Evolución mensual — Plan vs Forecast Base + IPC</div>
        <div className="text-xs text-muted-foreground">Nuevo Plan 2027 comparado con la base de comparación oficial (Forecast Base + IPC)</div>
      </div>
      <div className="relative p-[10px_0_12px]">
        <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} width="100%" height="100%" className="block overflow-visible text-[11px]">
          {scale.yTicks.map((v, i) => (
            <g key={i}>
              <line x1={PAD_L} y1={scale.yVal(v)} x2={PAD_L + scale.chartW} y2={scale.yVal(v)} stroke="#F1F5F9" strokeWidth={v === 0 ? 1.5 : 1} />
              <text x={PAD_L - 6} y={scale.yVal(v) + 4} textAnchor="end" fill="#94A3B8" fontSize={9}>
                {fmtK(v)}
              </text>
            </g>
          ))}
          <ChartDots months={months} scale={scale} onHover={setTooltip} />
          {months.map((m, mi) => (
            <text key={m.mes} x={scale.monthCx(mi)} y={CHART_H - 36 + 16} textAnchor="middle" fill="#94A3B8" fontSize={9}>
              {m.label}
            </text>
          ))}
        </svg>
        {tooltip && <ChartTooltip tooltip={tooltip} months={months} isDolar={isDolar} secondaryLabel="Forecast + IPC" />}
      </div>
      <div className="flex items-center gap-3 border-t border-border p-[8px_16px_10px]">
        <Legend label="Nuevo Plan" opacity={1} />
        <Legend label="Forecast Base + IPC" opacity={0.5} dashed />
      </div>
    </div>
  )
}

function Legend({ label, opacity, dashed }: { label: string; opacity: number; dashed?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] whitespace-nowrap text-muted-foreground">
      <svg width="14" height="6"><line x1="0" y1="3" x2="14" y2="3" stroke="#0047B0" strokeWidth="1.5" opacity={opacity} strokeDasharray={dashed ? '4 2' : undefined} /></svg>
      {label}
    </span>
  )
}
