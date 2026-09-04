/** Cuenta de columnas de identidad (antes de los meses), usada para los colSpan de header/footer. */
export function preliminaresColCounts(isN7: boolean, selectable: boolean, showSubPepCol = true) {
  const leading = selectable ? 1 : 0
  const subPep = isN7 && showSubPepCol ? 1 : 0
  let afterSticky = 4 + 2 // codigo, pais, gerPadre, gerencia + cta.cont., moneda
  if (isN7) afterSticky += 3 + 1 // equipo, c.costo, asignación / estado
  return { leading, subPep, afterSticky, total: leading + subPep + 1 + afterSticky }
}

/** Ancho fijo de la columna SubPEP (sticky, primera columna en N7) para calcular el offset sticky de la columna de identidad. */
export const PRELIM_SUBPEP_COL_W = 'w-[72px] min-w-[72px]'
