/** Geometría SVG mínima y autocontenida para el gráfico "Avance del proyecto" de Inicio (no reutiliza
 * reporteria/lib/chart-geometry.ts: pages/<A> nunca importa de pages/<B>). */
export const CHART_W = 920
export const CHART_H = 220
export const PAD_L = 54
export const PAD_R = 12
export const PAD_T = 14
export const PAD_B = 34

export interface ProgressChartScale {
  chartW: number
  chartH: number
  maxVal: number
  yVal: (v: number) => number
  monthCx: (i: number) => number
  barW: number
  yTicks: number[]
}

export function buildProgressChartScale(values: number[], count: number): ProgressChartScale {
  const chartW = CHART_W - PAD_L - PAD_R
  const chartH = CHART_H - PAD_T - PAD_B
  const maxVal = Math.max(...values, 1) * 1.12
  const groupW = chartW / count
  const barW = Math.max(8, Math.min(26, groupW * 0.32))
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((r) => Math.round(maxVal * r))

  return {
    chartW,
    chartH,
    maxVal,
    yVal: (v: number) => PAD_T + chartH - (v / maxVal) * chartH,
    monthCx: (i: number) => PAD_L + groupW * (i + 0.5),
    barW,
    yTicks,
  }
}
