import { monthKeys, pepN4Tablon } from '@/data/reporteria'
import type { ForecastN4Linea } from '@/data/forecast-lineas'

export interface ForecastN4PaisSegment {
  pais: string
  pct: number
}

function totalAnual(meses: Record<string, number>): number {
  return monthKeys.reduce((s, k) => s + (meses[k] || 0), 0)
}

/** Distribución por país del forecast anual de un N4 (F: "agregar este recuadro... esto está en
 * presupuesto" — mismo CountryDistributionBar que BudgetSummary/servicio-detalle, ver getDestinos).
 * Cada PEP N7 trae su propio país (pepN4Tablon), así que un N4 puede en principio repartirse entre
 * varios — con los datos semilla actuales todos los N7 de un mismo N4 comparten país, pero el cálculo
 * queda correcto si eso cambia. */
export function buildForecastN4PaisSegments(n4: ForecastN4Linea): ForecastN4PaisSegment[] {
  const seed = pepN4Tablon.find((row) => row.codigo === n4.n4Codigo)
  const totales = new Map<string, number>()
  n4.n7.forEach((n7) => {
    const pais = seed?.children.find((c) => c.codigo === n7.n7Codigo)?.pais ?? n4.pais
    totales.set(pais, (totales.get(pais) ?? 0) + totalAnual(n7.meses))
  })
  const total = [...totales.values()].reduce((s, v) => s + v, 0)
  return [...totales.entries()].map(([pais, monto]) => ({ pais, pct: total > 0 ? (monto / total) * 100 : 0 }))
}
