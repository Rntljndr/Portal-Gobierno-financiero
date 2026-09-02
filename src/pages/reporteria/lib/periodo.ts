export const MONTH_KEYS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

export type Quarter = 'Q1' | 'Q2' | 'Q3' | 'Q4'

export const MONTHS_BY_QUARTER: Record<Quarter, { key: string; label: string }[]> = {
  Q1: [{ key: 'ene', label: 'Enero' }, { key: 'feb', label: 'Febrero' }, { key: 'mar', label: 'Marzo' }],
  Q2: [{ key: 'abr', label: 'Abril' }, { key: 'may', label: 'Mayo' }, { key: 'jun', label: 'Junio' }],
  Q3: [{ key: 'jul', label: 'Julio' }, { key: 'ago', label: 'Agosto' }, { key: 'sep', label: 'Septiembre' }],
  Q4: [{ key: 'oct', label: 'Octubre' }, { key: 'nov', label: 'Noviembre' }, { key: 'dic', label: 'Diciembre' }],
}

export type SelMonths = Record<string, boolean>

export function allMonthsSelected(): SelMonths {
  return Object.fromEntries(MONTH_KEYS.map((k) => [k, true]))
}

export function isPeriodoActive(sel: SelMonths): boolean {
  return !MONTH_KEYS.every((k) => sel[k])
}

export function quarterState(sel: SelMonths, q: Quarter): 'all' | 'none' | 'partial' {
  const keys = MONTHS_BY_QUARTER[q].map((m) => m.key)
  const count = keys.filter((k) => sel[k]).length
  if (count === 0) return 'none'
  if (count === keys.length) return 'all'
  return 'partial'
}

export function periodoLabel(sel: SelMonths): string {
  const all = MONTH_KEYS.every((k) => sel[k])
  const none = MONTH_KEYS.every((k) => !sel[k])
  if (all) return 'Todos los períodos'
  if (none) return 'Sin período'
  const quarters: Quarter[] = ['Q1', 'Q2', 'Q3', 'Q4']
  const fullQuarters = quarters.filter((q) => quarterState(sel, q) === 'all')
  const activeQuarters = quarters.filter((q) => quarterState(sel, q) !== 'none')
  if (fullQuarters.length === activeQuarters.length && activeQuarters.length > 0) return `${fullQuarters.join(', ')} 2027`
  const numSelected = MONTH_KEYS.filter((k) => sel[k]).length
  return `${numSelected} meses seleccionados`
}
