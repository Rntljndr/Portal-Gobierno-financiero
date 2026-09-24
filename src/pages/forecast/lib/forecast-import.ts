import * as XLSX from 'xlsx'
import { monthKeys, monthLabels } from '@/data/reporteria'
import { FORECAST_MES_ACTUAL, type ForecastRound } from '@/data/forecast'

/**
 * Carga masiva del Forecast actual — sigue el mismo patrón real que src/pages/ingresos/lib/parse
 * -import.ts (SheetJS + validación fila por fila), con el resumen antes/después que ese patrón no
 * tiene. Este dominio asume montos siempre >= 0 (ver hide-zero-lines.ts), así que a diferencia de un
 * import genérico acá SÍ se rechazan negativos sin excepción.
 */

const FIXED_HEADERS = ['N4 Código', 'N4 Nombre', 'N7 Código', 'N7 Nombre']

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

function safeFilename(name: string): string {
  return name.replace(/[\\/:*?"<>|]/g, '_')
}

function editableN7Rows(round: ForecastRound) {
  return round.lineas.flatMap((n4) => n4.n7.map((n7) => ({ n4, n7 })))
}

export function downloadForecastImportTemplate(round: ForecastRound) {
  const monthCols = monthKeys.slice(FORECAST_MES_ACTUAL)
  const header = [...FIXED_HEADERS, ...monthLabels.slice(FORECAST_MES_ACTUAL)]
  const rows = editableN7Rows(round).map(({ n4, n7 }) => [n4.n4Codigo, n4.n4Nombre, n7.n7Codigo, n7.n7Nombre, ...monthCols.map((k) => round2(n7.meses[k] || 0))])

  const ws = XLSX.utils.aoa_to_sheet([header, ...rows])
  const range = XLSX.utils.decode_range(ws['!ref'] ?? 'A1')
  for (let r = range.s.r; r <= range.e.r; r++) {
    for (let c = FIXED_HEADERS.length; c <= range.e.c; c++) {
      const cell = ws[XLSX.utils.encode_cell({ r, c })]
      if (cell?.t === 'n') cell.z = '#,##0.00'
    }
  }
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Forecast N7')
  XLSX.writeFile(wb, `${safeFilename(round.titulo)} - Template carga masiva.xlsx`)
}

export interface ImportRowResult {
  fila: number
  n4Codigo: string
  n7Codigo: string
  ok: boolean
  error?: string
  meses?: Record<string, number>
}

export interface ImportPreviewLinea {
  n4Nombre: string
  n7Nombre: string
  totalAntes: number
  totalDespues: number
}

export interface ImportResult {
  rows: ImportRowResult[]
  validCount: number
  errorCount: number
  preview: { lineas: ImportPreviewLinea[]; totalAntes: number; totalDespues: number } | null
}

export function parseRow(raw: unknown[], fila: number, round: ForecastRound, monthCols: string[]): ImportRowResult {
  const n4Codigo = String(raw[0] ?? '').trim()
  const n7Codigo = String(raw[2] ?? '').trim()
  const n4 = round.lineas.find((l) => l.n4Codigo === n4Codigo)
  if (!n4) return { fila, n4Codigo, n7Codigo, ok: false, error: `No existe el servicio N4 "${n4Codigo}" en este forecast.` }
  const n7 = n4.n7.find((l) => l.n7Codigo === n7Codigo)
  if (!n7) return { fila, n4Codigo, n7Codigo, ok: false, error: `No existe el PEP N7 "${n7Codigo}" dentro de "${n4Codigo}" en este forecast.` }

  const valores = raw.slice(4, 4 + monthCols.length).map((v) => Number(v))
  if (valores.length < monthCols.length || valores.some((v) => Number.isNaN(v))) {
    return { fila, n4Codigo, n7Codigo, ok: false, error: `Faltan valores mensuales o alguno no es numérico (se esperan ${monthCols.length} columnas de mes).` }
  }
  if (valores.some((v) => v < 0)) {
    return { fila, n4Codigo, n7Codigo, ok: false, error: 'Los montos de Forecast no admiten valores negativos.' }
  }

  return { fila, n4Codigo, n7Codigo, ok: true, meses: Object.fromEntries(monthCols.map((k, i) => [k, valores[i]])) }
}

export function buildPreview(rows: ImportRowResult[], round: ForecastRound): ImportResult['preview'] {
  const okRows = rows.filter((r) => r.ok && r.meses)
  if (okRows.length === 0) return null

  let totalAntes = 0
  let totalDespues = 0
  const lineas: ImportPreviewLinea[] = okRows.map((r) => {
    const n4 = round.lineas.find((l) => l.n4Codigo === r.n4Codigo)!
    const n7 = n4.n7.find((l) => l.n7Codigo === r.n7Codigo)!
    const meses = r.meses!
    const antes = Object.keys(meses).reduce((s, k) => s + (n7.meses[k] || 0), 0)
    const despues = Object.values(meses).reduce((s, v) => s + v, 0)
    totalAntes += antes
    totalDespues += despues
    return { n4Nombre: n4.n4Nombre, n7Nombre: n7.n7Nombre, totalAntes: round2(antes), totalDespues: round2(despues) }
  })

  return { lineas, totalAntes: round2(totalAntes), totalDespues: round2(totalDespues) }
}

export async function parseForecastImport(file: File, round: ForecastRound): Promise<ImportResult> {
  const monthCols = monthKeys.slice(FORECAST_MES_ACTUAL)
  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: 'array' })
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const aoa = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: '' })

  const rows = aoa
    .slice(1)
    .filter((r) => r.some((c) => String(c).trim() !== ''))
    .map((r, i) => parseRow(r, i + 2, round, monthCols))

  const validCount = rows.filter((r) => r.ok).length
  const errorCount = rows.filter((r) => !r.ok).length
  const preview = errorCount === 0 ? buildPreview(rows, round) : null

  return { rows, validCount, errorCount, preview }
}
