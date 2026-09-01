import { monthKeys, monthLabels, pepN4Tablon } from './reporteria'
import { pepN4Meta } from './pep-n4-meta'

export { monthKeys, monthLabels }

/** Meses ya cerrados (con real reportado); el resto del año queda en forecast. */
export const REALES_LAST_CLOSED = 7
export const REALES_MES_ABIERTO_LABEL = 'Agosto 2026'
export const REALES_ULTIMO_REAL_LABEL = 'Julio 2026'

export interface RealesRow {
  codigo: string
  nombre: string
  pais: string
  paisDestino: string
  equipo: string
  planFactor: number
  meses: Record<string, number>
  gerenciaPadre: string
  gerencia: string
  centroCosto: string
  asignacion: string
  bandera: string
  cuentaContable: string
  moneda: string
}

export interface RealesN4Row extends RealesRow {
  children: RealesRow[]
}

export interface RealesN7Row extends RealesRow {
  parentCodigo: string
  parentNombre: string
}

function enrich(codigo: string, base: { nombre: string; pais: string; equipo: string; planFactor: number; meses: Record<string, number> }, metaCodigo: string): RealesRow {
  const meta = pepN4Meta[metaCodigo]
  return { codigo, paisDestino: base.pais, ...base, ...meta }
}

export const realesRows: RealesN4Row[] = pepN4Tablon.map((n4) => ({
  ...enrich(n4.codigo, n4, n4.codigo),
  children: n4.children.map((n7) => enrich(n7.codigo, n7, n4.codigo)),
}))

export const realesN7Rows: RealesN7Row[] = realesRows.flatMap((n4) =>
  n4.children.map((c) => ({ ...c, parentCodigo: n4.codigo, parentNombre: n4.nombre })),
)
