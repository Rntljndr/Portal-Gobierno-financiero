import { monthlyBase, monthKeys, monthLabelsShort } from '@/data/reporteria'
import type { ChartMonth } from '@/shared/lib/chart-geometry'

/**
 * El mock no tiene granularidad mensual por servicio (solo totales anuales, ver Servicio en
 * data/services/types.ts) — SIP tampoco la modela hoy a este nivel. Se toma la FORMA estacional ya
 * existente en `monthlyBase` (mismo fixture que usa el gráfico de Reportería) y se reescala mes a mes
 * para que la suma anual calce exactamente con el Plan y Forecast+IPC ya filtrados — así el gráfico
 * es honesto respecto del total mostrado arriba, aunque la distribución mes a mes es ilustrativa.
 */
export function buildEvolucionMensual(totalPlan: number, totalFIPC: number): ChartMonth[] {
  const planShapeTotal = monthlyBase.reduce((a, d) => a + d.plan, 0) || 1
  const fIPCShapeTotal = monthlyBase.reduce((a, d) => a + d.fIPC, 0) || 1

  return monthlyBase.map((d) => ({
    mes: d.mes,
    label: monthLabelsShort[monthKeys.indexOf(d.mes)] ?? d.mes,
    plan: Math.round(totalPlan * (d.plan / planShapeTotal)),
    fBase: Math.round(totalFIPC * (d.fIPC / fIPCShapeTotal)),
  }))
}
