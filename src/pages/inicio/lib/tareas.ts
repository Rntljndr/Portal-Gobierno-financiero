import type { IconName } from '@/shared/ui'
import { forecastRoundsIniciales } from '@/data/forecast'
import { notifications } from '@/data/notifications'
import { PRELIM_MES_OPEN_LABEL } from '@/data/preliminares'
import { CIERRE_PRESUPUESTO, diasHasta } from './accesos'
import { estadoEnCurso, estadoPlanificacion, fmtPct } from './estado-ejercicios'

export interface Tarea {
  id: string
  titulo: string
  detalle: string
  /** Fecha límite ISO; sin fecha = sin plazo definido. */
  vence?: string
  tono: 'alerta' | 'info'
  icono: IconName
  to: string
  cta: string
}

export const forecastAbierto = () => forecastRoundsIniciales.find((r) => r.estado === 'Abierto')

/** Lo que el usuario debería resolver, de lo más urgente a lo que no tiene plazo. */
export function tareasPendientes(): Tarea[] {
  const plan = estadoPlanificacion()
  const curso = estadoEnCurso()
  const fcst = forecastAbierto()
  const porRevisar = plan.porEstado['Requiere revisión'] + plan.porEstado.Borrador
  const alerta = notifications.find((n) => n.type === 'warning')
  const tareas: Tarea[] = []

  if (porRevisar > 0)
    tareas.push({ id: 'lineas', titulo: `Resolver ${porRevisar} líneas con revisión pedida`, detalle: 'Ejercicio 2027 · deben quedar enviadas antes del cierre del presupuesto', vence: CIERRE_PRESUPUESTO, tono: 'alerta', icono: 'edit', to: '/ejercicios/mis-servicios', cta: 'Revisar' })
  if (fcst)
    tareas.push({ id: 'forecast', titulo: `Actualizar el ${fcst.titulo}`, detalle: `${curso.fcstModificadas} de ${curso.lineas} líneas ya modificadas respecto del forecast anterior`, vence: fcst.fechaTermino, tono: 'info', icono: 'trendup', to: '/forecast', cta: 'Ir a Forecast' })
  tareas.push({ id: 'prelim', titulo: `Completar los preliminares de ${PRELIM_MES_OPEN_LABEL.toLowerCase()}`, detalle: `${fmtPct(curso.prelimAvancePct)} cargado contra el forecast del mes`, tono: 'info', icono: 'calendar', to: '/preliminares', cta: 'Ir a Preliminares' })
  if (alerta) tareas.push({ id: 'alerta', titulo: alerta.title, detalle: alerta.message, tono: 'alerta', icono: 'alert', to: '/notificaciones', cta: 'Ver alerta' })

  return tareas.sort((a, b) => (a.vence ? diasHasta(a.vence) : 999) - (b.vence ? diasHasta(b.vence) : 999))
}
