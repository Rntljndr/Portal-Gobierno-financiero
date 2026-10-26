import { monthKeys, REALES_LAST_CLOSED, REALES_ULTIMO_REAL_LABEL } from './reales'

/** Reporte Ejercicio en Curso v2 — gasto IT de Cencosud por país, negocio, gerencia IT dueña del gasto
 * y categoría, en USD (tipo de cambio de presupuesto). Datos mock generados de forma determinística
 * (misma semilla → mismos números en cada carga); los desvíos relevantes están sembrados a propósito
 * para que el reporte tenga focos de acción realistas. */

export { monthKeys }
export const GIT_MESES_CERRADOS = REALES_LAST_CLOSED
export const GIT_CORTE_LABEL = REALES_ULTIMO_REAL_LABEL
export const GIT_EJERCICIO = 2026

export type GitPais = 'Chile' | 'Argentina' | 'Perú' | 'Colombia' | 'Brasil'

export const GIT_PAISES: GitPais[] = ['Chile', 'Argentina', 'Perú', 'Colombia', 'Brasil']

/** Negocios que opera Cencosud en cada país, con su venta anual plan en USD (millones). */
export const GIT_NEGOCIOS: { pais: GitPais; negocio: string; ventaAnualMM: number }[] = [
  { pais: 'Chile', negocio: 'Jumbo', ventaAnualMM: 3900 },
  { pais: 'Chile', negocio: 'Santa Isabel', ventaAnualMM: 1700 },
  { pais: 'Chile', negocio: 'Paris', ventaAnualMM: 1500 },
  { pais: 'Chile', negocio: 'Easy', ventaAnualMM: 900 },
  { pais: 'Argentina', negocio: 'Jumbo', ventaAnualMM: 1100 },
  { pais: 'Argentina', negocio: 'Disco', ventaAnualMM: 800 },
  { pais: 'Argentina', negocio: 'Easy', ventaAnualMM: 600 },
  { pais: 'Perú', negocio: 'Wong', ventaAnualMM: 700 },
  { pais: 'Perú', negocio: 'Metro', ventaAnualMM: 1100 },
  { pais: 'Colombia', negocio: 'Jumbo', ventaAnualMM: 650 },
  { pais: 'Colombia', negocio: 'Metro', ventaAnualMM: 450 },
  { pais: 'Colombia', negocio: 'Easy', ventaAnualMM: 300 },
  { pais: 'Brasil', negocio: 'GBarbosa', ventaAnualMM: 1300 },
  { pais: 'Brasil', negocio: 'Bretas', ventaAnualMM: 900 },
  { pais: 'Brasil', negocio: 'Prezunic', ventaAnualMM: 700 },
]

export type GitCategoria =
  | 'Cloud'
  | 'Licencias SaaS'
  | 'Comunicaciones'
  | 'Soporte y mantención'
  | 'Servicios profesionales'
  | 'Hardware'
  | 'Proyectos CAPEX'

export const GIT_CATEGORIAS: GitCategoria[] = [
  'Cloud',
  'Licencias SaaS',
  'Comunicaciones',
  'Soporte y mantención',
  'Servicios profesionales',
  'Hardware',
  'Proyectos CAPEX',
]

/** Gerencia IT dueña del gasto y gestor (dueño operativo) de cada categoría. */
export const GIT_CATEGORIA_META: Record<GitCategoria, { gerencia: string; gestor: string; proveedores: string[]; peso: number; tipo: 'OPEX' | 'CAPEX' }> = {
  Cloud: { gerencia: 'IT Infraestructura y Cloud', gestor: 'Camila Rojas', proveedores: ['AWS', 'Google Cloud', 'Azure'], peso: 0.2, tipo: 'OPEX' },
  'Licencias SaaS': { gerencia: 'IT Aplicaciones Retail', gestor: 'Tomás Herrera', proveedores: ['Microsoft 365', 'Salesforce', 'Oracle Retail'], peso: 0.18, tipo: 'OPEX' },
  Comunicaciones: { gerencia: 'IT Infraestructura y Cloud', gestor: 'Ignacio Vera', proveedores: ['Entel', 'Telefónica', 'Claro'], peso: 0.1, tipo: 'OPEX' },
  'Soporte y mantención': { gerencia: 'IT ERP y Finanzas', gestor: 'Valentina Muñoz', proveedores: ['SAP', 'Oracle', 'NCR'], peso: 0.14, tipo: 'OPEX' },
  'Servicios profesionales': { gerencia: 'IT Digital y E-commerce', gestor: 'Felipe Contreras', proveedores: ['Accenture', 'Globant', 'Sonda'], peso: 0.12, tipo: 'OPEX' },
  Hardware: { gerencia: 'IT Infraestructura y Cloud', gestor: 'Ignacio Vera', proveedores: ['Dell', 'Zebra', 'HP'], peso: 0.08, tipo: 'CAPEX' },
  'Proyectos CAPEX': { gerencia: 'IT Data y Analytics', gestor: 'Josefina Lagos', proveedores: ['Proyecto Omnicanal', 'Proyecto Data Lake', 'Proyecto Self-checkout'], peso: 0.18, tipo: 'CAPEX' },
}

export const GIT_GERENCIAS = [...new Set(Object.values(GIT_CATEGORIA_META).map((m) => m.gerencia))].sort((a, b) => a.localeCompare(b, 'es'))
export const GIT_GESTORES = [...new Set(Object.values(GIT_CATEGORIA_META).map((m) => m.gestor))].sort((a, b) => a.localeCompare(b, 'es'))

