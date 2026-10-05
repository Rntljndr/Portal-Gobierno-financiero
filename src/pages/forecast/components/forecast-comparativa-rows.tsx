import type { ReactNode } from 'react'
import type { ResumenTotals } from '@/shared/lib/resumen-blocks'
import type { ForecastTablaComparativa } from '../lib/forecast-tabla-comparativa'
import { ForecastComparativaRow } from './forecast-comparativa-row'

interface ForecastComparativaRowsProps {
  comparativa: ForecastTablaComparativa
  variant: 'n4' | 'n7'
  cutoff: number
  totals: ResumenTotals
  planMeses: Record<string, number>
  anteriorMeses: Record<string, number> | undefined
  anteriorTotals: ResumenTotals | undefined
  /** Título del forecast anterior elegido — F: el tag muestra solo este nombre, sin el prefijo
   * "Forecast anterior:". */
  anteriorTitulo?: string
  /** Llave de Distribución del plan (solo variant="n7") — misma posición de columna que la fila principal. */
  identityExtra?: { colIndex: number; content: ReactNode }
  hasCheckboxCol?: boolean
  /** F: columna fija "SubPEP" (solo variant="n7", ver ForecastN7FlatTable) — igual que hasCheckboxCol,
   * desplaza dónde queda sticky la columna de nombre. */
  hasSubPepCol?: boolean
  /** Cantidad de columnas de identidad visibles (botón "Columnas") — todas por defecto. */
  identityColCount?: number
  /** "Contraer"/"Expandir" (M7/Comparar) de esta línea — mientras está colapsada no se dibuja ninguna fila. */
  colapsado?: boolean
}

/** Filas de comparación (Plan y/o Forecast anterior) bajo una línea de servicio — extraído para no
 * repetir la misma lógica de armado en las tres tablas (N4, N7 por servicio, N7 plano) y mantenerlas
 * bajo el límite de líneas del linter. */
export function ForecastComparativaRows({ comparativa, variant, cutoff, totals, planMeses, anteriorMeses, anteriorTotals, anteriorTitulo, identityExtra, hasCheckboxCol, hasSubPepCol, identityColCount, colapsado }: ForecastComparativaRowsProps) {
  if (colapsado) return null

  return (
    <>
      {comparativa.plan && (
        <ForecastComparativaRow
          label="Plan"
          color="#0047B0"
          bg="#F7FAFF"
          border="#C8D9F5"
          refMeses={planMeses}
          totals={totals}
          ownAcum={totals.planAcum}
          ownAnual={totals.plan}
          cutoff={cutoff}
          variant={variant}
          identityExtra={identityExtra}
          hasCheckboxCol={hasCheckboxCol}
          hasSubPepCol={hasSubPepCol}
          identityColCount={identityColCount}
        />
      )}
      {anteriorMeses && anteriorTotals && (
        <ForecastComparativaRow
          label={anteriorTitulo ?? 'Forecast anterior'}
          color="#22976B"
          bg="#F3FAF7"
          border="#AADCC4"
          refMeses={anteriorMeses}
          totals={totals}
          ownAcum={anteriorTotals.real}
          ownAnual={anteriorTotals.realMasForecast}
          cutoff={cutoff}
          variant={variant}
          hasCheckboxCol={hasCheckboxCol}
          hasSubPepCol={hasSubPepCol}
          identityColCount={identityColCount}
        />
      )}
    </>
  )
}
