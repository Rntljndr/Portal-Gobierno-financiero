import type { ResumenTotals } from '@/shared/lib/resumen-blocks'

/** Una línea está "en cero" cuando no tiene presupuesto, real ni forecast — el caso de líneas
 * antiguas que ya no se pueden eliminar y ensucian la vista (Ajuste T5). Alcanza con comparar Plan y
 * Real+Forecast: en este dominio los montos nunca son negativos, así que si ambos dan 0 el real y el
 * forecast que los componen también son 0. */
export function estaEnCero(t: ResumenTotals): boolean {
  return t.plan === 0 && t.realMasForecast === 0
}