export interface GitLinea {
  id: string
  pais: GitPais
  negocio: string
  categoria: GitCategoria
  gerencia: string
  gestor: string
  proveedor: string
  tipo: 'OPEX' | 'CAPEX'
  /** USD por mes, 12 meses. */
  plan: number[]
  /** USD por mes: real en meses cerrados, forecast vigente en meses abiertos. */
  realForecast: number[]
  /** Real del mismo período del año anterior, USD por mes. */
  anioAnterior: number[]
}

/** PRNG determinístico (mulberry32) para que el mock no cambie entre recargas. */
function rng(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Desvíos sembrados: multiplicador sobre el plan del real (meses cerrados) y del forecast (abiertos). */
const SHOCKS: { pais?: GitPais; negocio?: string; categoria?: GitCategoria; real: number; forecast: number }[] = [
  { pais: 'Chile', negocio: 'Jumbo', categoria: 'Cloud', real: 1.22, forecast: 1.25 },
  { pais: 'Chile', negocio: 'Paris', categoria: 'Licencias SaaS', real: 1.16, forecast: 1.12 },
  { pais: 'Argentina', categoria: 'Comunicaciones', real: 1.28, forecast: 1.3 },
  { pais: 'Brasil', categoria: 'Proyectos CAPEX', real: 0.58, forecast: 0.85 },
  { pais: 'Perú', negocio: 'Metro', categoria: 'Servicios profesionales', real: 1.19, forecast: 0.92 },
  { pais: 'Colombia', categoria: 'Hardware', real: 0.62, forecast: 0.7 },
  { pais: 'Chile', negocio: 'Santa Isabel', categoria: 'Soporte y mantención', real: 1.12, forecast: 1.1 },
]

function shockFor(pais: GitPais, negocio: string, categoria: GitCategoria) {
  return SHOCKS.find((s) => (!s.pais || s.pais === pais) && (!s.negocio || s.negocio === negocio) && (!s.categoria || s.categoria === categoria))
}

/** Gasto IT plan ≈ 1,6% de la venta, repartido por peso de categoría y estacionalidad retail. */
const IT_SOBRE_VENTA = 0.016
const ESTACIONALIDAD = [0.9, 0.88, 0.95, 0.97, 1, 0.98, 1, 1.02, 1.03, 1.05, 1.08, 1.14]

function buildLineas(): GitLinea[] {
  const rand = rng(2026)
  const lineas: GitLinea[] = []
  for (const n of GIT_NEGOCIOS) {
    const itAnual = n.ventaAnualMM * 1e6 * IT_SOBRE_VENTA
    for (const categoria of GIT_CATEGORIAS) {
      const meta = GIT_CATEGORIA_META[categoria]
      // Cada negocio contrata 1 o 2 proveedores por categoría.
      const nProv = rand() > 0.55 ? 2 : 1
      const offset = Math.floor(rand() * meta.proveedores.length)
      for (let p = 0; p < nProv; p++) {
        const proveedor = meta.proveedores[(offset + p) % meta.proveedores.length]
        const share = nProv === 1 ? 1 : p === 0 ? 0.62 : 0.38
        const anual = itAnual * meta.peso * share * (0.85 + rand() * 0.3)
        const sumEst = ESTACIONALIDAD.reduce((s, v) => s + v, 0)
        // CAPEX de proyectos se concentra en el segundo semestre.
        const curva = meta.tipo === 'CAPEX' && categoria === 'Proyectos CAPEX' ? ESTACIONALIDAD.map((v, i) => v * (i < 6 ? 0.7 : 1.3)) : ESTACIONALIDAD
        const sumCurva = curva.reduce((s, v) => s + v, 0)
        const plan = curva.map((v) => (anual * v) / (meta.tipo === 'CAPEX' ? sumCurva : sumEst))
        const shock = shockFor(n.pais, n.negocio, categoria)
        const realForecast = plan.map((v, i) => {
          const cerrado = i < GIT_MESES_CERRADOS
          const base = shock ? (cerrado ? shock.real : shock.forecast) : 1
          const ruido = cerrado ? 0.93 + rand() * 0.12 : 0.97 + rand() * 0.05
          return v * base * ruido
        })
        const anioAnterior = realForecast.map((v) => v * (0.86 + rand() * 0.1))
        lineas.push({
          id: `${n.pais}-${n.negocio}-${categoria}-${proveedor}`.replace(/\s+/g, '-').toLowerCase(),
          pais: n.pais,
          negocio: n.negocio,
          categoria,
          gerencia: meta.gerencia,
          gestor: meta.gestor,
          proveedor,
          tipo: meta.tipo,
          plan,
          realForecast,
          anioAnterior,
        })
      }
    }
  }
  return lineas
}

export const gitLineas: GitLinea[] = buildLineas()

/** Venta mensual (USD) por negocio-país: plan y real/forecast — para el peso del gasto IT sobre la venta. */
export interface GitVentaNegocio {
  pais: GitPais
  negocio: string
  plan: number[]
  realForecast: number[]
}

function buildVentas(): GitVentaNegocio[] {
  const rand = rng(77)
  const sumEst = ESTACIONALIDAD.reduce((s, v) => s + v, 0)
  return GIT_NEGOCIOS.map((n) => {
    const plan = ESTACIONALIDAD.map((v) => (n.ventaAnualMM * 1e6 * v) / sumEst)
    // Paris y Easy venden bajo plan este año; Jumbo y Metro levemente sobre.
    const tendencia = n.negocio === 'Paris' || n.negocio === 'Easy' ? 0.93 : n.negocio === 'Jumbo' || n.negocio === 'Metro' ? 1.03 : 1
    return { pais: n.pais, negocio: n.negocio, plan, realForecast: plan.map((v) => v * tendencia * (0.98 + rand() * 0.04)) }
  })
}

export const gitVentas: GitVentaNegocio[] = buildVentas()
