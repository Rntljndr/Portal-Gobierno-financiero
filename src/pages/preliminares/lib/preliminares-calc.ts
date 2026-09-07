import type { PrelimEstado, PreliminarRow } from '@/data/preliminares'

export function prelimFmt(n: number, moneda: string): string {
  if (moneda === 'USD') return `$${Math.round(n / 1000).toLocaleString('es-CL')}K`
  if (moneda === 'COP' || moneda === 'CLP') return `${Math.round(n / 1_000_000).toLocaleString('es-CL')}M`
  return `${Math.round(n / 1000).toLocaleString('es-CL')}K`
}

type PrelimRow = Pick<PreliminarRow, 'meses' | 'acumReal' | 'forecastMes' | 'preliminarMes'>

export interface PrelimRowTotals {
  realAcum: number
  forecastMes: number
  planMes: number
  preliminarMes: number
  desvioPlanMonto: number
  desvioPlanPct: number | null
  desvioForecastMonto: number
  desvioForecastPct: number | null
}

/** Ajuste P2: Preliminar del mes como protagonista, comparado horizontalmente contra Plan y Forecast del mes. */
export function calcPrelimRowTotals(row: PrelimRow): PrelimRowTotals {
  const planMes = (row.meses.ago || 0) * 1000
  const desvioPlanMonto = row.preliminarMes - planMes
  const desvioForecastMonto = row.preliminarMes - row.forecastMes
  return {
    realAcum: row.acumReal,
    forecastMes: row.forecastMes,
    planMes,
    preliminarMes: row.preliminarMes,
    desvioPlanMonto,
    desvioPlanPct: planMes !== 0 ? (desvioPlanMonto / planMes) * 100 : null,
    desvioForecastMonto,
    desvioForecastPct: row.forecastMes !== 0 ? (desvioForecastMonto / row.forecastMes) * 100 : null,
  }
}

/** Suma un conjunto de filas y recalcula los desvíos sobre el agregado (nunca promedia porcentajes). */
export function sumPrelimRowTotals(rows: PrelimRow[]): PrelimRowTotals {
  const acc = rows.reduce(
    (a, r) => {
      const t = calcPrelimRowTotals(r)
      return {
        realAcum: a.realAcum + t.realAcum,
        forecastMes: a.forecastMes + t.forecastMes,
        planMes: a.planMes + t.planMes,
        preliminarMes: a.preliminarMes + t.preliminarMes,
      }
    },
    { realAcum: 0, forecastMes: 0, planMes: 0, preliminarMes: 0 },
  )
  const desvioPlanMonto = acc.preliminarMes - acc.planMes
  const desvioForecastMonto = acc.preliminarMes - acc.forecastMes
  return {
    ...acc,
    desvioPlanMonto,
    desvioPlanPct: acc.planMes !== 0 ? (desvioPlanMonto / acc.planMes) * 100 : null,
    desvioForecastMonto,
    desvioForecastPct: acc.forecastMes !== 0 ? (desvioForecastMonto / acc.forecastMes) * 100 : null,
  }
}

/** KPIs de las cards principales: Preliminar del mes / Plan del mes / Forecast del mes / Desvío del mes, para cualquier nivel. */
export function calcPrelimKpis(rows: PrelimRow[]) {
  const t = sumPrelimRowTotals(rows)
  return { preliminarMes: t.preliminarMes, planMes: t.planMes, forecastMes: t.forecastMes, desvioMes: t.desvioPlanMonto, desvioMesPct: t.desvioPlanPct }
}

/** Conteo de servicios / con preliminar / definitivos para la tabla-resumen inferior, en cualquier nivel. */
export function calcPrelimStats(rows: { estado: PrelimEstado }[]) {
  return {
    total: rows.length,
    conPrelim: rows.filter((r) => r.estado === 'preliminar').length,
    definitivos: rows.filter((r) => r.estado === 'definitivo').length,
  }
}

/** Ajuste P5: % de N7 ya pasados a Definitivo dentro de un N4 — 100 solo si todos lo están. */
export function calcCompletitud(children: { estado: PrelimEstado }[]): number {
  if (children.length === 0) return 0
  return Math.round((children.filter((c) => c.estado === 'definitivo').length / children.length) * 100)
}
