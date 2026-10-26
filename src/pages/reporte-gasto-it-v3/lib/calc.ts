import { V3_MESES, V3_MESES_CERRADOS, v3Ventas, type V3Linea, type V3Pais } from '@/data/gasto-it-v3'

const sum = (xs: number[]) => xs.reduce((s, v) => s + v, 0)
const acum = (xs: number[]) => sum(xs.slice(0, V3_MESES_CERRADOS))

export interface Totales {
  plan: number
  planAcum: number
  real: number
  /** Real + Forecast (proyección de cierre). */
  forecast: number
  realAnioAnteriorAcum: number
  realAnioAnterior: number
  desvAcum: number
  desvAcumPct: number
  cumplimientoPct: number
  desvProy: number
  desvProyPct: number
  varAnioAnteriorPct: number
}

export function totales(lineas: V3Linea[]): Totales {
  let plan = 0
  let planAcum = 0
  let real = 0
  let forecast = 0
  let antAcum = 0
  let ant = 0
  for (const l of lineas) {
    plan += sum(l.plan)
    planAcum += acum(l.plan)
    real += acum(l.realForecast)
    forecast += sum(l.realForecast)
    antAcum += acum(l.realAnioAnterior)
    ant += sum(l.realAnioAnterior)
  }
  const pct = (a: number, b: number) => (b > 0 ? (a / b) * 100 : 0)
  return {
    plan,
    planAcum,
    real,
    forecast,
    realAnioAnteriorAcum: antAcum,
    realAnioAnterior: ant,
    desvAcum: real - planAcum,
    desvAcumPct: pct(real - planAcum, planAcum),
    cumplimientoPct: pct(real, planAcum),
    desvProy: forecast - plan,
    desvProyPct: pct(forecast - plan, plan),
    varAnioAnteriorPct: pct(real - antAcum, antAcum),
  }
}

export interface Grupo {
  key: string
  lineas: V3Linea[]
  t: Totales
}

export function agrupar(lineas: V3Linea[], keyFn: (l: V3Linea) => string): Grupo[] {
  const m = new Map<string, V3Linea[]>()
  for (const l of lineas) {
    const k = keyFn(l)
    if (!m.has(k)) m.set(k, [])
    m.get(k)!.push(l)
  }
  return [...m.entries()].map(([key, ls]) => ({ key, lineas: ls, t: totales(ls) }))
}

export interface Mes {
  label: string
  cerrado: boolean
  plan: number
  /** Real (cerrado) o forecast (abierto). */
  valor: number
  anioAnterior: number
}

export function mensual(lineas: V3Linea[]): Mes[] {
  return V3_MESES.map((label, i) => ({
    label,
    cerrado: i < V3_MESES_CERRADOS,
    plan: sum(lineas.map((l) => l.plan[i])),
    valor: sum(lineas.map((l) => l.realForecast[i])),
    anioAnterior: sum(lineas.map((l) => l.realAnioAnterior[i])),
  }))
}

/** Primer mes cerrado desde el cual el desvío mensual supera la tolerancia (en el mismo sentido) hasta el
 * corte — "en qué mes nació el desvío". null si no hay un desvío sostenido. */
export function mesOrigenDesvio(lineas: V3Linea[], tol: number): number | null {
  const meses = mensual(lineas).slice(0, V3_MESES_CERRADOS)
  const signo = (m: Mes) => {
    const p = m.plan > 0 ? ((m.valor - m.plan) / m.plan) * 100 : 0
    return p > tol ? 1 : p < -tol ? -1 : 0
  }
  const ultimo = signo(meses[meses.length - 1])
  if (!ultimo) return null
  let i = meses.length - 1
  while (i > 0 && signo(meses[i - 1]) === ultimo) i--
  return i
}

/** Meses abiertos cuyo forecast sigue igual al plan (sin actualizar por el dueño del gasto). */
export function mesesPendientes(l: V3Linea): number[] {
  return l.plan.map((p, i) => (i >= V3_MESES_CERRADOS && Math.abs(l.realForecast[i] - p) < 1e-6 ? i : -1)).filter((i) => i >= 0)
}

export interface PesoVenta {
  planPct: number
  realPct: number
  proyPct: number
  crecimientoVentaPct: number
}

/** Peso del gasto IT sobre la venta de los negocios presentes en `lineas`. Venta = dato pendiente (ejemplo). */
export function pesoSobreVenta(lineas: V3Linea[]): PesoVenta {
  const keys = new Set(lineas.map((l) => `${l.pais}|${l.negocio}`))
  const ventas = v3Ventas.filter((v) => keys.has(`${v.pais}|${v.negocio}`))
  const t = totales(lineas)
  const vPlan = sum(ventas.map((v) => sum(v.plan)))
  const vPlanAcum = sum(ventas.map((v) => acum(v.plan)))
  const vRealAcum = sum(ventas.map((v) => acum(v.realForecast)))
  const vProy = sum(ventas.map((v) => sum(v.realForecast)))
  const pct = (a: number, b: number) => (b > 0 ? (a / b) * 100 : 0)
  return {
    planPct: pct(t.plan, vPlan),
    realPct: pct(t.real, vRealAcum),
    proyPct: pct(t.forecast, vProy),
    crecimientoVentaPct: pct(vRealAcum - vPlanAcum, vPlanAcum),
  }
}

export const paisesDe = (lineas: V3Linea[]): V3Pais[] => [...new Set(lineas.map((l) => l.pais))]
