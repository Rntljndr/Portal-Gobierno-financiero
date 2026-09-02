import * as XLSX from 'xlsx'
import { ipcFactorByMonth, monthKeys, monthLabels, pepN4Tablon } from '@/data/reporteria'

export interface DownloadOptions {
  plan: boolean
  forecastBase: boolean
  forecastIpc: boolean
}

function buildSheet(wb: XLSX.WorkBook, label: string, valueFor: (meses: Record<string, number>, planFactor: number, monthKey: string) => number) {
  const header = ['PEP N4', 'Nombre', 'País', 'Equipo', ...monthLabels, 'Total']
  const rows = pepN4Tablon.map((row) => {
    const monthValues = monthKeys.map((k) => Math.round(valueFor(row.meses, row.planFactor, k)))
    const total = monthValues.reduce((a, b) => a + b, 0)
    return [row.codigo, row.nombre, row.pais, row.equipo, ...monthValues, total]
  })
  const ws = XLSX.utils.aoa_to_sheet([header, ...rows])
  XLSX.utils.book_append_sheet(wb, ws, label.slice(0, 31))
}

export function downloadReporteriaXlsx(options: DownloadOptions) {
  const wb = XLSX.utils.book_new()

  if (options.plan) buildSheet(wb, 'Plan', (meses, planFactor, k) => (meses[k] || 0) * planFactor)
  if (options.forecastBase) buildSheet(wb, 'Forecast base', (meses, _f, k) => meses[k] || 0)
  if (options.forecastIpc) buildSheet(wb, 'Forecast + IPC', (meses, _f, k) => (meses[k] || 0) * (ipcFactorByMonth[k] ?? 1))

  const today = new Date().toISOString().slice(0, 10)
  XLSX.writeFile(wb, `Reporteria_2027_${today}.xlsx`)
}
