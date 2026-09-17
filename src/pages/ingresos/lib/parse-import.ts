import * as XLSX from 'xlsx'
import { monthKeys } from '@/data/reporteria'
import { BANDERAS_MAESTRO } from '@/data/administracion/ingresos-banderas'

export interface ImportRowResult {
  fila: number
  bandera: string
  ok: boolean
  error?: string
  meses?: Record<string, number>
}

export interface ImportResult {
  rows: ImportRowResult[]
  validCount: number
  errorCount: number
}

/** Excel/CSV esperado: columna 1 = Bandera (nombre exacto), columnas 2 a 13 = Ene..Dic. La fila 1 se
 * asume encabezado y se descarta. El nombre debe coincidir carácter a carácter con `BANDERAS_MAESTRO`
 * — no se normaliza mayúsculas/minúsculas ni acentos, solo se recorta espacio sobrante. */
function parseRow(raw: unknown[], fila: number, nombresValidos: Set<string>): ImportRowResult {
  const bandera = String(raw[0] ?? '').trim()

  if (!nombresValidos.has(bandera)) {
    return { fila, bandera, ok: false, error: `La bandera "${bandera}" no coincide con ningún nombre registrado en el sistema.` }
  }

  const valores = raw.slice(1, 1 + monthKeys.length).map((v) => Number(v))
  if (valores.length < monthKeys.length || valores.some((v) => Number.isNaN(v))) {
    return { fila, bandera, ok: false, error: 'Faltan valores mensuales o alguno no es numérico (se esperan 12 columnas, Ene a Dic).' }
  }

  return { fila, bandera, ok: true, meses: Object.fromEntries(monthKeys.map((k, i) => [k, valores[i]])) }
}

export async function parseImportFile(file: File): Promise<ImportResult> {
  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: 'array' })
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const aoa = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: '' })
  const nombresValidos = new Set(BANDERAS_MAESTRO.map((b) => b.nombre))

  const rows = aoa
    .slice(1)
    .filter((r) => r.some((c) => String(c).trim() !== ''))
    .map((r, i) => parseRow(r, i + 2, nombresValidos))

  return { rows, validCount: rows.filter((r) => r.ok).length, errorCount: rows.filter((r) => !r.ok).length }
}
