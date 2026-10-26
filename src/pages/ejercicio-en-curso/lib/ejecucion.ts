import { convertMoneda, getDestinos, paisLabel, paisMoneda, paises, type Pais, type Servicio } from '@/data/services'
import { REALES_LAST_CLOSED } from '@/data/reales'
import { formatCompact } from '@/shared/lib/format'
import type { CardMetric, CountryCardData } from '@/pages/mis-servicios/lib/budget-by-country'

/** Ejecución 2026 de una línea (moneda local). DATO DE EJEMPLO derivado del servicio: el forecast anual 2026
 * es su "Forecast base" (la base de la planificación 2027); plan y real acumulado se siembran por línea. */
export interface Ejecucion {
  plan: number
  real: number
  forecast: number
  desv: number
  desvPct: number
  avancePct: number
  /** Si la línea ya actualizó el forecast en edición (Forecast 2 — 2026). */
  forecastActualizado: boolean
}

function semilla(id: string) {
  let h = 2166136261
  for (const c of id) h = Math.imul(h ^ c.charCodeAt(0), 16777619)
  return ((h >>> 0) % 10000) / 10000
}

export function ejecucionDe(s: Servicio): Ejecucion {
  const r = semilla(s.id)
  const forecast = s.forecastBase
  const plan = forecast / (0.94 + r * 0.14)
  const real = forecast * (REALES_LAST_CLOSED / 12) * (0.97 + semilla(`${s.id}r`) * 0.06)
  const desv = forecast - plan
  return { plan, real, forecast, desv, desvPct: plan ? (desv / plan) * 100 : 0, avancePct: plan ? (real / plan) * 100 : 0, forecastActualizado: semilla(`${s.id}f`) > 0.35 }
}

export type EstadoLinea = 'todos' | 'sobre' | 'pendiente' | 'enPlan'

export const ESTADOS_LINEA: { key: EstadoLinea; label: string }[] = [
  { key: 'todos', label: 'Todas' },
  { key: 'sobre', label: 'Sobre plan' },
  { key: 'pendiente', label: 'Forecast pendiente' },
  { key: 'enPlan', label: 'En o bajo plan' },
]

export const cumple = (s: Servicio, e: EstadoLinea) => {
  const x = ejecucionDe(s)
  if (e === 'sobre') return x.desv > 0
  if (e === 'pendiente') return !x.forecastActualizado
  if (e === 'enPlan') return x.desv <= 0
  return true
}

const firmado = (n: number) => `${n > 0 ? '+' : n < 0 ? '−' : ''}${formatCompact(Math.abs(n))}`

function tarjeta(pais: Pais, plan: number, real: number, forecast: number, empty: boolean): CountryCardData {
  const desv = forecast - plan
  const pct = plan ? (desv / plan) * 100 : 0
  const tone = desv > 0 ? 'up' : desv < 0 ? 'down' : 'muted'
  const metricas: CardMetric[] = [
    { label: 'Plan 2026', value: formatCompact(plan) },
    { label: 'Real acumulado', value: formatCompact(real), tone: 'muted' },
    { label: 'Forecast anual', value: formatCompact(forecast), tone: 'hl' },
    'sep',
    { label: 'Desvío $', value: firmado(desv), tone },
    { label: 'Desvío %', value: `${pct > 0 ? '+' : pct < 0 ? '−' : ''}${Math.abs(pct).toFixed(1)}%`, tone },
    'sep',
    { label: 'Avance real', value: `${plan ? ((real / plan) * 100).toFixed(1) : '0.0'}%`, tone: 'ipc' },
  ]
  return { pais, label: paisLabel[pais] ?? pais.toUpperCase(), moneda: paisMoneda[pais], empty, metricas }
}

export function ejecucionPorOrigen(services: Servicio[]): CountryCardData[] {
  return paises.map((p) => {
    const xs = services.filter((s) => s.pais === p).map(ejecucionDe)
    const sum = (k: 'plan' | 'real' | 'forecast') => xs.reduce((a, x) => a + x[k], 0)
    return tarjeta(p, sum('plan'), sum('real'), sum('forecast'), xs.length === 0)
  })
}

export function ejecucionPorDestino(services: Servicio[]): CountryCardData[] {
  return paises.map((d) => {
    let plan = 0
    let real = 0
    let forecast = 0
    let hit = false
    for (const s of services) {
      const x = ejecucionDe(s)
      for (const dest of getDestinos(s).filter((g) => g.pais === d)) {
        hit = true
        const f = dest.pct / 100
        plan += convertMoneda(x.plan * f, s.pais, d)
        real += convertMoneda(x.real * f, s.pais, d)
        forecast += convertMoneda(x.forecast * f, s.pais, d)
      }
    }
    return tarjeta(d, plan, real, forecast, !hit)
  })
}
