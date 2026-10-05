import { forecastPaisesMoneda, type ForecastRound } from '@/data/forecast'
import { monthKeys } from '@/data/reporteria'
import type { ForecastN4Linea } from '@/data/forecast-lineas'
import { calcN4Meses, findPlanN4 } from './forecast-edit-calc'
import { formatForecastAmount } from './format-forecast-amount'

export interface ForecastCountryRow {
  pais: string
  moneda: string
  empty: boolean
  plan: string
  anterior: string
  actual: string
  /** F: "los datos para comparar se deben invertir, es forecast actual vs plan y forecast actual vs
   * forecast anterior" — Forecast actual es el sujeto fijo de ambas comparaciones. */
  varAbsPlan: string
  varPctPlan: string
  upPlan: boolean
  varAbsAnterior: string
  varPctAnterior: string
  upAnterior: boolean
}

function totalAnual(n4: ForecastN4Linea): number {
  const meses = calcN4Meses(n4)
  return monthKeys.reduce((s, k) => s + (meses[k] || 0), 0)
}

function totalPlanAnual(n4Codigo: string): number {
  const plan = findPlanN4(n4Codigo)
  return monthKeys.reduce((s, k) => s + (plan[k] || 0), 0)
}

/** Resumen por país (M2, reutiliza CountryBudgetPanel/Card de Presupuesto): forecast actual, forecast
 * anterior, plan y variaciones — sin IPC (no aplica a Forecast) y siempre en moneda de origen (sin
 * convertir entre países, a diferencia de la vista "destino" de Presupuesto). "Forecast anterior" es
 * el mismo PEP N4 en el último forecast cerrado antes del activo; si no existía ahí, cuenta como 0. */
export function buildForecastCountrySummary(activo: ForecastRound, anterior: ForecastRound | undefined): ForecastCountryRow[] {
  const anteriorByN4 = new Map((anterior?.lineas ?? []).map((n4) => [n4.n4Codigo, n4]))

  return forecastPaisesMoneda.map(({ pais, moneda }) => {
    const items = activo.lineas.filter((n4) => n4.pais === pais)
    const plan = items.reduce((s, n4) => s + totalPlanAnual(n4.n4Codigo), 0)
    const actual = items.reduce((s, n4) => s + totalAnual(n4), 0)
    const anteriorTotal = items.reduce((s, n4) => s + (anteriorByN4.has(n4.n4Codigo) ? totalAnual(anteriorByN4.get(n4.n4Codigo)!) : 0), 0)
    const varAbsPlan = actual - plan
    const varPctPlan = plan ? (varAbsPlan / plan) * 100 : 0
    const upPlan = varAbsPlan >= 0
    const varAbsAnterior = actual - anteriorTotal
    const varPctAnterior = anteriorTotal ? (varAbsAnterior / anteriorTotal) * 100 : 0
    const upAnterior = varAbsAnterior >= 0

    return {
      pais,
      moneda,
      empty: items.length === 0,
      plan: formatForecastAmount(plan),
      anterior: formatForecastAmount(anteriorTotal),
      actual: formatForecastAmount(actual),
      varAbsPlan: `${upPlan ? '+' : '−'}${formatForecastAmount(Math.abs(varAbsPlan))}`,
      varPctPlan: `${upPlan ? '+' : '−'}${Math.abs(varPctPlan).toFixed(1)}%`,
      upPlan,
      varAbsAnterior: `${upAnterior ? '+' : '−'}${formatForecastAmount(Math.abs(varAbsAnterior))}`,
      varPctAnterior: `${upAnterior ? '+' : '−'}${Math.abs(varPctAnterior).toFixed(1)}%`,
      upAnterior,
    }
  })
}
