import { gitLineas, gitVentas, monthKeys, GIT_MESES_CERRADOS, GIT_NEGOCIOS, type GitLinea } from '@/data/gasto-it-v2'
import { negocioKey } from './gasto-it-alcance'

// ---------------------------------------------------------------------------
// Totales
// ---------------------------------------------------------------------------

const sum = (xs: number[]) => xs.reduce((s, v) => s + v, 0)
const acum = (xs: number[]) => sum(xs.slice(0, GIT_MESES_CERRADOS))

export interface Totales {
  planAnual: number
  planAcum: number
  realAcum: number
  /** Real de meses cerrados + forecast de meses abiertos. */
  proyeccion: number
  anioAnteriorAcum: number
  desvAcum: number
  desvAcumPct: number
  desvProy: number
  desvProyPct: number
  /** Variación del real acumulado vs. mismo período del año anterior. */
  yoyPct: number
}

export function totales(lineas: GitLinea[]): Totales {
  let planAnual = 0
  let planAcum = 0
  let realAcum = 0
  let proyeccion = 0
  let anioAnteriorAcum = 0
  for (const l of lineas) {
    planAnual += sum(l.plan)
    planAcum += acum(l.plan)
    realAcum += acum(l.realForecast)
    proyeccion += sum(l.realForecast)
    anioAnteriorAcum += acum(l.anioAnterior)
  }
  const desvAcum = realAcum - planAcum
  const desvProy = proyeccion - planAnual
  return {
    planAnual,
    planAcum,
    realAcum,
    proyeccion,
    anioAnteriorAcum,
    desvAcum,
    desvAcumPct: planAcum > 0 ? (desvAcum / planAcum) * 100 : 0,
    desvProy,
    desvProyPct: planAnual > 0 ? (desvProy / planAnual) * 100 : 0,
    yoyPct: anioAnteriorAcum > 0 ? ((realAcum - anioAnteriorAcum) / anioAnteriorAcum) * 100 : 0,
  }
}

export interface Grupo {
  key: string
  label: string
  t: Totales
}

export function agrupar(lineas: GitLinea[], keyFn: (l: GitLinea) => string, labelFn: (key: string) => string = (k) => k): Grupo[] {
  const m = new Map<string, GitLinea[]>()
  for (const l of lineas) {
    const k = keyFn(l)
    if (!m.has(k)) m.set(k, [])
    m.get(k)!.push(l)
  }
  return [...m.entries()].map(([key, ls]) => ({ key, label: labelFn(key), t: totales(ls) }))
}

// ---------------------------------------------------------------------------
// Estado del desvío (semáforo único del reporte)
// ---------------------------------------------------------------------------

export type Estado = 'sobre' | 'linea' | 'sub'

/** Sobre plan > +3 %, subejecución < −10 %, en línea entremedio. */
export function estadoDe(pct: number): Estado {
  if (pct > 3) return 'sobre'
  if (pct < -10) return 'sub'
  return 'linea'
}

export const ESTADO_META: Record<Estado, { label: string; variant: 'destructive' | 'success' | 'warning' }> = {
  sobre: { label: 'Sobre plan', variant: 'destructive' },
  linea: { label: 'En línea', variant: 'success' },
  sub: { label: 'Subejecución', variant: 'warning' },
}

// ---------------------------------------------------------------------------
// Evolución mensual acumulada
// ---------------------------------------------------------------------------

const MES_LABEL: Record<string, string> = {
  ene: 'Ene', feb: 'Feb', mar: 'Mar', abr: 'Abr', may: 'May', jun: 'Jun',
  jul: 'Jul', ago: 'Ago', sep: 'Sep', oct: 'Oct', nov: 'Nov', dic: 'Dic',
}

export interface PuntoEvolucion {
  label: string
  cerrado: boolean
  planAcum: number
  /** Real acumulado (meses cerrados) o real + forecast acumulado (meses abiertos). */
  realAcum: number
  anioAnteriorAcum: number
}

export function evolucionAcumulada(lineas: GitLinea[]): PuntoEvolucion[] {
  let p = 0
  let r = 0
  let a = 0
  return monthKeys.map((mes, i) => {
    p += sum(lineas.map((l) => l.plan[i]))
    r += sum(lineas.map((l) => l.realForecast[i]))
    a += sum(lineas.map((l) => l.anioAnterior[i]))
    return { label: MES_LABEL[mes] ?? mes, cerrado: i < GIT_MESES_CERRADOS, planAcum: p, realAcum: r, anioAnteriorAcum: a }
  })
}

// ---------------------------------------------------------------------------
// Peso del gasto IT sobre la venta
// ---------------------------------------------------------------------------

export interface PesoVenta {
  planPct: number
  realAcumPct: number
  proyPct: number
  ventaRealAcum: number
  ventaPlanAcum: number
}

export function pesoSobreVenta(lineas: GitLinea[], ventas: typeof gitVentas): PesoVenta {
  const t = totales(lineas)
  const ventaPlan = sum(ventas.map((v) => sum(v.plan)))
  const ventaPlanAcum = sum(ventas.map((v) => acum(v.plan)))
  const ventaRealAcum = sum(ventas.map((v) => acum(v.realForecast)))
  const ventaProy = sum(ventas.map((v) => sum(v.realForecast)))
  return {
    planPct: ventaPlan > 0 ? (t.planAnual / ventaPlan) * 100 : 0,
    realAcumPct: ventaRealAcum > 0 ? (t.realAcum / ventaRealAcum) * 100 : 0,
    proyPct: ventaProy > 0 ? (t.proyeccion / ventaProy) * 100 : 0,
    ventaRealAcum,
    ventaPlanAcum,
  }
}

/** Peso IT/venta de cada negocio-país — benchmark para el gerente de negocio. */
export function pesoPorNegocio() {
  return GIT_NEGOCIOS.map((n) => {
    const key = negocioKey(n.pais, n.negocio)
    const ls = gitLineas.filter((l) => negocioKey(l.pais, l.negocio) === key)
    const vs = gitVentas.filter((v) => negocioKey(v.pais, v.negocio) === key)
    return { key, label: `${n.negocio} ${n.pais}`, peso: pesoSobreVenta(ls, vs) }
  })
}
