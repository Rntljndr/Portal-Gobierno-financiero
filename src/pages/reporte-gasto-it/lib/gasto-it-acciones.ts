import type { GitCategoria, GitLinea, GitPais } from '@/data/gasto-it-v2'
import { totales } from './gasto-it-calc'
import { fmtPct, fmtUSD } from './gasto-it-format'

// ---------------------------------------------------------------------------
// Qué hacer: acciones sugeridas
// ---------------------------------------------------------------------------

export type TipoAccion = 'contener' | 'reasignar' | 'forecast'

export interface Accion {
  id: string
  tipo: TipoAccion
  titulo: string
  detalle: string
  sugerencia: string
  responsable: string
  /** Impacto estimado en USD sobre el cierre del año (siempre positivo, para ordenar). */
  impacto: number
}

const SUGERENCIA_SOBRE: Record<GitCategoria, string> = {
  Cloud: 'Revisar consumo por ambiente y activar reservas de capacidad (Savings Plans).',
  'Licencias SaaS': 'Cruzar usuarios activos vs. licencias contratadas y liberar las ociosas.',
  Comunicaciones: 'Renegociar tarifas: el ajuste por inflación supera lo presupuestado.',
  'Soporte y mantención': 'Validar renovaciones no presupuestadas antes de su próximo cobro.',
  'Servicios profesionales': 'Revisar horas consumidas vs. alcance comprometido en las órdenes de trabajo.',
  Hardware: 'Postergar compras no críticas al próximo ejercicio.',
  'Proyectos CAPEX': 'Revisar hitos del proyecto y re-planificar el gasto restante.',
}

export const TIPO_ACCION_META: Record<TipoAccion, { label: string; variant: 'destructive' | 'warning' | 'primary'; icon: 'alert' | 'trendup' | 'edit' }> = {
  contener: { label: 'Contener gasto', variant: 'destructive', icon: 'alert' },
  reasignar: { label: 'Liberar o reasignar', variant: 'warning', icon: 'trendup' },
  forecast: { label: 'Actualizar forecast', variant: 'primary', icon: 'edit' },
}

/** Reglas sobre cada combinación negocio-país × categoría:
 * - Proyección > +5 % sobre plan y > US$ 150 K → contener.
 * - Real acumulado < −20 % del plan acumulado → liberar o reasignar presupuesto.
 * - Real acumulado ejecuta > 10 % sobre plan pero el forecast vuelve bajo plan → el forecast no refleja la tendencia. */
export function accionesSugeridas(lineas: GitLinea[]): Accion[] {
  const grupos = new Map<string, GitLinea[]>()
  for (const l of lineas) {
    const k = `${l.pais}|${l.negocio}|${l.categoria}`
    if (!grupos.has(k)) grupos.set(k, [])
    grupos.get(k)!.push(l)
  }
  const acciones: Accion[] = []
  for (const [k, ls] of grupos) {
    const [pais, negocio, categoria] = k.split('|') as [GitPais, string, GitCategoria]
    const t = totales(ls)
    const quien = `${ls[0].gestor} · ${ls[0].gerencia}`
    const donde = `${categoria} — ${negocio} ${pais}`
    const planRestante = t.planAnual - t.planAcum
    const fcRestante = t.proyeccion - t.realAcum
    const ratioReal = t.planAcum > 0 ? t.realAcum / t.planAcum : 1
    const ratioFc = planRestante > 0 ? fcRestante / planRestante : 1

    if (t.desvProyPct > 5 && t.desvProy > 150_000) {
      acciones.push({
        id: `${k}-contener`,
        tipo: 'contener',
        titulo: donde,
        detalle: `Proyecta cerrar ${fmtPct(t.desvProyPct, true)} sobre plan (${fmtUSD(t.desvProy, true)}).`,
        sugerencia: SUGERENCIA_SOBRE[categoria],
        responsable: quien,
        impacto: t.desvProy,
      })
    } else if (t.desvAcumPct < -20) {
      acciones.push({
        id: `${k}-reasignar`,
        tipo: 'reasignar',
        titulo: donde,
        detalle: `Ejecuta ${fmtPct(t.desvAcumPct, true)} bajo el plan a la fecha (${fmtUSD(t.desvAcum, true)}).`,
        sugerencia: 'Confirmar si el gasto se posterga o si el saldo puede liberarse para cubrir desvíos de otras líneas.',
        responsable: quien,
        impacto: Math.abs(t.planAnual - t.proyeccion),
      })
    } else if (ratioReal > 1.1 && ratioFc < 1) {
      acciones.push({
        id: `${k}-forecast`,
        tipo: 'forecast',
        titulo: donde,
        detalle: `El real va ${fmtPct((ratioReal - 1) * 100, true)} sobre plan, pero el forecast vuelve ${fmtPct((ratioFc - 1) * 100, true)} para el resto del año.`,
        sugerencia: 'Validar con el proveedor si el mayor consumo continúa y actualizar el forecast.',
        responsable: quien,
        impacto: (ratioReal - ratioFc) * planRestante,
      })
    }
  }
  return acciones.sort((a, b) => b.impacto - a.impacto)
}
