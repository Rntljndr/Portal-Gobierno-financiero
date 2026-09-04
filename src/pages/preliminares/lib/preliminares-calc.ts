import { monthKeys } from '@/data/reporteria'
import { REALES_LAST_CLOSED } from '@/data/reales'
import type { PrelimEstado, PreliminarRow } from '@/data/preliminares'
import type { ResumenTotals } from '@/shared/lib/resumen-blocks'

export function prelimFmt(n: number, moneda: string): string {
  if (moneda === 'USD') return `$${Math.round(n / 1000).toLocaleString('es-CL')}K`
  if (moneda === 'COP' || moneda === 'CLP') return `${Math.round(n / 1_000_000).toLocaleString('es-CL')}M`
  return `${Math.round(n / 1000).toLocaleString('es-CL')}K`
}

export function prelimPct(preliminar: number, forecast: number): number | null {
  if (!forecast) return null
  return (preliminar / forecast) * 100
}

type PrelimMonthsRow = Pick<PreliminarRow, 'meses' | 'planFactor' | 'preliminarMes'>

/**
 * 12 columnas mensuales (Ajuste P4): meses cerrados = Real, mes en curso = Preliminar (no existe Real todavía),
 * meses restantes = Forecast. Mismo criterio de "meses cerrados" que Reales (REALES_LAST_CLOSED).
 */
export function calcPrelimMonths(row: PrelimMonthsRow): number[] {
  return monthKeys.map((k, i) => {
    if (i === REALES_LAST_CLOSED) return row.preliminarMes
    const base = (row.meses[k] || 0) * 1000
    return i < REALES_LAST_CLOSED ? base * row.planFactor : base * 0.96
  })
}

type PrelimTotalsRow = PrelimMonthsRow & Pick<PreliminarRow, 'acumReal'>

/** Totales de los bloques Resumen Acumulado + Proyección Anual (Ajuste P4), misma fórmula que Reales. */
export function calcPrelimTotals(row: PrelimTotalsRow): ResumenTotals {
  const months = calcPrelimMonths(row)
  const plan = monthKeys.reduce((s, k) => s + (row.meses[k] || 0) * 1000, 0)
  const real = row.acumReal
  const realMasForecast = months.reduce((s, v) => s + v, 0)
  const desvio = realMasForecast - plan
  const pctDesvio = plan > 0 ? (desvio / plan) * 100 : 0
  const planAcum = (plan * REALES_LAST_CLOSED) / 12
  const desvioAcumMonto = real - planAcum
  const desvioAcumPct = planAcum > 0 ? (desvioAcumMonto / planAcum) * 100 : null
  return { plan, real, realMasForecast, desvio, pctDesvio, planAcum, desvioAcumMonto, desvioAcumPct }
}

/** Suma los totales de un conjunto de filas y recalcula los desvíos sobre el agregado. */
export function sumPrelimTotals(rows: PrelimTotalsRow[]): ResumenTotals {
  const acc = rows.reduce(
    (a, r) => {
      const t = calcPrelimTotals(r)
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

type PrelimKpiRow = PrelimTotalsRow & Pick<PreliminarRow, 'forecastMes'>

/** KPIs de las cards principales de Preliminares (Plan/Real/Forecast del mes + Desvío acumulado), para cualquier nivel (N4, N7 o SubPEP). */
export function calcPrelimKpis(rows: PrelimKpiRow[]) {
  const totals = sumPrelimTotals(rows)
  const planMes = rows.reduce((s, r) => s + (r.meses.ago || 0) * 1000, 0)
  const forecastMes = rows.reduce((s, r) => s + r.forecastMes, 0)
  return { planMes, forecastMes, acumReal: totals.real, desvioAcumMonto: totals.desvioAcumMonto, desvioAcumPct: totals.desvioAcumPct }
}

/** Conteo de servicios / con preliminar / definitivos para la tabla-resumen inferior, en cualquier nivel. */
export function calcPrelimStats(rows: { estado: PrelimEstado }[]) {
  return {
    total: rows.length,
    conPrelim: rows.filter((r) => r.estado === 'preliminar').length,
    definitivos: rows.filter((r) => r.estado === 'definitivo').length,
  }
}
