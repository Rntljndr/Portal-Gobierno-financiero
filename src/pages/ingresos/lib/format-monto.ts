/** Ingresos se muestran con 2 decimales (a diferencia de `formatNumber`, que redondea a entero) —
 * los montos de esta pantalla suelen venir con centavos desde el Excel de origen. */
export function formatMonto(n: number): string {
  return n.toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
