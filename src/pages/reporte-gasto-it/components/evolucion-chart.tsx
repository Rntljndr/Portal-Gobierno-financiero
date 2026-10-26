import { useState } from 'react'
import { GIT_MESES_CERRADOS } from '@/data/gasto-it-v2'
import { fmtPct, fmtUSD, type PuntoEvolucion } from '../lib'

const W = 760
const H = 300
const PAD = { l: 64, r: 92, t: 16, b: 30 }
const COLOR = {
  real: '#0047B0',
  plan: '#8A90A2',
  anterior: '#F97316',
  grid: '#F1F3F8',
  axis: '#E4EAF6',
  ink: '#8A90A2',
}

/** Escala "linda" para el eje Y: 4 divisiones en múltiplos de 1, 2 o 5. */
function niceMax(v: number) {
  const step = v / 4
  const pow = 10 ** Math.floor(Math.log10(step))
  const n = step / pow
  const nice = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10
  return nice * pow * 4
}

const axisLabel = (v: number) => (v >= 1e6 ? `${Math.round(v / 1e6)} M` : `${Math.round(v / 1e3)} K`)

/** Gasto acumulado del año: Real (meses cerrados) y su continuación con Forecast, contra Plan acumulado y
 * el año anterior. Un solo eje; hover con línea guía y tooltip por mes. */
export function EvolucionChart({ puntos }: { puntos: PuntoEvolucion[] }) {
  const [hover, setHover] = useState<number | null>(null)
  const yMax = niceMax(Math.max(...puntos.map((p) => Math.max(p.planAcum, p.realAcum, p.anioAnteriorAcum))))
  const iw = W - PAD.l - PAD.r
  const ih = H - PAD.t - PAD.b
  const x = (i: number) => PAD.l + (iw * i) / (puntos.length - 1)
  const y = (v: number) => PAD.t + ih - (v / yMax) * ih
  const path = (vals: [number, number][]) => vals.map(([i, v], k) => `${k ? 'L' : 'M'}${x(i)},${y(v)}`).join(' ')

  const ultimoCerrado = GIT_MESES_CERRADOS - 1
  const realPath = path(puntos.slice(0, GIT_MESES_CERRADOS).map((p, i) => [i, p.realAcum]))
  const fcPath = path(puntos.slice(ultimoCerrado).map((p, k) => [ultimoCerrado + k, p.realAcum]))
  const planPath = path(puntos.map((p, i) => [i, p.planAcum]))
  const antPath = path(puntos.map((p, i) => [i, p.anioAnteriorAcum]))
  const ticks = [0, 1, 2, 3, 4].map((k) => (yMax * k) / 4)

  const etiquetas = etiquetasFinales(puntos[puntos.length - 1], y)
  const h = hover !== null ? puntos[hover] : null

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="block overflow-visible" role="img" aria-label="Gasto acumulado: real y proyección vs. plan y año anterior">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.l} x2={W - PAD.r} y1={y(t)} y2={y(t)} stroke={t === 0 ? COLOR.axis : COLOR.grid} strokeWidth={1} />
            <text x={PAD.l - 8} y={y(t) + 4} textAnchor="end" fontSize={10.5} fill={COLOR.ink}>
              {t === 0 ? '0' : `US$ ${axisLabel(t)}`}
            </text>
          </g>
        ))}

        {/* Zona de forecast */}
        <rect x={x(ultimoCerrado)} y={PAD.t} width={x(puntos.length - 1) - x(ultimoCerrado)} height={ih} fill="#F8FAFC" />
        <line x1={x(ultimoCerrado)} x2={x(ultimoCerrado)} y1={PAD.t} y2={PAD.t + ih} stroke={COLOR.axis} strokeDasharray="3 3" />
        <text x={x(ultimoCerrado) + 6} y={PAD.t + 10} fontSize={10} fill={COLOR.ink}>
          Forecast →
        </text>

        <path d={antPath} fill="none" stroke={COLOR.anterior} strokeWidth={1.5} />
        <path d={fcPath} fill="none" stroke={COLOR.real} strokeWidth={2} strokeDasharray="4 3" />
        <path d={realPath} fill="none" stroke={COLOR.real} strokeWidth={2.5} />
        {/* Plan encima: es la referencia y suele ir pegado al real. */}
        <path d={planPath} fill="none" stroke={COLOR.plan} strokeWidth={1.5} strokeDasharray="6 4" />
        <circle cx={x(ultimoCerrado)} cy={y(puntos[ultimoCerrado].realAcum)} r={4.5} fill={COLOR.real} stroke="#fff" strokeWidth={2} />

        {etiquetas.map((e) => (
          <text key={e.key} x={W - PAD.r + 8} y={e.ly + 4} fontSize={11} fontWeight={600} fill="#455B85">
            <tspan fill={e.color}>●</tspan> {e.label}
          </text>
        ))}

        {puntos.map((p, i) => (
          <text key={p.label} x={x(i)} y={H - 8} textAnchor="middle" fontSize={10.5} fill={i === hover ? '#2F2F2F' : COLOR.ink} fontWeight={i === hover ? 600 : 400}>
            {p.label}
          </text>
        ))}

        {hover !== null && h && (
          <g pointerEvents="none">
            <line x1={x(hover)} x2={x(hover)} y1={PAD.t} y2={PAD.t + ih} stroke="#455B85" strokeWidth={1} opacity={0.35} />
            <circle cx={x(hover)} cy={y(h.planAcum)} r={4} fill={COLOR.plan} stroke="#fff" strokeWidth={2} />
            <circle cx={x(hover)} cy={y(h.anioAnteriorAcum)} r={4} fill={COLOR.anterior} stroke="#fff" strokeWidth={2} />
            <circle cx={x(hover)} cy={y(h.realAcum)} r={4.5} fill={h.cerrado ? COLOR.real : '#fff'} stroke={h.cerrado ? '#fff' : COLOR.real} strokeWidth={2} />
          </g>
        )}

        {puntos.map((p, i) => (
          <rect
            key={`hit-${p.label}`}
            x={x(i) - iw / (puntos.length - 1) / 2}
            y={PAD.t}
            width={iw / (puntos.length - 1)}
            height={ih + PAD.b}
            fill="transparent"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          />
        ))}
      </svg>

      {hover !== null && h && <EvolucionTooltip p={h} leftPct={(x(hover) / W) * 100} />}
    </div>
  )
}

