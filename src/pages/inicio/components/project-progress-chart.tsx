import { formatCompact } from '@/shared/lib/format'
import { computeReportingKpis, ULTIMO_REAL_LABEL, MES_ABIERTO_LABEL } from '../lib/dashboard-metrics'
import { buildProgressChartScale, CHART_H, CHART_W, PAD_L } from '../lib/progress-chart-scale'
import type { FaseMes } from '../lib/dashboard-metrics'

const FASE_COLOR: Record<FaseMes, string> = {
  real: '#067647',
  preliminar: '#B45309',
  forecast: '#0047B0',
}

const FASE_LABEL: Record<FaseMes, string> = {
  real: 'Real',
  preliminar: 'Preliminar',
  forecast: 'Forecast + IPC',
}

export function ProjectProgressChart() {
  const kpi = computeReportingKpis()
  const { points } = kpi
  const values = points.flatMap((p) => [p.plan, p.valor])
  const scale = buildProgressChartScale(values, points.length)
  const zeroY = scale.yVal(0)
  const cutoffIndex = points.findIndex((p) => p.fase !== 'real')
  const cutoffX = cutoffIndex >= 0 ? PAD_L + ((CHART_W - PAD_L - 12) / points.length) * cutoffIndex : null

  return (
    <div className="mx-8 mb-5.5 overflow-hidden rounded-2xl border border-border-table bg-white">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border p-[14px_18px_12px]">
        <div>
          <div className="text-[13.5px] font-bold text-foreground">Avance del proyecto a la fecha</div>
          <div className="text-[11.5px] text-muted-foreground">
            Plan (Reportería) vs. ejecución real hasta {ULTIMO_REAL_LABEL} · Preliminar {MES_ABIERTO_LABEL} · Forecast con IPC ({kpi.activeRoundTitulo})
          </div>
        </div>
        <div className="text-right text-[11.5px] text-muted-foreground">
          Avance a la fecha <span className="font-bold text-foreground">{kpi.avancePct.toFixed(1)}%</span> del plan YTD
        </div>
      </div>
      <div className="overflow-x-auto p-[10px_4px_6px]">
        <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} width="100%" height={CHART_H} className="block overflow-visible text-[11px]">
          {scale.yTicks.map((v, i) => (
            <g key={i}>
              <line x1={PAD_L} y1={scale.yVal(v)} x2={CHART_W - 12} y2={scale.yVal(v)} stroke="#F1F5F9" strokeWidth={v === 0 ? 1.5 : 1} />
              <text x={PAD_L - 8} y={scale.yVal(v) + 4} textAnchor="end" fill="#94A3B8" fontSize={9}>
                {formatCompact(v * 1000)}
              </text>
            </g>
          ))}

          {cutoffX !== null && (
            <g>
              <line x1={cutoffX} y1={scale.yVal(scale.maxVal)} x2={cutoffX} y2={zeroY} stroke="#94A3B8" strokeWidth={1} strokeDasharray="3 3" />
              <text x={cutoffX} y={scale.yVal(scale.maxVal) - 4} textAnchor="middle" fill="#94A3B8" fontSize={9} fontWeight={600}>
                Hoy
              </text>
            </g>
          )}

          {points.map((p, i) => {
            const cx = scale.monthCx(i)
            const planY = scale.yVal(p.plan)
            const valY = scale.yVal(p.valor)
            const gap = 2
            const color = FASE_COLOR[p.fase]
            return (
              <g key={p.mes}>
                <rect x={cx - scale.barW - gap / 2} y={planY} width={scale.barW} height={Math.max(zeroY - planY, 0)} rx={2} fill="#0047B0" opacity={0.28}>
                  <title>
                    {p.label} · Plan: CLP {formatCompact(p.plan * 1000)}
                  </title>
                </rect>
                <rect x={cx + gap / 2} y={valY} width={scale.barW} height={Math.max(zeroY - valY, 0)} rx={2} fill={color}>
                  <title>
                    {p.label} · {FASE_LABEL[p.fase]}: CLP {formatCompact(p.valor * 1000)}
                  </title>
                </rect>
                <text x={cx} y={CHART_H - 8} textAnchor="middle" fill="#94A3B8" fontSize={9}>
                  {p.label}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
      <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 border-t border-border p-[8px_18px_10px]">
        <LegendDot color="#0047B0" opacity={0.28} label="Plan" />
        <LegendDot color={FASE_COLOR.real} label="Real" />
        <LegendDot color={FASE_COLOR.preliminar} label="Preliminar" />
        <LegendDot color={FASE_COLOR.forecast} label="Forecast + IPC" />
      </div>
    </div>
  )
}

function LegendDot({ color, opacity = 1, label }: { color: string; opacity?: number; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] whitespace-nowrap text-muted-foreground">
      <span className="inline-block size-2 rounded-sm" style={{ background: color, opacity }} />
      {label}
    </span>
  )
}
