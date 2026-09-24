export const FORECAST_IDENTITY_N4_LABELS = ['Cod de servicio', 'País', 'Moneda', 'Gerencia Padre', 'Gerencia', 'Equipo', 'Cuenta Contable', 'PEP Nivel 4', 'Estado']

export const FORECAST_IDENTITY_N7_LABELS = [
  'Cod de servicio',
  'País',
  'Moneda',
  'Gerencia Padre',
  'Gerencia',
  'Equipo',
  'Centro de costo',
  'Bandera',
  'Cuenta Contable',
  'Asignación',
  'Llave Dist. Plan',
  'Llave Dist. Forecast',
  'PEP Nivel 7',
  'Estado',
]

/** Cantidad total de columnas de identidad (nombre del servicio + las de acá) — usado para el colSpan
 * de la fila de Plan y la de totales, que no tienen un valor por cada una de estas columnas. */
export const FORECAST_IDENTITY_COL_COUNT: Record<'n4' | 'n7', number> = {
  n4: 1 + FORECAST_IDENTITY_N4_LABELS.length,
  n7: 1 + FORECAST_IDENTITY_N7_LABELS.length,
}
