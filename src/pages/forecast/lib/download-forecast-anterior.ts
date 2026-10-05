import * as XLSX from 'xlsx'
import { monthKeys, monthLabels } from '@/data/reporteria'
import { forecastMeses, forecastPaisesMoneda, FORECAST_MES_ACTUAL, type ForecastRound } from '@/data/forecast'
import { calcN4Meses, findPlanN4, findPlanN7 } from './forecast-edit-calc'
import { buildFlatN7Rows } from './forecast-flat-n7'
import { formatFechaCorta } from './format-date'
import { equiposFromN4Codes } from './forecast-equipos'

/**
 * Descarga completa de un forecast anterior (F): Datos + Tasas de cambio + Servicios N4 + Servicios
 * N7, cada tabla de servicios con su fila de Plan intercalada (mismo par fila-valor/fila-plan que se
 * ve en pantalla). Todo en un solo archivo, varias hojas — mismo patrón SheetJS que
 * download-forecast-xlsx.ts.
 */

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

function safeFilename(name: string): string {
  return name.replace(/[\\/:*?"<>|]/g, '_')
}

function monthHeaders(cutoff: number): string[] {
  return monthLabels.map((label, i) => `${label} (${i < cutoff ? 'Real' : 'FC'})`)
}

const TOTALS_HEADERS = ['Plan', 'Real (YTD)', 'Desvío (Acum.)', 'Desvío % (Acum.)', 'Real + Forecast (Full Year)', 'Desvío (Anual)', 'Desvío % (Anual)']

function totalsRow(label: string, meses: Record<string, number>, plan: Record<string, number>, cutoff: number) {
  const t = calcTotalsFrom(meses, plan, cutoff)
  return [label, ...monthKeys.map((k) => round2(meses[k] || 0)), round2(t.plan), round2(t.real), round2(t.desvioAcumMonto), t.desvioAcumPct === null ? '' : round2(t.desvioAcumPct), round2(t.realMasForecast), round2(t.desvio), round2(t.pctDesvio)]
}

function planRow(plan: Record<string, number>, cutoff: number) {
  const planTotal = monthKeys.reduce((s, k) => s + (plan[k] || 0), 0)
  const planAcum = (planTotal * cutoff) / 12
  return ['— Plan —', ...monthKeys.map((k) => round2(plan[k] || 0)), round2(planTotal), round2(planAcum), '', '', round2(planTotal), '', '']
}

function calcTotalsFrom(meses: Record<string, number>, plan: Record<string, number>, cutoff: number) {
  const planTotal = monthKeys.reduce((s, k) => s + (plan[k] || 0), 0)
  const real = monthKeys.slice(0, cutoff).reduce((s, k) => s + (meses[k] || 0), 0)
  const forecast = monthKeys.slice(cutoff).reduce((s, k) => s + (meses[k] || 0), 0)
  const realMasForecast = real + forecast
  const desvio = realMasForecast - planTotal
  const pctDesvio = planTotal > 0 ? (desvio / planTotal) * 100 : 0
  const planAcum = (planTotal * cutoff) / 12
  const desvioAcumMonto = real - planAcum
  const desvioAcumPct = planAcum > 0 ? (desvioAcumMonto / planAcum) * 100 : null
  return { plan: planTotal, real, realMasForecast, desvio, pctDesvio, planAcum, desvioAcumMonto, desvioAcumPct }
}

function applyDecimalFormat(ws: XLSX.WorkSheet) {
  const range = XLSX.utils.decode_range(ws['!ref'] ?? 'A1')
  for (let r = range.s.r; r <= range.e.r; r++) {
    for (let c = range.s.c; c <= range.e.c; c++) {
      const cell = ws[XLSX.utils.encode_cell({ r, c })]
      if (cell?.t === 'n') cell.z = '#,##0.00'
    }
  }
}

function datosSheet(round: ForecastRound): XLSX.WorkSheet {
  const rows = [
    ['Título', round.titulo],
    ['Descripción', round.descripcion || '—'],
    ['Estado', round.estado],
    ['Tipo', round.tipo === 'global' ? 'Global' : 'Parcial'],
    ['Fecha de inicio', formatFechaCorta(round.fechaInicio)],
    ['Fecha de término', formatFechaCorta(round.fechaTermino)],
    ['Porcentaje desvío', `${round.desvio}%`],
    ['Notificar usuarios', round.notificar ? 'Sí' : 'No'],
  ]
  if (round.tipo === 'parcial') rows.push(['Equipos habilitados', String(equiposFromN4Codes(round.selPeps).size)])
  return XLSX.utils.aoa_to_sheet(rows)
}

function tasasSheet(round: ForecastRound): XLSX.WorkSheet {
  const header = ['País', 'Moneda', ...forecastMeses]
  const rows = forecastPaisesMoneda.map((p) => [p.pais, p.moneda, ...(round.tasasCambio[p.moneda] ?? []).map((v) => Number(v) || 0)])
  const ws = XLSX.utils.aoa_to_sheet([header, ...rows])
  applyDecimalFormat(ws)
  return ws
}

function n4Sheet(round: ForecastRound): XLSX.WorkSheet {
  const cutoff = FORECAST_MES_ACTUAL
  const header = ['Servicio N4', ...monthHeaders(cutoff), ...TOTALS_HEADERS]
  const rows = round.lineas.flatMap((n4) => {
    const meses = calcN4Meses(n4)
    const plan = findPlanN4(n4.n4Codigo)
    return [totalsRow(n4.n4Nombre, meses, plan, cutoff), planRow(plan, cutoff)]
  })
  const ws = XLSX.utils.aoa_to_sheet([header, ...rows])
  applyDecimalFormat(ws)
  return ws
}

function n7Sheet(round: ForecastRound): XLSX.WorkSheet {
  const cutoff = FORECAST_MES_ACTUAL
  const header = ['PEP N7', 'Servicio N4', ...monthHeaders(cutoff), ...TOTALS_HEADERS]
  const rows = buildFlatN7Rows(round.lineas).flatMap(({ n4Codigo, n4Nombre, n7 }) => {
    const plan = findPlanN7(n4Codigo, n7.n7Codigo)
    const valueRow = totalsRow(n7.n7Nombre, n7.meses, plan, cutoff)
    valueRow.splice(1, 0, n4Nombre)
    const planR = planRow(plan, cutoff)
    planR.splice(1, 0, n4Nombre)
    return [valueRow, planR]
  })
  const ws = XLSX.utils.aoa_to_sheet([header, ...rows])
  applyDecimalFormat(ws)
  return ws
}

export function downloadForecastAnteriorXlsx(round: ForecastRound) {
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, datosSheet(round), 'Datos del Forecast')
  XLSX.utils.book_append_sheet(wb, tasasSheet(round), 'Tasas de Cambio')
  XLSX.utils.book_append_sheet(wb, n4Sheet(round), 'Servicios N4')
  XLSX.utils.book_append_sheet(wb, n7Sheet(round), 'Servicios N7')
  XLSX.writeFile(wb, `${safeFilename(round.titulo)} - Completo.xlsx`)
}
