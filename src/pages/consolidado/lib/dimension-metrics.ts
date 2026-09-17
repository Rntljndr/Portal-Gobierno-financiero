import type { DimNode } from './build-dimension-tree'

export interface DimMetrics {
  pctPlan: number
  varMonto: number
  varPct: number
}

/** "La variación es Nuevo Plan menos Forecast Base + IPC. Un valor positivo indica un aumento de
 * gasto respecto de esa base." — texto del prototipo real, replicado tal cual. */
export function computeDimMetrics(node: DimNode, totalPlanFiltrado: number): DimMetrics {
  const varMonto = node.plan - node.fIPC
  return {
    pctPlan: totalPlanFiltrado ? (node.plan / totalPlanFiltrado) * 100 : 0,
    varMonto,
    varPct: node.fIPC ? (varMonto / node.fIPC) * 100 : 0,
  }
}