/** Etiquetas directas al final de cada línea, separadas para que no choquen. */
function etiquetasFinales(ultimo: PuntoEvolucion, y: (v: number) => number) {
  const finales = [
    { key: 'real', label: 'Proyección', v: ultimo.realAcum, color: COLOR.real },
    { key: 'plan', label: 'Plan', v: ultimo.planAcum, color: COLOR.plan },
    { key: 'ant', label: 'Año anterior', v: ultimo.anioAnteriorAcum, color: COLOR.anterior },
  ].sort((a, b) => b.v - a.v)
  let prevY = -Infinity
  return finales.map((f) => {
    const ly = Math.max(y(f.v), prevY + 14)
    prevY = ly
    return { ...f, ly }
  })
}

function EvolucionTooltip({ p, leftPct }: { p: PuntoEvolucion; leftPct: number }) {
  return (
    <div
      className="pointer-events-none absolute top-2 z-10 min-w-[190px] rounded-lg bg-[rgba(30,30,30,0.93)] p-[10px_14px] text-white shadow-[0_6px_24px_rgba(0,0,0,0.38)]"
      style={{ left: `${leftPct}%`, transform: leftPct > 60 ? 'translateX(calc(-100% - 12px))' : 'translateX(12px)' }}
    >
      <div className="mb-1.5 border-b border-white/10 pb-1 text-[13px] font-semibold">
        Acumulado a {p.label} {p.cerrado ? '' : '(con forecast)'}
      </div>
      {[
        { label: p.cerrado ? 'Real' : 'Real + forecast', v: p.realAcum, color: COLOR.real },
        { label: 'Plan', v: p.planAcum, color: COLOR.plan },
        { label: 'Año anterior', v: p.anioAnteriorAcum, color: COLOR.anterior },
      ].map((r) => (
        <div key={r.label} className="mt-1 flex items-center justify-between gap-3 text-[11.5px]">
          <span className="flex items-center gap-1.5 text-[#D0D0D0]">
            <span className="inline-block size-2 rounded-full" style={{ background: r.color }} />
            {r.label}
          </span>
          <span className="font-medium tabular-nums">{fmtUSD(r.v)}</span>
        </div>
      ))}
      <div className="mt-1.5 border-t border-white/10 pt-1 text-[11.5px] text-[#D0D0D0]">
        Desvío vs. plan: <b className="text-white">{fmtPct(p.planAcum > 0 ? ((p.realAcum - p.planAcum) / p.planAcum) * 100 : 0, true)}</b>
      </div>
    </div>
  )
}

/** Leyenda del gráfico (siempre visible; los nombres también van rotulados al final de cada línea). */
export function EvolucionLegend() {
  return (
    <div className="flex flex-wrap items-center gap-4 text-[11.5px] text-cs-gris-oscuro">
      <span className="flex items-center gap-1.5">
        <svg width="22" height="8" aria-hidden>
          <line x1="0" x2="22" y1="4" y2="4" stroke={COLOR.real} strokeWidth="2.5" />
        </svg>
        Real
      </span>
      <span className="flex items-center gap-1.5">
        <svg width="22" height="8" aria-hidden>
          <line x1="0" x2="22" y1="4" y2="4" stroke={COLOR.real} strokeWidth="2" strokeDasharray="4 3" />
        </svg>
        Forecast
      </span>
      <span className="flex items-center gap-1.5">
        <svg width="22" height="8" aria-hidden>
          <line x1="0" x2="22" y1="4" y2="4" stroke={COLOR.plan} strokeWidth="2" strokeDasharray="6 4" />
        </svg>
        Plan
      </span>
      <span className="flex items-center gap-1.5">
        <svg width="22" height="8" aria-hidden>
          <line x1="0" x2="22" y1="4" y2="4" stroke={COLOR.anterior} strokeWidth="1.5" />
        </svg>
        Año anterior
      </span>
    </div>
  )
}
