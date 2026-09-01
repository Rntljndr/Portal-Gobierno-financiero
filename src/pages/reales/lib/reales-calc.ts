import { monthKeys, REALES_LAST_CLOSED, type RealesRow } from '@/data/reales'

export interface RealesTotals {
  plan: number
  real: number
  disponible: number
  realMasForecast: number
  desvio: number
  pctDesvio: number
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
  const disponible = plan - real
  const desvio = realMasForecast - plan
  const pctDesvio = plan > 0 ? (desvio / plan) * 100 : 0
  return { plan, real, disponible, realMasForecast, desvio, pctDesvio }
}

export function fmtReales(n: number, currency: string): string {
  if (currency === 'USD') return `$${Math.round(n / 1000).toLocaleString('es-CL')}K`
  return Math.round(n).toLocaleString('es-CL')
}

export interface ComparisonSeries {
  key: 'presupuesto' | 'forecastActual' | 'forecastAnterior' | 'anioAnterior'
  label: string
  factor: number
  color: string
  textColor: string
  bg: string
  border: string
}

export const COMPARISON_SERIES: Record<ComparisonSeries['key'], ComparisonSeries> = {
  presupuesto: { key: 'presupuesto', label: 'Presupuesto', factor: 1.0, color: '#0047B0', textColor: '#1a4a8a', bg: '#F7FAFF', border: '#C8D9F5' },
  forecastActual: { key: 'forecastActual', label: 'FC Actual', factor: 0.97, color: '#6922E7', textColor: '#5518B8', bg: '#F8F5FF', border: '#CFC0F4' },
  forecastAnterior: { key: 'forecastAnterior', label: 'FC Anterior', factor: 0.99, color: '#8A90A2', textColor: '#5C6070', bg: '#F6F6F8', border: '#CACACF' },
  anioAnterior: { key: 'anioAnterior', label: 'Año anterior', factor: 0.88, color: '#22976B', textColor: '#166B49', bg: '#F3FAF7', border: '#AADCC4' },
}
