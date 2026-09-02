export const monthKeys = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
export const monthLabels = ['Enero', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
export const monthLabelsShort = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

export interface MonthlyBase {
  mes: string
  plan: number
  fBase: number
  fIPC: number
}

export const monthlyBase: MonthlyBase[] = [
  { mes: 'ene', plan: 10200, fBase: 10500, fIPC: 10836 },
  { mes: 'feb', plan: 9800, fBase: 9300, fIPC: 9598 },
  { mes: 'mar', plan: 10900, fBase: 11400, fIPC: 11765 },
  { mes: 'abr', plan: 10400, fBase: 10100, fIPC: 10423 },
  { mes: 'may', plan: 11200, fBase: 11800, fIPC: 12178 },
  { mes: 'jun', plan: 10600, fBase: 10200, fIPC: 10526 },
  { mes: 'jul', plan: 11800, fBase: 12400, fIPC: 12796 },
  { mes: 'ago', plan: 11000, fBase: 10700, fIPC: 11041 },
  { mes: 'sep', plan: 12200, fBase: 12900, fIPC: 13304 },
  { mes: 'oct', plan: 11500, fBase: 11100, fIPC: 11455 },
  { mes: 'nov', plan: 13100, fBase: 13800, fIPC: 14239 },
  { mes: 'dic', plan: 13500, fBase: 12900, fIPC: 13304 },
]

export const ipcFactorByMonth: Record<string, number> = Object.fromEntries(
  monthlyBase.map((d) => [d.mes, d.fBase > 0 ? d.fIPC / d.fBase : 1]),
)
