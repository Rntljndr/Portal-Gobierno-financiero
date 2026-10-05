/** Ancho de la columna de checkbox de selección múltiple (M7) — columna propia y angosta, separada
 * del nombre del servicio (que crece según el contenido), con más margen que antes. Un solo número
 * compartido por header/filas/footer/filas de comparación para que las columnas sticky (checkbox +
 * nombre) queden alineadas entre sí en toda la tabla. */
export const FORECAST_CHECKBOX_COL_PX = 44
export const FORECAST_CHECKBOX_COL_W = 'w-[44px] min-w-[44px]'
export const FORECAST_NAME_STICKY_LEFT = 'left-[44px]'

/** F: "una columna antes del PEP N7 que diga subpep" — solo en la tabla N7 (ver ForecastN7FlatTable).
 * Mismo ancho que REALES_SUBPEP_COL_W (reales/lib/reales-table-cols.ts) para que ambos módulos luzcan
 * igual. Las columnas sticky (checkbox + SubPEP + nombre) deben quedar alineadas entre header, filas y
 * filas de comparación — de ahí las dos funciones de abajo en vez de una constante fija. */
export const FORECAST_SUBPEP_COL_W = 'w-[72px] min-w-[72px]'

export function forecastSubPepStickyLeft(hasCheckbox: boolean): string {
  return hasCheckbox ? 'left-[44px]' : 'left-0'
}

export function forecastNameStickyLeft(hasCheckbox: boolean, hasSubPep: boolean): string {
  if (hasCheckbox && hasSubPep) return 'left-[116px]'
  if (hasCheckbox) return 'left-[44px]'
  if (hasSubPep) return 'left-[72px]'
  return 'left-0'
}
