import { monthKeys, REALES_LAST_CLOSED, type RealesRow } from '@/data/reales'

export interface RealesTotals {
  plan: number
  real: number
  realMasForecast: number
  desvio: number
  pctDesvio: number
  planAcum: number
  desvioAcumMonto: number
  desvioAcumPct: number | null
}

export function calcMonths(row: Pick<RealesRow, 'meses' | 'planFactor'>): number[] {
  return monthKeys.map((k, i) => {
    const base = row.meses[k] || 0
    return i < REALES_LAST_CLOSED ? base * row.planFactor : base * 0.96
  })
}

export function calcTotals(row: Pick<RealesRow, 'meses' | 'planFactor'>): RealesTotals {
  const plan = monthKeys.reduce((s, k) => s + (row.meses[k] || 0), 0)
  const real = monthKeys.slice(0, REALES_LAST_CLOSED).reduce((s, k) => s + (row.meses[k] || 0) * row.planFactor, 0)
  const forecast = monthKeys.slice(REALES_LAST_CLOSED).reduce((s, k) => s + (row.meses[k] || 0) * 0.96, 0)
  const realMasForecast = real + forecast
  const desvio = realMasForecast - plan
  const pctDesvio = plan > 0 ? (desvio / plan) * 100 : 0
  const planAcum = (plan * REALES_LAST_CLOSED) / 12
  const desvioAcumMonto = real - planAcum
  const desvioAcumPct = planAcum > 0 ? (desvioAcumMonto / planAcum) * 100 : null
  return { plan, real, realMasForecast, desvio, pctDesvio, planAcum, desvioAcumMonto, desvioAcumPct }
}

/** Suma los totales de un conjunto de filas y recalcula los desvíos sobre el agregado (nunca promedia porcentajes). */
export function sumTotals(rows: Pick<RealesRow, 'meses' | 'planFactor'>[]): RealesTotals {
  const acc = rows.reduce(
    (a, r) => {
      const t = calcTotals(r)
      return { plan: a.plan + t.plan, real: a.real + t.real, realMasForecast: a.realMasForecast + t.realMasForecast, planAcum: a.planAcum + t.planAcum }
    },
    { plan: 0, real: 0, realMasForecast: 0, planAcum: 0 },
  )
  const desvio = acc.realMasForecast - acc.plan
  const pctDesvio = acc.plan > 0 ? (desvio / acc.plan) * 100 : 0
  const desvioAcumMonto = acc.real - acc.planAcum
  const desvioAcumPct = acc.planAcum > 0 ? (desvioAcumMonto / acc.planAcum) * 100 : null
  return { ...acc, desvio, pctDesvio, desvioAcumMonto, desvioAcumPct }
}

export function fmtReales(n: number, currency: string): string {
  if (currency === 'USD') return `$${Math.round(n / 1000).toLocaleString('es-CL')}K`
  return Math.round(n).toLocaleString('es-CL')
}

/** Formatea un monto que puede no ser calculable — nunca 0, siempre "—". */
export function fmtRealesOrDash(n: number | null, currency: string): string {
  return n === null ? '—' : fmtReales(n, currency)
}

export function fmtPctOrDash(pct: number | null): string {
  return pct === null ? '—' : `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`
}

export interface ComparisonSeries {
  key: 'presupuesto' | 'forecast' | 'anioAnterior'
  label: string
  /** A qué columna del bloque de resumen aporta su propio valor: Plan (Presupuesto) o Real (Forecast/Año anterior). */
  appliesTo: 'plan' | 'real'
  factor: number
  color: string
  textColor: string
  bg: string
  border: string
}

export const COMPARISON_SERIES: Record<ComparisonSeries['key'], ComparisonSeries> = {
  presupuesto: { key: 'presupuesto', label: 'Presupuesto', appliesTo: 'plan', factor: 1.0, color: '#0047B0', textColor: '#1a4a8a', bg: '#F7FAFF', border: '#C8D9F5' },
  forecast: { key: 'forecast', label: 'Forecast', appliesTo: 'real', factor: 0.97, color: '#6922E7', textColor: '#5518B8', bg: '#F8F5FF', border: '#CFC0F4' },
  anioAnterior: { key: 'anioAnterior', label: 'Año anterior', appliesTo: 'real', factor: 0.88, color: '#22976B', textColor: '#166B49', bg: '#F3FAF7', border: '#AADCC4' },
}
