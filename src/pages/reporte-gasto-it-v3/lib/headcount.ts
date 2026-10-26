import { V3_COSTO_PERSONA, V3_MESES_CERRADOS, type V3Linea } from '@/data/gasto-it-v3'

/** Headcount (personas de TI) derivado de la nómina: monto mensual ÷ costo por persona del país.
 * Es una foto, no un acumulado: plan, real y año anterior al último mes cerrado; forecast a diciembre. */
export interface Headcount {
  plan: number
  real: number
  forecast: number
  ant: number
  /** false = la selección no tiene nómina (no aplica headcount). */
  aplica: boolean
}

export function headcount(lineas: V3Linea[]): Headcount {
  const corte = V3_MESES_CERRADOS - 1
  let plan = 0
  let real = 0
  let forecast = 0
  let ant = 0
  let aplica = false
  for (const l of lineas) {
    if (l.rubro !== 'Nómina') continue
    aplica = true
    const c = V3_COSTO_PERSONA[l.pais]
    plan += l.plan[corte] / c
    real += l.realForecast[corte] / c
    forecast += l.realForecast[11] / c
    ant += l.realAnioAnterior[corte] / c
  }
  return { plan: Math.round(plan), real: Math.round(real), forecast: Math.round(forecast), ant: Math.round(ant), aplica }
}

export const fmtHc = (n: number) => n.toLocaleString('es-CL')
