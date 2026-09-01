import { pepN4Tablon } from './reporteria'
import { pepN4Meta } from './pep-n4-meta'

export const PRELIM_MES_OPEN_LABEL = 'Agosto 2026'
export const PRELIM_CIERRE_DATE = '24 agosto 2026'
export const PRELIM_DIAS_FALTAN = 5

/** Códigos de PEP N4 cuyo preliminar del mes ya fue ingresado (el resto queda "Sin ingresar"). */
const CON_PRELIMINAR = new Set(['N4-2027-001', 'N4-2027-002', 'N4-2027-004', 'N4-2027-005', 'N4-2027-007', 'N4-2027-009', 'N4-2027-010'])
/** Códigos ya guardados como definitivos por Control de Gestión. */
const DEFINITIVOS = new Set(['N4-2027-001'])

/** Factor determinístico (leve variación real vs. forecast) usado al calcular el preliminar de cada código. */
function preliminarFactor(codigo: string): number {
  const seed = codigo.charCodeAt(codigo.length - 1)
  return 0.96 + (seed % 8) * 0.01
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
  acumReal: number
  forecastMes: number
  preliminarMes: number
  definitivo: boolean
}

export interface PreliminarN4Row extends PreliminarRow {
  children: PreliminarRow[]
}

function buildRow(codigo: string, base: { nombre: string; pais: string; equipo: string; planFactor: number; meses: Record<string, number> }, hasPrelim: boolean, definitivo: boolean, metaCodigo: string): PreliminarRow {
  const meta = pepN4Meta[metaCodigo]
  const acumReal = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul'].reduce((s, k) => s + (base.meses[k] || 0) * base.planFactor, 0) * 1000
  const forecastMes = base.meses.ago * 0.96 * 1000
  return {
    codigo,
    servicio: base.nombre,
    pais: base.pais,
    equipo: base.equipo,
    ...meta,
    acumReal: Math.round(acumReal),
    forecastMes: Math.round(forecastMes),
    preliminarMes: hasPrelim ? Math.round(forecastMes * preliminarFactor(codigo)) : 0,
    definitivo,
  }
}

export const preliminaresRows: PreliminarN4Row[] = pepN4Tablon.map((n4) => {
  const hasPrelim = CON_PRELIMINAR.has(n4.codigo)
  const definitivo = DEFINITIVOS.has(n4.codigo)
  return {
    ...buildRow(n4.codigo, n4, hasPrelim, definitivo, n4.codigo),
    children: n4.children.map((n7) => buildRow(n7.codigo, n7, hasPrelim, definitivo, n4.codigo)),
  }
})
