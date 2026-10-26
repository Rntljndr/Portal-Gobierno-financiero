import type { IconName } from '@/shared/ui'
import { nextExercise } from '@/data/exercises'
import { forecastRoundsIniciales } from '@/data/forecast'
import { PRELIM_MES_OPEN_LABEL } from '@/data/preliminares'
import { REALES_ULTIMO_REAL_LABEL } from '@/data/reales'

export type GrupoAcceso = 'planificacion' | 'curso'

export interface AccesoPantalla {
  to: string
  icono: IconName
  label: string
  descripcion: string
  grupo: GrupoAcceso
  /** Palabras extra para el buscador. */
  claves?: string
}

const fcst = forecastRoundsIniciales.find((r) => r.estado === 'Abierto')
const corta = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' }).replace('.', '')

/** Pantallas de trabajo agrupadas por ejercicio: alimentan los accesos del Inicio y el buscador. */
export const ACCESOS: AccesoPantalla[] = [
  { to: '/ejercicios/mis-servicios', icono: 'edit', label: `Mis líneas ${nextExercise.year}`, descripcion: 'Revisa y envía tus líneas presupuestarias', grupo: 'planificacion', claves: 'presupuesto planificación servicios' },
  { to: '/reporte-plan', icono: 'chart', label: 'Reporte de plan', descripcion: 'Reportería planificación, Negocio y Tecnología', grupo: 'planificacion', claves: 'reportería negocio tecnología' },
  { to: '/reporte-ejercicio-curso', icono: 'chart', label: 'Reporte ejercicio en curso', descripcion: 'Gasto real, forecast y desvíos del año', grupo: 'curso', claves: 'gasto real desvío' },
  { to: '/forecast', icono: 'trendup', label: 'Forecast', descripcion: fcst ? `${fcst.titulo} · edición hasta el ${corta(fcst.fechaTermino)}` : 'Proyección del año', grupo: 'curso', claves: 'proyección' },
  { to: '/reales', icono: 'check', label: 'Reales', descripcion: `Ejecución contable SAP a ${REALES_ULTIMO_REAL_LABEL.toLowerCase()}`, grupo: 'curso', claves: 'sap contable' },
  { to: '/preliminares', icono: 'calendar', label: 'Preliminares', descripcion: `Mes abierto: ${PRELIM_MES_OPEN_LABEL.toLowerCase()}`, grupo: 'curso', claves: 'cierre contable mes' },
]

/** Días que faltan para una fecha ISO (0 si ya pasó). Mismo cálculo que los avisos de plazo del portal. */
export const diasHasta = (iso: string) => Math.max(0, Math.ceil((new Date(`${iso}T23:59:00`).getTime() - Date.now()) / 86400000))

export const fechaLarga = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString('es-CL', { day: 'numeric', month: 'long' })

/** Fecha de cierre del presupuesto del ejercicio en planificación (la misma del aviso de Mis líneas). */
export const CIERRE_PRESUPUESTO = '2026-11-01'
