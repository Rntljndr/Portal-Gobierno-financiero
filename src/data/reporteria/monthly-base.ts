export const monthKeys = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
export const monthLabels = ['Enero', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

interface MonthlyBase {
  mes: string
  fBase: number
  fIPC: number
}

const monthlyBase: MonthlyBase[] = [
  { mes: 'ene', fBase: 10500, fIPC: 10836 },
  { mes: 'feb', fBase: 9300, fIPC: 9598 },
  { mes: 'mar', fBase: 11400, fIPC: 11765 },
  { mes: 'abr', fBase: 10100, fIPC: 10423 },
  { mes: 'may', fBase: 11800, fIPC: 12178 },
  { mes: 'jun', fBase: 10200, fIPC: 10526 },
  { mes: 'jul', fBase: 12400, fIPC: 12796 },
  { mes: 'ago', fBase: 10700, fIPC: 11041 },
  { mes: 'sep', fBase: 12900, fIPC: 13304 },
  { mes: 'oct', fBase: 11100, fIPC: 11455 },
  { mes: 'nov', fBase: 13800, fIPC: 14239 },
  { mes: 'dic', fBase: 12900, fIPC: 13304 },
]

export const ipcFactorByMonth: Record<string, number> = Object.fromEntries(
  monthlyBase.map((d) => [d.mes, d.fBase > 0 ? d.fIPC / d.fBase : 1]),
)
