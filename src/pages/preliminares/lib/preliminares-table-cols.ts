/** Cuenta de columnas de identidad (antes de las columnas de datos), usada para los colSpan de header/footer. */
export function preliminaresColCounts(isN7: boolean, selectable: boolean, showSubPepCol = true) {
  const leading = selectable ? 1 : 0
  const subPep = isN7 && showSubPepCol ? 1 : 0
  let afterSticky = 4 + 2 + 1 // codigo, pais, gerPadre, gerencia + cta.cont., moneda + estado (N4 o N7)
  if (isN7) afterSticky += 3 // equipo, c.costo, asignación
  return { leading, subPep, afterSticky, total: leading + subPep + 1 + afterSticky }
}

/** Ancho fijo de la columna SubPEP (sticky, primera columna en N7) para calcular el offset sticky de la columna de identidad. */
export const PRELIM_SUBPEP_COL_W = 'w-[72px] min-w-[72px]'

/** Ajuste P2: columnas de datos — Preliminar del mes como protagonista, comparado horizontalmente contra Plan y Forecast. */
export const PRELIM_DATA_COLS = 8
