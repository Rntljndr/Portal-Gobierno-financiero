export interface ChartMonth {
  mes: string
  label: string
  plan: number
  fBase: number
}

export const CHART_W = 480
export const CHART_H = 200
export const PAD_L = 52
export const PAD_B = 36
export const PAD_T = 14
export const PAD_R = 12

export function chartScale(months: ChartMonth[]) {
  const maxVal = months.reduce((mx, d) => Math.max(mx, d.plan, d.fBase), 1)
  const chartH = CHART_H - PAD_T - PAD_B
  const chartW = CHART_W - PAD_L - PAD_R
  const groupW = months.length > 0 ? chartW / months.length : chartW
  const yVal = (v: number) => PAD_T + chartH - (v / maxVal) * chartH
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((r) => Math.round(maxVal * r))
  const monthCx = (mi: number) => PAD_L + mi * groupW + groupW / 2
  return { maxVal, chartH, chartW, groupW, yVal, yTicks, monthCx }
}

export function fmtK(v: number): string {
  return v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v)
}
