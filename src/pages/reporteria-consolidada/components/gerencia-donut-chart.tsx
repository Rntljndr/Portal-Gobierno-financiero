import type { Servicio } from '@/data/services'
import type { CurrencyView } from '@/data/reporteria'
import { formatNumber } from '@/shared/lib/format'
import { buildGerenciaDistribucion } from '../lib/build-gerencia-distribucion'

/** Slots 1-3 del tema categórico validado del skill dataviz (pasan todo-contra-todo en ambos modos);
 * "Otros" usa un gris neutro a propósito — no es una 4ª categoría, es el residual. */
const COLORS = ['#2a78d6', '#eb6834', '#1baf7a']
const OTROS_COLOR = '#334155'

const R = 60
const CIRC = 2 * Math.PI * R

interface GerenciaDonutChartProps {
  servicios: Servicio[]
  vista: CurrencyView
}

export function GerenciaDonutChart({ servicios, vista }: GerenciaDonutChartProps) {
  const slices = buildGerenciaDistribucion(servicios, vista)
  const total = slices.reduce((a, s) => a + s.value, 0)

  let acc = 0
  const arcs = slices.map((s, i) => {
    const dash = (s.pct / 100) * CIRC
    const arc = { ...s, color: s.nombre === 'Otros' ? OTROS_COLOR : COLORS[i], dash, offset: -acc }
    acc += dash
    return arc
  })

  return (
    <div className="rounded-2xl border border-border bg-white p-[14px_16px]">
      <div className="mb-3">
        <div className="text-[13px] font-bold text-foreground">🍩 Distribución por Gerencia</div>
        <div className="text-xs text-muted-foreground">Participación del Nuevo Plan por gerencia (top 3 + Otros)</div>
      </div>
      <div className="flex flex-wrap items-center gap-6">
        <svg width={160} height={160} viewBox="0 0 160 160" className="shrink-0">
          <g transform="translate(80,80) rotate(-90)">
            <circle r={R} fill="none" stroke="#EEF1FB" strokeWidth={22} />
            {arcs.map((a) => (
              <circle
                key={a.nombre}
                r={R}
                fill="none"
                stroke={a.color}
                strokeWidth={22}
                strokeDasharray={`${a.dash} ${CIRC - a.dash}`}
                strokeDashoffset={a.offset}
              />
            ))}
          </g>
          <text x={80} y={76} textAnchor="middle" fontSize={13} fontWeight={800} fill="#2F2F2F">
            {formatNumber(total)}
          </text>
          <text x={80} y={92} textAnchor="middle" fontSize={9} fill="#8A90A2">
            Total
          </text>
        </svg>
        <div className="flex min-w-[160px] flex-1 flex-col gap-1.5">
          {arcs.map((a) => (
            <div key={a.nombre} className="flex items-center justify-between gap-2 text-[11.5px]">
              <span className="flex items-center gap-1.5 truncate text-foreground">
                <span className="inline-block size-2.5 shrink-0 rounded-sm" style={{ background: a.color }} />
                <span className="truncate">{a.nombre}</span>
              </span>
              <span className="shrink-0 font-semibold text-muted-foreground">{a.pct.toFixed(1).replace('.', ',')}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
