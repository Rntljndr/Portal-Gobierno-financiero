import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'
import type { ForecastIdentidadBase, ForecastIdentidadN4, ForecastIdentidadN7 } from '../lib/forecast-identidad'
import { forecastIdentityDefaultVisible } from '../lib/forecast-identity-cols'
import { ForecastCompletitudBadge } from './forecast-completitud-badge'
import { ForecastEnvioEstadoBadge } from './forecast-envio-estado-badge'

const td = 'p-[10px_8px] text-[12px] whitespace-nowrap text-cs-gris-oscuro'

interface ForecastIdentityCellsProps {
  identidad: ForecastIdentidadN4 | ForecastIdentidadN7
  /** Columnas visibles (botón "Columnas") — todas por defecto en pantallas que todavía no lo ofrecen. */
  visibleCols?: string[]
}

function isN7(identidad: ForecastIdentidadBase | ForecastIdentidadN7): identidad is ForecastIdentidadN7 {
  return 'centroCosto' in identidad
}

/** Celdas de identidad copiadas de ForecastN4Historico/ForecastN7Historico (F) — misma cantidad y
 * orden que ForecastIdentityHeaderCells (y que ForecastIdentityCols para el botón "Columnas").
 * "Completitud" (M6) solo existe a nivel N4, al lado de Moneda; "Estado" (F) solo existe a nivel N7,
 * al lado de la Llave de Distribución — ninguna de las dos aplica al otro nivel. */
export function ForecastIdentityCells({ identidad, visibleCols }: ForecastIdentityCellsProps) {
  const n7 = isN7(identidad) ? identidad : null
  const variant = n7 ? 'n7' : 'n4'
  const visible = new Set(visibleCols ?? forecastIdentityDefaultVisible(variant))

  const cells: { key: string; content: ReactNode; align?: 'right' | 'center' }[] = n7
    ? [
        { key: 'codigo', content: identidad.pep },
        { key: 'pais', content: identidad.pais },
        { key: 'gerenciaPadre', content: identidad.gerenciaPadre },
        { key: 'gerencia', content: identidad.gerencia },
        { key: 'equipo', content: identidad.equipo },
        { key: 'centroCosto', content: n7.centroCosto },
        { key: 'asignacion', content: n7.asignacion },
        { key: 'bandera', content: n7.bandera },
        { key: 'cuentaContable', content: identidad.cuentaContable },
        { key: 'moneda', content: identidad.moneda },
        { key: 'rubro', content: identidad.rubro },
        { key: 'llave', content: `${n7.llaveDistribucionPct.toFixed(1)}%`, align: 'right' },
        { key: 'estado', content: <ForecastEnvioEstadoBadge estado={n7.envioEstado} />, align: 'center' },
      ]
    : [
        { key: 'codigo', content: identidad.pep },
        { key: 'pais', content: identidad.pais },
        { key: 'gerenciaPadre', content: identidad.gerenciaPadre },
        { key: 'gerencia', content: identidad.gerencia },
        { key: 'equipo', content: identidad.equipo },
        { key: 'cuentaContable', content: identidad.cuentaContable },
        { key: 'moneda', content: identidad.moneda },
        { key: 'rubro', content: identidad.rubro },
        { key: 'completitud', content: <ForecastCompletitudBadge pct={(identidad as ForecastIdentidadN4).completitudPct} />, align: 'center' },
      ]

  return (
    <>
      {cells
        .filter((c) => visible.has(c.key))
        .map((c) => {
          // A8: truncar con tooltip las columnas de texto libre (no las de código/%/badge) — un valor
          // largo (ej. Gerencia Padre) no debe desbordar el layout de la tabla.
          const isTexto = typeof c.content === 'string' && !c.align
          return (
            <td key={c.key} className={cn(td, c.key === 'codigo' && 'font-mono text-[11px]', c.align === 'right' && 'text-right tabular-nums', c.align === 'center' && 'text-center')}>
              {isTexto ? (
                <div className="max-w-[140px] truncate" title={c.content as string}>
                  {c.content}
                </div>
              ) : (
                c.content
              )}
            </td>
          )
        })}
    </>
  )
}
