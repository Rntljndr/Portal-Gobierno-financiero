import type { DimNode } from './build-dimension-tree'

export interface DimMetrics {
  pesoPlan: number
  varMonto: number
  varPct: number
}

/** Replica la semántica real del tablero: la comparación es "Nuevo Plan vs Forecast + IPC" (la base oficial),
 * no vs. Forecast base ni vs. Real — y un aumento del plan por sobre esa base se marca en rojo (es un
 * sobregasto propuesto), al revés de la convención genérica positivo=verde usada en Reporte de Dirección. */
export function computeDimMetrics(node: DimNode, totalPlanFiltrado: number): DimMetrics {
  const varMonto = node.plan - node.fIPC
  return {
    pesoPlan: totalPlanFiltrado ? (node.plan / totalPlanFiltrado) * 100 : 0,
    varMonto,
    varPct: node.fIPC ? (varMonto / node.fIPC) * 100 : 0,
  }
}
