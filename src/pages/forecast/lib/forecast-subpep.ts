import { buildSubPeps, CON_SUBPEPS } from '@/data/pep-subpeps'
import type { ForecastN7Linea } from '@/data/forecast-lineas'
import type { ForecastFlatN7Row } from './forecast-flat-n7'

/** F: "en el nivel 7 de los PEP, se debe agregar una columna... que diga subpep" — mismo set de códigos
 * N7 con SubPEPs que Reales/Preliminares (@/data/pep-subpeps), para que los 3 módulos coincidan. */
export function forecastN7TieneSubPeps(n7Codigo: string): boolean {
  return CON_SUBPEPS.has(n7Codigo)
}

/** SubPEP como fila N7 sintética: hereda la identidad del N7 padre (mismo n4Codigo/n4Siblings) y
 * prorratea sus meses según el peso del monto de cada SubPEP — mismo patrón que RealesSubPepPage
 * (reales/reales-subpep-page.tsx#buildSubPepRows). De solo lectura: un SubPEP no es una línea de
 * forecast propia, es una vista derivada del monto del N7 padre (F: "copia la misma tabla de N7 que
 * está actualmente"). */
export function buildForecastSubPepRows(row: ForecastFlatN7Row): ForecastFlatN7Row[] {
  const { n7 } = row
  const totalAnual = Object.values(n7.meses).reduce((s, v) => s + v, 0)
  const subPeps = buildSubPeps(n7.n7Codigo, n7.n7Nombre, totalAnual)
  const totalMonto = subPeps.reduce((s, sp) => s + sp.monto, 0) || 1
  return subPeps.map((sp) => {
    const peso = sp.monto / totalMonto
    const meses = Object.fromEntries(Object.entries(n7.meses).map(([k, v]) => [k, v * peso]))
    const subN7: ForecastN7Linea = { ...n7, n7Codigo: sp.codigo, n7Nombre: sp.nombre, meses }
    return { ...row, n7: subN7 }
  })
}
