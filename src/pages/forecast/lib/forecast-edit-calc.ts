import { monthKeys, pepN4Tablon } from '@/data/reporteria'
import type { ForecastN4Linea, ForecastN7Linea } from '@/data/forecast-lineas'
import type { ResumenTotals } from '@/shared/lib/resumen-blocks'

export function calcN4Meses(n4: ForecastN4Linea): Record<string, number> {
  const meses: Record<string, number> = {}
  monthKeys.forEach((k) => {
    meses[k] = n4.n7.reduce((s, n7) => s + (n7.meses[k] || 0), 0)
  })
  return meses
}

function findPlanN4Row(codigo: string) {
  return pepN4Tablon.find((n4) => n4.codigo === codigo)
}

export function findPlanN4(codigo: string): Record<string, number> {
  return findPlanN4Row(codigo)?.meses ?? {}
}

export function findPlanN7(n4Codigo: string, n7Codigo: string): Record<string, number> {
  return findPlanN4Row(n4Codigo)?.children.find((n7) => n7.codigo === n7Codigo)?.meses ?? {}
}

function calcTotalsFromMeses(meses: Record<string, number>, plan: Record<string, number>, cutoff: number): ResumenTotals {
  const planTotal = monthKeys.reduce((s, k) => s + (plan[k] || 0), 0)
  const real = monthKeys.slice(0, cutoff).reduce((s, k) => s + (meses[k] || 0), 0)
  const forecast = monthKeys.slice(cutoff).reduce((s, k) => s + (meses[k] || 0), 0)
  const realMasForecast = real + forecast
  const desvio = realMasForecast - planTotal
  const pctDesvio = planTotal > 0 ? (desvio / planTotal) * 100 : 0
  const planAcum = (planTotal * cutoff) / 12
  const desvioAcumMonto = real - planAcum
  const desvioAcumPct = planAcum > 0 ? (desvioAcumMonto / planAcum) * 100 : null
  return { plan: planTotal, real, realMasForecast, desvio, pctDesvio, planAcum, desvioAcumMonto, desvioAcumPct }
}

export function calcN4Totals(n4: ForecastN4Linea, cutoff: number): ResumenTotals {
  return calcTotalsFromMeses(calcN4Meses(n4), findPlanN4(n4.n4Codigo), cutoff)
}

export function calcN7Totals(n4Codigo: string, n7: ForecastN7Linea, cutoff: number): ResumenTotals {
  return calcTotalsFromMeses(n7.meses, findPlanN7(n4Codigo, n7.n7Codigo), cutoff)
}

/** Agrega un conjunto de totales y recalcula el desvío sobre el agregado (nunca promedia porcentajes). Análogo a reales-calc.ts#sumTotals. */
function aggregateTotals(items: ResumenTotals[]): ResumenTotals {
  const acc = items.reduce(
    (a, t) => ({ plan: a.plan + t.plan, real: a.real + t.real, realMasForecast: a.realMasForecast + t.realMasForecast, planAcum: a.planAcum + t.planAcum }),
    { plan: 0, real: 0, realMasForecast: 0, planAcum: 0 },
  )
  const desvio = acc.realMasForecast - acc.plan
  const pctDesvio = acc.plan > 0 ? (desvio / acc.plan) * 100 : 0
  const desvioAcumMonto = acc.real - acc.planAcum
  const desvioAcumPct = acc.planAcum > 0 ? (desvioAcumMonto / acc.planAcum) * 100 : null
  return { ...acc, desvio, pctDesvio, desvioAcumMonto, desvioAcumPct }
}

export function sumN4Totals(rows: ForecastN4Linea[], cutoff: number): ResumenTotals {
  return aggregateTotals(rows.map((r) => calcN4Totals(r, cutoff)))
}

export function sumN7Totals(n4Codigo: string, rows: ForecastN7Linea[], cutoff: number): ResumenTotals {
  return aggregateTotals(rows.map((r) => calcN7Totals(n4Codigo, r, cutoff)))
}
