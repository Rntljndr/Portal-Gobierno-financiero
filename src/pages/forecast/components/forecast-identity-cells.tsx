import { cn } from '@/shared/lib/utils'
import { Badge } from '@/shared/ui'
import type { ForecastIdentidadBase, ForecastIdentidadN7 } from '../lib/forecast-identidad'

const td = 'p-[10px_8px] text-[12px] whitespace-nowrap text-cs-gris-oscuro'

function EstadoCell({ estado }: { estado: string }) {
  return <Badge variant={estado === 'Manual' ? 'warning' : 'neutral'}>{estado}</Badge>
}

interface ForecastIdentityCellsProps {
  identidad: ForecastIdentidadBase | ForecastIdentidadN7
}

function isN7(identidad: ForecastIdentidadBase | ForecastIdentidadN7): identidad is ForecastIdentidadN7 {
  return 'centroCosto' in identidad
}

/** Celdas de identidad copiadas de ForecastN4Historico/ForecastN7Historico (F) — misma cantidad y
 * orden que ForecastIdentityHeaderCells. */
export function ForecastIdentityCells({ identidad }: ForecastIdentityCellsProps) {
  const n7 = isN7(identidad) ? identidad : null

  return (
    <>
      <td className={td}>{identidad.codServicio}</td>
      <td className={td}>{identidad.pais}</td>
      <td className={td}>{identidad.moneda}</td>
      <td className={td}>{identidad.gerenciaPadre}</td>
      <td className={td}>{identidad.gerencia}</td>
      <td className={td}>{identidad.equipo}</td>
      {n7 && <td className={td}>{n7.centroCosto}</td>}
      {n7 && <td className={td}>{n7.bandera}</td>}
      <td className={td}>{identidad.cuentaContable}</td>
      {n7 && <td className={td}>{n7.asignacion}</td>}
      {n7 && <td className={cn(td, 'text-right tabular-nums')}>{n7.llavePlanPct.toFixed(1)}%</td>}
      {n7 && <td className={cn(td, 'text-right tabular-nums')}>{n7.llaveForecastPct.toFixed(1)}%</td>}
      <td className={cn(td, 'font-mono text-[11px]')}>{identidad.pep}</td>
      <td className={td}>
        <EstadoCell estado={identidad.estado} />
      </td>
    </>
  )
}
