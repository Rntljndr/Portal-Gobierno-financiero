import { useState } from 'react'
import { V3_MESES_CERRADOS } from '@/data/gasto-it-v3'
import { estadoSigno, ESTADO_META, fmtMonto, fmtPct, type Mes, type Moneda } from '../../lib'

const H = 240
const PAD = { l: 70, r: 16, t: 14, b: 28 }
/** Etiquetas del gráfico: Montserrat 12 (escala xs) en gris muted, como los ejes del design system. */
const FONT = 12

function niceMax(v: number) {
  const step = v / 4
  const pow = 10 ** Math.floor(Math.log10(step || 1))
  const n = step / pow
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * pow * 4
}

interface LineaMensualProps {
  meses: Mes[]
  moneda: Moneda
  /** Ancho del viewBox: 760 para medio ancho, ~1200 para gráficos panorámicos a ancho completo. */
  ancho?: number
}

/** Plan vs Real (meses cerrados) y Forecast (punteado) mes a mes. Cada punto real lleva el color y símbolo
 * del semáforo de ese mes, para ver en qué mes nació el desvío. Un solo eje; tooltip por mes. */
export function LineaMensual({ meses, moneda, ancho = 760 }: LineaMensualProps) {
  const W = ancho
  const [hover, setHover] = useState<number | null>(null)
  const yMax = niceMax(Math.max(...meses.map((m) => Math.max(m.plan, m.valor))) * moneda.tasa) / moneda.tasa
  const iw = W - PAD.l - PAD.r
  const ih = H - PAD.t - PAD.b
  const x = (i: number) => PAD.l + (iw * i) / (meses.length - 1)
  const y = (v: number) => PAD.t + ih - (v / yMax) * ih
  const path = (pts: [number, number][]) => pts.map(([i, v], k) => `${k ? 'L' : 'M'}${x(i)},${y(v)}`).join(' ')
  const uc = V3_MESES_CERRADOS - 1
  const pct = (m: Mes) => (m.plan > 0 ? ((m.valor - m.plan) / m.plan) * 100 : 0)

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="block overflow-visible" role="img" aria-label="Plan, real y forecast mensual">
        {[0, 1, 2, 3, 4].map((k) => {
          const v = (yMax * k) / 4
          return (
            <g key={k}>
              <line x1={PAD.l} x2={W - PAD.r} y1={y(v)} y2={y(v)} className={k ? 'stroke-border-table' : 'stroke-border-table-strong'} />
              <text x={PAD.l - 8} y={y(v) + 4} textAnchor="end" fontSize={FONT} className="fill-muted-foreground">
                {k ? fmtMonto(v, moneda) : '0'}
              </text>
            </g>
          )
        })}
        <rect x={x(uc)} y={PAD.t} width={x(meses.length - 1) - x(uc)} height={ih} className="fill-surface-subtle" />
        <text x={x(uc) + 8} y={PAD.t + 12} fontSize={FONT} className="fill-muted-foreground">
          Forecast →
        </text>
        <path d={path(meses.map((m, i) => [i, m.plan]))} fill="none" className="stroke-muted-foreground" strokeWidth={1.5} />
        <path d={path(meses.slice(uc).map((m, k) => [uc + k, m.valor]))} fill="none" className="stroke-primary" strokeWidth={2} strokeDasharray="4 4" />
        <path d={path(meses.slice(0, V3_MESES_CERRADOS).map((m, i) => [i, m.valor]))} fill="none" className="stroke-primary" strokeWidth={2} />
        {meses.map((m, i) => {
          if (!m.cerrado) return <circle key={m.label} cx={x(i)} cy={y(m.valor)} r={4} className="fill-white stroke-primary" strokeWidth={2} />
          const e = estadoSigno(pct(m))
          return <circle key={m.label} cx={x(i)} cy={y(m.valor)} r={e === 'tolerancia' ? 4 : 6} className={`stroke-white ${e === 'tolerancia' ? 'fill-primary' : ESTADO_META[e].svg}`} strokeWidth={2} />
        })}
        {meses.map((m, i) => (
          <text key={`l-${m.label}`} x={x(i)} y={H - 8} textAnchor="middle" fontSize={FONT} className={hover === i ? 'fill-foreground' : 'fill-muted-foreground'} fontWeight={hover === i ? 700 : 500}>
            {m.label}
          </text>
        ))}
        {hover !== null && <line x1={x(hover)} x2={x(hover)} y1={PAD.t} y2={PAD.t + ih} className="stroke-cs-gris-oscuro" opacity={0.3} pointerEvents="none" />}
        {meses.map((m, i) => (
          <rect key={`h-${m.label}`} x={x(i) - iw / 22} y={PAD.t} width={iw / 11} height={ih + PAD.b} fill="transparent" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} />
        ))}
      </svg>
      {hover !== null && <Tooltip m={meses[hover]} left={(x(hover) / W) * 100} moneda={moneda} pct={pct(meses[hover])} />}
    </div>
  )
}

function Tooltip({ m, left, moneda, pct }: { m: Mes; left: number; moneda: Moneda; pct: number }) {
  const e = ESTADO_META[estadoSigno(pct)]
  return (
    <div
      className="pointer-events-none absolute top-2 z-10 min-w-[180px] rounded-lg bg-foreground p-3 text-xs text-white shadow-m"
      style={{ left: `${left}%`, transform: left > 60 ? 'translateX(calc(-100% - 12px))' : 'translateX(12px)' }}
    >
      <div className="mb-2 border-b border-white/10 pb-1 text-sm font-bold">{m.label}</div>
      <div className="flex justify-between gap-3">
        <span className="text-white/75">Plan</span>
        <span className="tabular-nums">{fmtMonto(m.plan, moneda)}</span>
      </div>
      <div className="flex justify-between gap-3">
        <span className="text-white/75">{m.cerrado ? 'Real' : 'Forecast'}</span>
        <span className="tabular-nums">{fmtMonto(m.valor, moneda)}</span>
      </div>
      <div className="mt-2 border-t border-white/10 pt-1 text-white/75">
        Desvío del mes: <b className="text-white">{e.simbolo} {fmtPct(pct, true)}</b>
      </div>
    </div>
  )
}

export function LineaMensualLeyenda() {
  return (
    <div className="flex flex-wrap items-center gap-4 text-xs text-cs-gris-oscuro">
      <span className="flex items-center gap-2">
        <span className="inline-block h-0.5 w-5 bg-muted-foreground" /> Plan
      </span>
      <span className="flex items-center gap-2">
        <span className="inline-block h-0.5 w-5 bg-primary" /> Real
      </span>
      <span className="flex items-center gap-2">
        <span className="inline-block w-5 border-t-2 border-dashed border-primary" /> Forecast
      </span>
      <span className="flex items-center gap-2">
        <span className={`inline-block size-3 rounded-full ${ESTADO_META.sobre.fondo}`} /> Mes sobre plan
      </span>
      <span className="flex items-center gap-2">
        <span className={`inline-block size-3 rounded-full ${ESTADO_META.bajo.fondo}`} /> Mes bajo plan
      </span>
    </div>
  )
}
