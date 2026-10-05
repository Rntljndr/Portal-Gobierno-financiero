import { useState } from 'react'
import { monthKeys } from '@/data/reporteria'

/** Ejemplo de servicio de rubro nómina (F: "crear el ejemplo de un servicio con rubro nómina") — solo
 * este N4 tiene tabla y gráfico de Headcount en su vista de N7; el resto de los servicios de Forecast
 * no tiene datos de dotación. Dato de demo: vive acá, no en data/forecast-lineas.ts, para no tocar el
 * modelo de datos que comparte el resto del módulo (ni el de Presupuesto/Reales). */
export const FORECAST_RUBRO_NOMINA_N4 = new Set(['N4-2027-001'])

export function esRubroNomina(n4Codigo: string): boolean {
  return FORECAST_RUBRO_NOMINA_N4.has(n4Codigo)
}

export interface ForecastHeadcountRow {
  n7Codigo: string
  n7Nombre: string
  meses: Record<string, number>
}

/** Dotación mensual de ejemplo por PEP N7 — mismos códigos que pep-n4-tablon.ts para N4-2027-001
 * (Mesa de Ayuda BPO), la tabla de referencia es la de Headcount de Presupuesto (mismo layout: PEP,
 * Ene-Dic, Total, con "Editar" habilitando los meses). */
const HEADCOUNT_SEED: Record<string, Record<string, number>> = {
  'N7-001a': { ene: 8, feb: 8, mar: 9, abr: 9, may: 9, jun: 9, jul: 9, ago: 10, sep: 10, oct: 10, nov: 10, dic: 10 },
  'N7-001b': { ene: 4, feb: 4, mar: 4, abr: 4, may: 5, jun: 5, jul: 5, ago: 5, sep: 5, oct: 5, nov: 5, dic: 5 },
}

function ceros(): Record<string, number> {
  return Object.fromEntries(monthKeys.map((k) => [k, 0]))
}

export function buildForecastHeadcountRows(n7s: { n7Codigo: string; n7Nombre: string }[]): ForecastHeadcountRow[] {
  return n7s.map((n7) => ({ n7Codigo: n7.n7Codigo, n7Nombre: n7.n7Nombre, meses: { ...ceros(), ...(HEADCOUNT_SEED[n7.n7Codigo] ?? {}) } }))
}

export function headcountTotalPorMes(rows: ForecastHeadcountRow[]): Record<string, number> {
  const total = ceros()
  for (const row of rows) {
    for (const k of monthKeys) total[k] += row.meses[k] || 0
  }
  return total
}

/** Estado editable de la tabla de Headcount (demo, en memoria — no vive en el store del round). */
export function useForecastHeadcount(n7s: { n7Codigo: string; n7Nombre: string }[]) {
  const [rows, setRows] = useState<ForecastHeadcountRow[]>(() => buildForecastHeadcountRows(n7s))

  const onChange = (n7Codigo: string, monthKey: string, valor: number) =>
    setRows((prev) => prev.map((r) => (r.n7Codigo === n7Codigo ? { ...r, meses: { ...r.meses, [monthKey]: valor } } : r)))

  return { rows, onChange }
}
