import { pepN4Tablon } from './reporteria'
import { pepN4Meta } from './pep-n4-meta'
import { buildSubPeps, CON_SUBPEPS, type PepSubPep } from './pep-subpeps'

export const PRELIM_MES_ANTERIOR_LABEL = 'Julio 2026'
export const PRELIM_MES_OPEN_LABEL = 'Agosto 2026'
export const PRELIM_CIERRE_DATE = '24 agosto 2026'
export const PRELIM_DIAS_FALTAN = 2

export type PrelimEstado = 'preliminar' | 'definitivo'
export type PrelimTipoActualizacion = 'automatica' | 'manual'

/** Códigos de PEP N4 cuyo preliminar del mes ya fue ingresado (el resto queda "Sin ingresar"). */
const CON_PRELIMINAR = new Set(['N4-2027-001', 'N4-2027-002', 'N4-2027-004', 'N4-2027-005', 'N4-2027-007', 'N4-2027-009', 'N4-2027-010'])
/** Códigos de N4 cuyos N7 vienen con mezcla de estados Preliminar/Definitivo (ver Ajuste 3). */
const MIXTOS = new Set(['N4-2027-002', 'N4-2027-004', 'N4-2027-007', 'N4-2027-009'])
/** N4 completamente pasado a Definitivo (todos sus N7). */
const TODO_DEFINITIVO = new Set(['N4-2027-001'])

/** Factor determinístico (leve variación real vs. forecast) usado al calcular el preliminar de cada código. */
function preliminarFactor(codigo: string): number {
  const seed = codigo.charCodeAt(codigo.length - 1)
  return 0.96 + (seed % 8) * 0.01
}

function estadoFor(n4codigo: string, n7index: number): PrelimEstado {
  if (TODO_DEFINITIVO.has(n4codigo)) return 'definitivo'
  if (MIXTOS.has(n4codigo)) return n7index === 0 ? 'definitivo' : 'preliminar'
  return 'preliminar'
}

function tipoActualizacionFor(estado: PrelimEstado, n4codigo: string, n7index: number): PrelimTipoActualizacion {
  if (estado === 'preliminar') return 'automatica'
  // Carga manual solo en el primer N7 "mixto"; el N4 completo definitivo simula una carga masiva.
  return TODO_DEFINITIVO.has(n4codigo) || n7index === 0 ? 'manual' : 'automatica'
}

export type PreliminarSubPep = PepSubPep

export interface PreliminarHeadcountRow {
  cargo: string
  equipo: string
  cantidad: number
  costoMensual: number
}

export interface PreliminarRow {
  codigo: string
  servicio: string
  pais: string
  gerenciaPadre: string
  gerencia: string
  equipo: string
  centroCosto: string
  asignacion: string
  bandera: string
  cuentaContable: string
  moneda: string
  meses: Record<string, number>
  planFactor: number
  acumReal: number
  forecastMes: number
  preliminarMes: number
  estado: PrelimEstado
  tipoActualizacion: PrelimTipoActualizacion
  subPeps?: PreliminarSubPep[]
}

export interface PreliminarN4Row extends PreliminarRow {
  children: PreliminarRow[]
  headcount: PreliminarHeadcountRow[]
}

function buildHeadcount(n4: { equipo: string; children: { equipo: string }[] }): PreliminarHeadcountRow[] {
  const equipos = [...new Set([n4.equipo, ...n4.children.map((c) => c.equipo)])]
  const cargos = ['Analista', 'Especialista', 'Líder Técnico']
  return equipos.slice(0, 3).map((equipo, i) => ({
    cargo: cargos[i % cargos.length],
    equipo,
    cantidad: 2 + (i % 3),
    costoMensual: 3200 + i * 850,
  }))
}

function buildRow(
  codigo: string,
  base: { nombre: string; pais: string; equipo: string; planFactor: number; meses: Record<string, number> },
  hasPrelim: boolean,
  estado: PrelimEstado,
  tipoActualizacion: PrelimTipoActualizacion,
  metaCodigo: string,
): PreliminarRow {
  const meta = pepN4Meta[metaCodigo]
  const acumReal = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul'].reduce((s, k) => s + (base.meses[k] || 0) * base.planFactor, 0) * 1000
  const forecastMes = base.meses.ago * 0.96 * 1000
  const preliminarMes = hasPrelim ? Math.round(forecastMes * preliminarFactor(codigo)) : 0
  return {
    codigo,
    servicio: base.nombre,
    pais: base.pais,
    equipo: base.equipo,
    ...meta,
    meses: base.meses,
    planFactor: base.planFactor,
    acumReal: Math.round(acumReal),
    forecastMes: Math.round(forecastMes),
    preliminarMes,
    estado,
    tipoActualizacion,
    subPeps: CON_SUBPEPS.has(codigo) ? buildSubPeps(codigo, base.nombre, preliminarMes || forecastMes) : undefined,
  }
}

export const preliminaresRows: PreliminarN4Row[] = pepN4Tablon.map((n4) => {
  const hasPrelim = CON_PRELIMINAR.has(n4.codigo)
  const children = n4.children.map((n7, i) => {
    const estado = estadoFor(n4.codigo, i)
    const tipoActualizacion = tipoActualizacionFor(estado, n4.codigo, i)
    return buildRow(n7.codigo, n7, hasPrelim, estado, tipoActualizacion, n4.codigo)
  })
  const n4Estado: PrelimEstado = children.every((c) => c.estado === 'definitivo') ? 'definitivo' : 'preliminar'
  return {
    ...buildRow(n4.codigo, n4, hasPrelim, n4Estado, children[0]?.tipoActualizacion ?? 'automatica', n4.codigo),
    children,
    headcount: buildHeadcount(n4),
  }
})
