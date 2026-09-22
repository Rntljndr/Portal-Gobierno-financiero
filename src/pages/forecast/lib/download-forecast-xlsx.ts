import * as XLSX from 'xlsx'
import { monthKeys, monthLabels } from '@/data/reporteria'
import type { ForecastN4Linea, ForecastN7Linea } from '@/data/forecast-lineas'
import type { ResumenTotals } from '@/shared/lib/resumen-blocks'
import { calcN4Meses, calcN4Totals, calcN7Totals } from './forecast-edit-calc'

/** Redondea a 2 decimales como número (no string): Excel debe poder sumar/pivotar la columna, y el
 * valor debe coincidir con lo que se ve en pantalla (Ajuste T3 aplicado también a la descarga). */
function round2(n: number): number {
  return Math.round(n * 100) / 100
}

function monthHeaders(cutoff: number): string[] {
  return monthLabels.map((label, i) => `${label} (${i < cutoff ? 'Real' : 'FC'})`)
}

const TOTALS_HEADERS = ['Total (Acum.)', 'Desvío (Acum.)', 'Desvío % (Acum.)', 'Total Anual', 'Desvío (Anual)', 'Desvío % (Anual)']

function totalsCols(t: ResumenTotals): (number | string)[] {
  return [round2(t.real), round2(t.desvioAcumMonto), t.desvioAcumPct === null ? '' : round2(t.desvioAcumPct), round2(t.realMasForecast), round2(t.desvio), round2(t.pctDesvio)]
}

function safeFilename(name: string): string {
  return name.replace(/[\\/:*?"<>|]/g, '_')
}

/** Aplica formato Excel de 2 decimales a toda celda numérica — así el archivo se ve con la misma
 * cantidad de decimales que la pantalla apenas se abre, sin que la persona tenga que formatearlo. */
function applyDecimalFormat(ws: XLSX.WorkSheet) {
  const range = XLSX.utils.decode_range(ws['!ref'] ?? 'A1')
  for (let r = range.s.r; r <= range.e.r; r++) {
    for (let c = range.s.c; c <= range.e.c; c++) {
      const cell = ws[XLSX.utils.encode_cell({ r, c })]
      if (cell?.t === 'n') cell.z = '#,##0.00'
    }
  }
}

function writeSheet(header: string[], rows: (string | number)[][], sheetName: string, fileName: string) {
  const ws = XLSX.utils.aoa_to_sheet([header, ...rows])
  applyDecimalFormat(ws)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, sheetName.slice(0, 31))
  XLSX.writeFile(wb, fileName)
}

/** Exporta la grilla de edición N4 de un forecast a .xlsx (Ajuste T7) — mismos montos y 2 decimales
 * que la pantalla, encabezados claros por mes (Real/FC según el cutoff vigente). */
export function downloadForecastN4Xlsx(titulo: string, rows: ForecastN4Linea[], cutoff: number) {
  const header = ['Servicio N4', 'País', 'Equipo', ...monthHeaders(cutoff), ...TOTALS_HEADERS]
  const data = rows.map((n4) => {
    const meses = calcN4Meses(n4)
    return [n4.n4Nombre, n4.pais, n4.equipo, ...monthKeys.map((k) => round2(meses[k] || 0)), ...totalsCols(calcN4Totals(n4, cutoff))]
  })
  writeSheet(header, data, 'Forecast N4', `${safeFilename(titulo)} - Forecast N4.xlsx`)
}

/** Exporta la grilla de edición N7 de un servicio N4 puntual a .xlsx (Ajuste T7). */
export function downloadForecastN7Xlsx(n4Codigo: string, n4Nombre: string, rows: ForecastN7Linea[], cutoff: number) {
  const header = ['PEP N7', ...monthHeaders(cutoff), ...TOTALS_HEADERS]
  const data = rows.map((n7) => [n7.n7Nombre, ...monthKeys.map((k) => round2(n7.meses[k] || 0)), ...totalsCols(calcN7Totals(n4Codigo, n7, cutoff))])
  writeSheet(header, data, 'Forecast N7', `${safeFilename(n4Nombre)} - Forecast N7.xlsx`)
}
