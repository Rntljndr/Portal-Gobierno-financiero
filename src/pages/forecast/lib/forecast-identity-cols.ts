import type { ColumnsDrawerColDef } from '@/shared/ui'

/** Orden homologado con Reales (A8): "Código" (PEP completo) va primero, junto al nombre del
 * servicio — antes había un "Cod de servicio" sintético (distinto del PEP N4/N7) al principio y el
 * PEP real al final; ahora es un solo dato, en la posición de Reales (reales-table-cols.ts). Cada una
 * tiene una key estable para el botón "Columnas" (mismo patrón que Reales, ColumnsDrawer de shared/ui). */
export const FORECAST_IDENTITY_N4_COLS: ColumnsDrawerColDef[] = [
  { key: 'codigo', label: 'Código' },
  { key: 'pais', label: 'País' },
  { key: 'gerenciaPadre', label: 'Gerencia Padre' },
  { key: 'gerencia', label: 'Gerencia' },
  { key: 'equipo', label: 'Equipo' },
  { key: 'cuentaContable', label: 'Cuenta Contable' },
  { key: 'moneda', label: 'Moneda' },
  /** F: "en los filtros de N4 y N7 se debe agregar el rubro, también en las columnas se debe agregar el rubro". */
  { key: 'rubro', label: 'Rubro' },
  { key: 'completitud', label: 'Completitud' },
]

export const FORECAST_IDENTITY_N7_COLS: ColumnsDrawerColDef[] = [
  { key: 'codigo', label: 'Código' },
  { key: 'pais', label: 'País' },
  { key: 'gerenciaPadre', label: 'Gerencia Padre' },
  { key: 'gerencia', label: 'Gerencia' },
  { key: 'equipo', label: 'Equipo' },
  { key: 'centroCosto', label: 'Centro de costo' },
  { key: 'asignacion', label: 'Asignación' },
  { key: 'bandera', label: 'Bandera' },
  { key: 'cuentaContable', label: 'Cuenta Contable' },
  { key: 'moneda', label: 'Moneda' },
  /** F: "en los filtros de N4 y N7 se debe agregar el rubro, también en las columnas se debe agregar el rubro". */
  { key: 'rubro', label: 'Rubro' },
  /** No existe en Reales (A8: "si hay columnas que no existen en Reales, lístamelas") — ver C5. */
  { key: 'llave', label: 'Llave de Distribución' },
  /** F: "al lado de la llave de distribución" — Enviado/No enviado según envioEstado del PEP N7. */
  { key: 'estado', label: 'Estado' },
]

export const FORECAST_IDENTITY_COLS: Record<'n4' | 'n7', ColumnsDrawerColDef[]> = { n4: FORECAST_IDENTITY_N4_COLS, n7: FORECAST_IDENTITY_N7_COLS }

/** Todas las columnas visibles por defecto (botón "Columnas" recién estrenado, o pantallas que todavía
 * no ofrecen el toggle) — mismas keys que FORECAST_IDENTITY_COLS. */
export function forecastIdentityDefaultVisible(variant: 'n4' | 'n7'): string[] {
  return FORECAST_IDENTITY_COLS[variant].map((c) => c.key)
}
