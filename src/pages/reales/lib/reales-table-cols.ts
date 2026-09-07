import type { RealesN7Row, RealesRow } from '@/data/reales'

export interface RealesColDef {
  key: string
  label: string
  render: (row: RealesRow | RealesN7Row) => string
}

export const REALES_N4_COLS: RealesColDef[] = [
  { key: 'codigo', label: 'Código', render: (r) => r.codigo },
  { key: 'pais', label: 'País Origen', render: (r) => r.pais },
  { key: 'gerenciaPadre', label: 'Ger. Padre', render: (r) => r.gerenciaPadre },
  { key: 'gerencia', label: 'Gerencia', render: (r) => r.gerencia },
  { key: 'equipo', label: 'Equipo', render: (r) => r.equipo },
  { key: 'cuentaContable', label: 'Cta. Contable', render: (r) => r.cuentaContable },
  { key: 'moneda', label: 'Moneda', render: (r) => r.moneda },
]

export const REALES_N7_COLS: RealesColDef[] = [
  { key: 'codigo', label: 'Código', render: (r) => r.codigo },
  { key: 'pais', label: 'País Origen', render: (r) => r.pais },
  { key: 'gerenciaPadre', label: 'Ger. Padre', render: (r) => r.gerenciaPadre },
  { key: 'gerencia', label: 'Gerencia', render: (r) => r.gerencia },
  { key: 'equipo', label: 'Equipo', render: (r) => r.equipo },
  { key: 'centroCosto', label: 'C. Costo', render: (r) => r.centroCosto },
  { key: 'asignacion', label: 'Asignación', render: (r) => r.asignacion },
  { key: 'bandera', label: 'Bandera', render: (r) => r.bandera },
  { key: 'cuentaContable', label: 'Cta. Cont.', render: (r) => r.cuentaContable },
  { key: 'paisDestino', label: 'País Destino', render: (r) => r.paisDestino },
  { key: 'moneda', label: 'Moneda', render: (r) => r.moneda },
  { key: 'tipoActualizacion', label: 'Actualización', render: (r) => (r.tipoActualizacion === 'manual' ? 'Manual' : 'Automática') },
]

export function realesColsForMode(mode: 'n4' | 'n7'): RealesColDef[] {
  return mode === 'n7' ? REALES_N7_COLS : REALES_N4_COLS
}

export const REALES_N4_COL_KEYS = REALES_N4_COLS.map((c) => c.key)
export const REALES_N7_COL_KEYS = REALES_N7_COLS.map((c) => c.key)

/** Ancho fijo de la columna SubPEP (sticky, primera columna en N7) para calcular el offset sticky de la columna de identidad. */
export const REALES_SUBPEP_COL_PX = 72
export const REALES_SUBPEP_COL_W = 'w-[72px] min-w-[72px]'
