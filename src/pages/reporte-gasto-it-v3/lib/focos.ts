import { V3_MESES_CERRADOS, V3_MESES_LARGOS, V3_RUBRO_META, type V3Linea, type V3Pais } from '@/data/gasto-it-v3'
import { agrupar, mesesPendientes, mesOrigenDesvio, pesoSobreVenta, totales, type Totales } from './calc'

export type Causa = 'venta' | 'forecast' | 'noPlanificado' | 'postergado'

export const CAUSA_META: Record<Causa, { label: string; accion: string }> = {
  venta: { label: 'Desvío explicado por mayor venta', accion: 'Ajustar el plan al nuevo nivel de venta y validar el supuesto con el dueño del gasto.' },
  forecast: { label: 'Forecast sin actualizar', accion: 'Pedir al dueño del gasto que actualice el forecast: hoy subestima el cierre.' },
  noPlanificado: { label: 'Gasto no planificado', accion: 'Validar con el dueño del gasto el origen del mayor gasto y si se mantiene.' },
  postergado: { label: 'Gasto postergado', accion: 'Confirmar si el gasto se posterga al próximo año y liberar o reasignar el saldo.' },
}

export interface Foco {
  id: string
  /** Qué se desvió (rubro o servicio). */
  que: string
  /** Dónde (país o negocio-país). */
  donde: string
  rubro: string
  pais: V3Pais
  negocio: string | null
  t: Totales
  desdeMes: number | null
  causa: Causa
  detalleCausa: string
  responsables: string[]
  /** Impacto estimado al cierre en USD (incluye la tendencia si el forecast no está actualizado). */
  impacto: number
}

function causaDe(ls: V3Linea[], t: Totales, rubro: string): { causa: Causa; detalle: string; impacto: number } {
  const pendientes = ls.some((l) => mesesPendientes(l).length > 0)
  const crec = pesoSobreVenta(ls).crecimientoVentaPct
  const variable = V3_RUBRO_META[rubro as keyof typeof V3_RUBRO_META]?.variable
  if (t.desvAcum < 0) return { causa: 'postergado', detalle: `Ejecuta ${Math.abs(t.desvAcumPct).toFixed(1).replace('.', ',')} % bajo el plan a la fecha.`, impacto: Math.abs(t.desvProy) }
  if (pendientes) {
    // Si la tendencia del real continúa, el cierre real superará la proyección actual.
    const restante = t.plan - t.planAcum
    const tendencia = (t.desvAcumPct / 100) * restante
    return { causa: 'forecast', detalle: `El real va ${t.desvAcumPct.toFixed(1).replace('.', ',')} % sobre plan, pero el forecast de los meses restantes sigue igual al plan.`, impacto: t.desvAcum + tendencia }
  }
  if (variable && crec > 1 && t.desvAcumPct <= crec * 2.5) {
    return { causa: 'venta', detalle: `La venta del negocio crece ${crec.toFixed(1).replace('.', ',')} % sobre plan y el rubro varía con las transacciones.`, impacto: t.desvProy * 0.5 }
  }
  return { causa: 'noPlanificado', detalle: 'No hay mayor venta ni forecast pendiente que lo explique.', impacto: t.desvProy }
}

function crearFoco(id: string, ls: V3Linea[], tol: number, donde: string, negocio: string | null): Foco {
  const t = totales(ls)
  const servicios = [...new Set(ls.map((l) => l.servicio))]
  const rubro = ls[0].rubro
  const c = causaDe(ls, t, rubro)
  return {
    id,
    que: servicios.length === 1 ? servicios[0] : rubro,
    donde,
    rubro,
    pais: ls[0].pais,
    negocio,
    t,
    desdeMes: mesOrigenDesvio(ls, tol),
    causa: c.causa,
    detalleCausa: c.detalle,
    responsables: [...new Set(ls.map((l) => l.responsable))],
    impacto: c.impacto,
  }
}

const relevante = (t: Totales, tol: number) => Math.abs(t.desvAcumPct) > tol * 2 && Math.abs(t.desvAcum) > 50_000

/** Si el desvío de un grupo se explica por un único servicio, el foco apunta a ese servicio. */
function concentrar(ls: V3Linea[], tol: number): V3Linea[] {
  const svc = agrupar(ls, (l) => l.servicio).filter((s) => relevante(s.t, tol))
  return svc.length === 1 ? svc[0].lineas : ls
}

/** Focos priorizados por impacto. Se analiza rubro × país; si el desvío está concentrado en un negocio,
 * el foco baja a ese negocio (y al servicio, si es uno solo). Máximo `max` focos. */
export function focosPriorizados(lineas: V3Linea[], tol: number, max = 5): Foco[] {
  const focos: Foco[] = []
  for (const g of agrupar(lineas, (l) => `${l.rubro}|${l.pais}`)) {
    const [, pais] = g.key.split('|')
    const negocios = agrupar(g.lineas, (l) => l.negocio).filter((n) => relevante(n.t, tol) && Math.sign(n.t.desvAcum) === Math.sign(g.t.desvAcum))
    if (relevante(g.t, tol) && negocios.length !== 1) {
      focos.push(crearFoco(g.key, concentrar(g.lineas, tol), tol, pais, null))
      continue
    }
    for (const n of negocios) focos.push(crearFoco(`${g.key}|${n.key}`, concentrar(n.lineas, tol), tol, `${n.key} ${pais}`, n.key))
  }
  return focos.sort((a, b) => Math.abs(b.impacto) - Math.abs(a.impacto)).slice(0, max)
}

export const mesLargo = (i: number | null) => (i === null ? null : V3_MESES_LARGOS[i])
export const MES_CORTE_LARGO = V3_MESES_LARGOS[V3_MESES_CERRADOS - 1]
