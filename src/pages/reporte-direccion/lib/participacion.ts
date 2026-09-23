/** Peso de un nodo sobre un total de referencia (ingresos/venta) — la métrica distintiva del
 * Reporte de Dirección, confirmada con negocio (Yanina Vecchio / Dahiana Alquinta, reunión
 * "Reportería SIP Simcro" 21/09/2026): "país X pesa Y % sobre la venta". El total contra el que se
 * compara depende del nivel de apertura (ver `direccion-summary-items.ts`): la suma de ingresos de
 * los 7 países a nivel País, o el padre inmediato (país/división) al bajar a División/Bandera. */
export function participacionPct(parte: number, total: number): number {
  return total ? (parte / total) * 100 : 0
}
