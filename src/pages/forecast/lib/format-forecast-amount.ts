/** Formatea montos del módulo Forecast con 2 decimales fijos (Ajuste T3) — a diferencia de
 * `formatNumber` (0 decimales, usado en el resto del portal), acá se prioriza que el mismo monto se
 * vea idéntico en el resumen, el detalle y la descarga. Utilidad central: todas las vistas de
 * Forecast deben formatear montos a través de esta función, nunca con `toFixed`/`formatNumber`
 * directo. No cambia cómo se almacenan los valores, solo cómo se muestran. */
export function formatForecastAmount(n: number): string {
  return n.toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
