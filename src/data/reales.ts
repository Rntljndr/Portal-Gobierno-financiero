import { monthKeys, monthLabels, pepN4Tablon } from './reporteria'
import { pepN4Meta } from './pep-n4-meta'
import { buildSubPeps, CON_SUBPEPS, type PepSubPep } from './pep-subpeps'

export { monthKeys, monthLabels }
export type { PepSubPep }

/** Meses ya cerrados (con real reportado); el resto del año queda en forecast. */
export const REALES_LAST_CLOSED = 7
export const REALES_MES_ABIERTO_LABEL = 'Agosto 2026'
export const REALES_ULTIMO_REAL_LABEL = 'Julio 2026'

export type RealesTipoActualizacion = 'automatica' | 'manual'

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
  subPeps?: PepSubPep[]
  /** Ajuste R4: PEP con reales en 2026 que no forma parte del universo de Presupuesto 2026 (viene de SAP sin PEP presupuestado). */
  sinPresupuesto?: boolean
  /** Ajuste R10: origen del último valor cargado — "manual" si vino de una carga masiva de Control de Gestión, nunca sobreescrito por la sync nocturna de SAP. */
  tipoActualizacion?: RealesTipoActualizacion
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
  const subPeps = CON_SUBPEPS.has(codigo) ? buildSubPeps(codigo, base.nombre, (base.meses.ago || 0) * 1000) : undefined
  return { codigo, paisDestino: base.pais, ...base, ...meta, subPeps, tipoActualizacion: 'automatica' }
}

const presupuestoRows: RealesN4Row[] = pepN4Tablon.map((n4) => ({
  ...enrich(n4.codigo, n4, n4.codigo),
  children: n4.children.map((n7) => enrich(n7.codigo, n7, n4.codigo)),
}))

/**
 * Ajuste R4/R10: PEPs con reales en 2026 que llegan directo de SAP sin PEP presupuestado — nómina del DF, amortizaciones,
 * gastos de oficina y gastos sin PEP, cargados manualmente por Control de Gestión (Ajuste R10) mes a mes.
 */
function sinPresupuestoRow(codigo: string, nombre: string, meses: Record<string, number>): RealesN4Row {
  const base: RealesRow = {
    codigo,
    nombre,
    pais: 'Chile',
    paisDestino: 'Chile',
    equipo: 'Control de Gestión',
    planFactor: 1,
    meses,
    gerenciaPadre: 'Finanzas',
    gerencia: 'Control de Gestión',
    centroCosto: 'CC-900',
    asignacion: 'Indirecto',
    bandera: 'Cencosud',
    cuentaContable: 'CA-9000',
    moneda: 'USD',
    sinPresupuesto: true,
    tipoActualizacion: 'manual',
  }
  return { ...base, children: [{ ...base, codigo: `${codigo}-N7` }] }
}

const sinPresupuestoRows: RealesN4Row[] = [
  sinPresupuestoRow('SAP-2026-901', 'Nómina del DF', { ene: 210, feb: 205, mar: 215, abr: 208, may: 220, jun: 218, jul: 212, ago: 0, sep: 0, oct: 0, nov: 0, dic: 0 }),
  sinPresupuestoRow('SAP-2026-902', 'Amortizaciones', { ene: 95, feb: 95, mar: 95, abr: 95, may: 95, jun: 95, jul: 95, ago: 0, sep: 0, oct: 0, nov: 0, dic: 0 }),
  sinPresupuestoRow('SAP-2026-903', 'Gastos de Oficina', { ene: 42, feb: 38, mar: 45, abr: 40, may: 47, jun: 43, jul: 41, ago: 0, sep: 0, oct: 0, nov: 0, dic: 0 }),
  sinPresupuestoRow('SAP-2026-904', 'Gastos sin PEP', { ene: 18, feb: 22, mar: 15, abr: 25, may: 19, jun: 21, jul: 17, ago: 0, sep: 0, oct: 0, nov: 0, dic: 0 }),
]

export const realesRows: RealesN4Row[] = [...presupuestoRows, ...sinPresupuestoRows]

export const realesN7Rows: RealesN7Row[] = realesRows.flatMap((n4) =>
  n4.children.map((c) => ({ ...c, parentCodigo: n4.codigo, parentNombre: n4.nombre })),
)
