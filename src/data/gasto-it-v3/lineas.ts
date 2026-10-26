import { V3_MESES_CERRADOS, V3_NEGOCIOS, V3_SERVICIOS, type V3Pais, type V3Rubro } from './catalogo'

/** Una línea de gasto = un servicio asignado a un negocio en un país. Montos en USD por mes (12). */
export interface V3Linea {
  id: string
  pais: V3Pais
  negocio: string
  gerencia: string
  equipo: string
  rubro: V3Rubro
  cuentaContable: string
  servicio: string
  responsable: string
  plan: number[]
  /** Real en meses cerrados; Forecast vigente en meses abiertos. Un forecast igual al plan = mes sin actualizar. */
  realForecast: number[]
  realAnioAnterior: number[]
}

/** PRNG determinístico (mulberry32): el mock no cambia entre recargas. */
export function rng(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const ESTACIONALIDAD = [0.9, 0.88, 0.95, 0.97, 1, 0.98, 1, 1.02, 1.03, 1.05, 1.08, 1.14]
const IT_SOBRE_VENTA = 0.016

/** Desvíos sembrados para que el reporte tenga focos realistas. `desde` = índice de mes en que nace;
 * `forecast`: 'sigue' (el forecast ya recoge el desvío) o 'pendiente' (el forecast sigue igual al plan). */
interface Shock {
  pais?: V3Pais
  negocio?: string
  rubro?: V3Rubro
  servicio?: string
  factor: number
  desde: number
  forecast: 'sigue' | 'pendiente'
}

const SHOCKS: Shock[] = [
  { pais: 'Colombia', rubro: 'Cloud', factor: 1.6, desde: 3, forecast: 'pendiente' },
  { pais: 'Chile', negocio: 'Jumbo', rubro: 'Cloud', factor: 1.16, desde: 2, forecast: 'sigue' },
  { pais: 'Chile', negocio: 'Paris', rubro: 'Licencias', factor: 1.15, desde: 1, forecast: 'sigue' },
  { pais: 'Argentina', servicio: 'Enlaces y comunicaciones', factor: 1.28, desde: 0, forecast: 'sigue' },
  { pais: 'Brasil', servicio: 'Amortización proyecto Omnicanal', factor: 0.62, desde: 2, forecast: 'sigue' },
  { pais: 'Perú', negocio: 'Metro', servicio: 'Procesamiento de pagos', factor: 1.12, desde: 5, forecast: 'sigue' },
  // Sin desvío en el real, pero con forecast sin actualizar (lo verá el gestor de gasto).
  { pais: 'Chile', negocio: 'Santa Isabel', rubro: 'Cloud', factor: 1, desde: 0, forecast: 'pendiente' },
  { pais: 'Argentina', servicio: 'Microsoft 365', factor: 1, desde: 0, forecast: 'pendiente' },
]

const matches = (s: Shock, pais: V3Pais, negocio: string, rubro: V3Rubro, servicio: string) =>
  (!s.pais || s.pais === pais) && (!s.negocio || s.negocio === negocio) && (!s.rubro || s.rubro === rubro) && (!s.servicio || s.servicio === servicio)

function serie(plan: number[], shock: Shock | undefined, rand: () => number): number[] {
  return plan.map((v, i) => {
    const cerrado = i < V3_MESES_CERRADOS
    if (!cerrado && shock?.forecast === 'pendiente') return v
    const f = shock && i >= shock.desde ? shock.factor : 1
    const ruido = cerrado ? 0.975 + rand() * 0.04 : 0.99 + rand() * 0.02
    return v * f * ruido
  })
}

function build(): V3Linea[] {
  const rand = rng(3033)
  const sumEst = ESTACIONALIDAD.reduce((s, v) => s + v, 0)
  const lineas: V3Linea[] = []
  for (const n of V3_NEGOCIOS) {
    const itAnual = n.ventaAnualMM * 1e6 * IT_SOBRE_VENTA
    for (const s of V3_SERVICIOS) {
      // No todos los negocios contratan todos los servicios (nómina y M365 sí, siempre).
      if (s.rubro !== 'Nómina' && s.servicio !== 'Microsoft 365' && rand() < 0.12) continue
      const anual = itAnual * s.peso * (0.88 + rand() * 0.24)
      const plan = ESTACIONALIDAD.map((e) => (anual * e) / sumEst)
      const shock = SHOCKS.find((x) => matches(x, n.pais, n.negocio, s.rubro, s.servicio))
      const realForecast = serie(plan, shock, rand)
      lineas.push({
        id: `${n.pais}|${n.negocio}|${s.servicio}`,
        pais: n.pais,
        negocio: n.negocio,
        gerencia: s.gerencia,
        equipo: s.equipo,
        rubro: s.rubro,
        cuentaContable: s.cuentaContable,
        servicio: s.servicio,
        responsable: s.responsable,
        plan,
        realForecast,
        realAnioAnterior: plan.map((v) => v * (0.88 + rand() * 0.07)),
      })
    }
  }
  return lineas
}

export const v3Lineas: V3Linea[] = build()

/** Venta (ingresos) por negocio-país, USD por mes. DATO PENDIENTE: no existe aún la fuente; valores de ejemplo. */
export interface V3Venta {
  pais: V3Pais
  negocio: string
  plan: number[]
  realForecast: number[]
}

const TENDENCIA_VENTA: Record<string, number> = { 'Chile|Jumbo': 1.07, 'Chile|Paris': 0.94, 'Chile|Easy': 0.95, 'Perú|Metro': 1.04 }

export const v3Ventas: V3Venta[] = (() => {
  const rand = rng(91)
  const sumEst = ESTACIONALIDAD.reduce((s, v) => s + v, 0)
  return V3_NEGOCIOS.map((n) => {
    const plan = ESTACIONALIDAD.map((e) => (n.ventaAnualMM * 1e6 * e) / sumEst)
    const t = TENDENCIA_VENTA[`${n.pais}|${n.negocio}`] ?? 0.99 + rand() * 0.02
    return { pais: n.pais, negocio: n.negocio, plan, realForecast: plan.map((v) => v * t * (0.99 + rand() * 0.02)) }
  })
})()
