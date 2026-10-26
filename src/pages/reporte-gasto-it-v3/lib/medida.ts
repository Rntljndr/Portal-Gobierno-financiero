import { V3_MESES_CERRADOS, V3_MESES_LARGOS, V3_EJERCICIO, v3Ventas, type V3Linea, type V3Rubro } from '@/data/gasto-it-v3'

/** Parámetro de lectura del reporte: el real del último mes cerrado, el acumulado a la fecha o la
 * proyección anual (real + forecast). Todo lo que está bajo las tarjetas se calcula con este período. */
export type Periodo = 'mes' | 'acum' | 'proy'

const MES_CORTE = V3_MESES_LARGOS[V3_MESES_CERRADOS - 1]
const capital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export const PERIODOS: { value: Periodo; label: string; detalle: string; real: string }[] = [
  { value: 'mes', label: 'Real del mes', detalle: `${capital(MES_CORTE)} ${V3_EJERCICIO}`, real: 'Real' },
  { value: 'acum', label: 'Real acumulado', detalle: `Enero a ${MES_CORTE} ${V3_EJERCICIO}`, real: 'Real' },
  { value: 'proy', label: 'Proyectado anual', detalle: `Real + forecast ${V3_EJERCICIO}`, real: 'Proyección' },
]

export const PERIODO_DEFAULT: Periodo = 'acum'

/** Meses que suma cada período (índices 0–11). */
function ventana(p: Periodo): [number, number] {
  if (p === 'mes') return [V3_MESES_CERRADOS - 1, V3_MESES_CERRADOS]
  if (p === 'acum') return [0, V3_MESES_CERRADOS]
  return [0, 12]
}

const suma = (xs: number[], p: Periodo) => {
  const [a, b] = ventana(p)
  return xs.slice(a, b).reduce((s, v) => s + v, 0)
}

/** Desvío = contra el plan. Variación = contra el año anterior (mismo período). */
export interface Medida {
  plan: number
  valor: number
  ant: number
  desv: number
  desvPct: number
  varAnt: number
  varPct: number
}

export function medir(lineas: V3Linea[], p: Periodo): Medida {
  let plan = 0
  let valor = 0
  let ant = 0
  for (const l of lineas) {
    plan += suma(l.plan, p)
    valor += suma(l.realForecast, p)
    ant += suma(l.realAnioAnterior, p)
  }
  const pct = (a: number, b: number) => (b > 0 ? (a / b) * 100 : 0)
  return { plan, valor, ant, desv: valor - plan, desvPct: pct(valor - plan, plan), varAnt: valor - ant, varPct: pct(valor - ant, ant) }
}

/** % del gasto IT sobre la venta de los negocios presentes, en el mismo período (venta = dato de ejemplo). */
export function pesoVenta(lineas: V3Linea[], p: Periodo): { real: number; plan: number } {
  const keys = new Set(lineas.map((l) => `${l.pais}|${l.negocio}`))
  const ventas = v3Ventas.filter((v) => keys.has(`${v.pais}|${v.negocio}`))
  const m = medir(lineas, p)
  const vReal = ventas.reduce((s, v) => s + suma(v.realForecast, p), 0)
  const vPlan = ventas.reduce((s, v) => s + suma(v.plan, p), 0)
  return { real: vReal > 0 ? (m.valor / vReal) * 100 : 0, plan: vPlan > 0 ? (m.plan / vPlan) * 100 : 0 }
}

/** Rubros agrupados como en el "Resumen por rubro" del Reporte Tecnología: Servicios, Nómina y Amortización. */
export type GrupoRubro = 'servicios' | 'nomina' | 'amortizacion'

export const GRUPOS_RUBRO: { id: GrupoRubro; label: string; rubros: V3Rubro[] }[] = [
  { id: 'servicios', label: 'Servicios', rubros: ['Cloud', 'Licencias', 'Servicios'] },
  { id: 'nomina', label: 'Nómina', rubros: ['Nómina'] },
  { id: 'amortizacion', label: 'Amortización', rubros: ['Amortizaciones'] },
]

export const enGrupo = (g: GrupoRubro | null, l: V3Linea) => !g || GRUPOS_RUBRO.find((x) => x.id === g)!.rubros.includes(l.rubro)
