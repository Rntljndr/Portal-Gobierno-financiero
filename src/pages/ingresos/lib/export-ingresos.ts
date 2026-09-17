import * as XLSX from 'xlsx'
import { monthKeys, monthLabelsShort } from '@/data/reporteria'
import { BANDERAS_MAESTRO } from '@/data/administracion/ingresos-banderas'
import type { IngresoRow } from './use-ingresos'

function downloadSheet(header: string[], rows: (string | number)[][], sheetName: string, fileName: string) {
  const ws = XLSX.utils.aoa_to_sheet([header, ...rows])
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, sheetName.slice(0, 31))
  XLSX.writeFile(wb, fileName)
}

/** Exporta los ingresos ya cargados para el ejercicio activo — una fila por bandera con sus 12 meses. */
export function exportIngresosXlsx(ejercicio: number, rows: IngresoRow[]) {
  const header = ['Bandera', 'Código', 'País', 'División', ...monthLabelsShort]
  const data = rows.map((r) => [r.maestro.nombre, r.maestro.codigo, r.maestro.pais, r.maestro.division, ...monthKeys.map((k) => r.meses[k] ?? 0)])
  downloadSheet(header, data, `Ingresos ${ejercicio}`, `Ingresos_${ejercicio}.xlsx`)
}

/** Exporta la tabla de referencia Bandera/País/División — necesidad distinta a la anterior: sirve para
 * saber qué banderas existen y cómo se llaman exactamente, no cuánto ingreso tienen cargado. */
export function exportTablaReferenciaXlsx() {
  const header = ['Bandera', 'Código', 'País', 'División']
  const data = BANDERAS_MAESTRO.map((b) => [b.nombre, b.codigo, b.pais, b.division])
  downloadSheet(header, data, 'Bandera-País-División', 'Tabla_referencia_Bandera_Pais_Division.xlsx')
}

/** Plantilla para el "Importar": trae los nombres de bandera ya cargados carácter a carácter, para que
 * quien complete el Excel no tenga que tipearlos y se evite el error de nombre no coincidente. */
export function exportPlantillaImportacionXlsx() {
  const header = ['Bandera', ...monthLabelsShort]
  const data = BANDERAS_MAESTRO.map((b) => [b.nombre, ...monthKeys.map(() => 0)])
  downloadSheet(header, data, 'Plantilla Ingresos', 'Plantilla_importacion_ingresos.xlsx')
}
