/** Geometría SVG mínima y autocontenida para el gráfico de evolución de Forecast (no reutiliza reporteria/lib/chart-geometry.ts: pages/<A> nunca importa de pages/<B>). */
export const CHART_W = 560
export const CHART_H = 170
const PAD_L = 6
const PAD_B = 22
const PAD_T = 10

export interface ChartScale {
  chartW: number
  /** Ancho de la franja de un mes — para que cada chart derive el ancho de barra que necesite (una
   * sola, o dos lado a lado cuando hay Plan de referencia, C9). */
  groupW: number
  yVal: (v: number) => number
  monthCx: (i: number) => number
  barW: number
}

export function buildChartScale(values: number[], count: number): ChartScale {
  const chartW = CHART_W - PAD_L * 2
  const chartH = CHART_H - PAD_B - PAD_T
  const yMax = Math.max(...values, 1) * 1.1
  const groupW = chartW / count
  const barW = groupW * 0.55

  return {
    chartW,
    groupW,
    yVal: (v: number) => PAD_T + chartH - (v / yMax) * chartH,
    monthCx: (i: number) => PAD_L + groupW * (i + 0.5),
    barW,
  }
}
