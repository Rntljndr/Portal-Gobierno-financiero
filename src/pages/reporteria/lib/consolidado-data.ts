import { countryBudgets, countryFlags, type AnalysisGroup } from '@/data/reporteria'

const DIVISION_WEIGHTS: [string, number][] = [
  ['Supermercado', 0.38],
  ['Mejoramiento del Hogar', 0.24],
  ['Tiendas por departamento', 0.2],
  ['Retail Financiero', 0.18],
]

export function buildConsolidadoPorPais(): AnalysisGroup[] {
  return countryBudgets
    .filter((c) => !c.empty)
    .map((c) => ({
      nombre: `${countryFlags[c.pais]} ${c.pais}`,
      children: DIVISION_WEIGHTS.map(([nombre, w]) => ({
        nombre,
        plan: Math.round(c.plan * w),
        fBase: Math.round(c.fBase * w),
        fIPC: Math.round(c.fIPC * w),
      })),
    }))
}
