import { DesvioChip, Icon } from '@/shared/ui'
import { formatMillones } from '@/shared/lib/format'
import { cn } from '@/shared/lib/utils'
import { pctVariacion, variacion } from '../lib/opex-it-chile-helpers'

export const th = 'p-[8px_10px] text-left text-[10.5px] font-bold tracking-[0.05em] text-muted-foreground uppercase'
export const thRight = `${th} text-right`

/** Alto fijo compartido por Servicios|PEP y Responsable|Cuenta Contable — mismo criterio que el
 * reporte original: ambos recuadros miden lo mismo; Responsable entra completo sin scroll, Servicios|
 * PEP (con más líneas) se desplaza internamente dentro de ese mismo alto. */
export const TABLE_SCROLL_HEIGHT = 560

/** Chevron de jerarquía igual al del reporte original: TODAS las filas de categoría lo muestran (así se
 * ve en Power BI), pero solo responde al click cuando la fila tiene hijos reales — para el resto es
 * decorativo, igual que en el reporte real (se verificó en vivo que esas filas no hacen nada al
 * clickearlas). */
export function RowChevron({ open, onClick }: { open: boolean; onClick?: () => void }) {
  const icon = <Icon name={open ? 'chevron_down' : 'chevron_right'} size={11} color={onClick ? 'currentColor' : '#C3C9D9'} />
  if (!onClick) return <span className="flex size-4 items-center justify-center text-muted-foreground/50">{icon}</span>
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex size-4 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-surface-hover"
    >
      {icon}
    </button>
  )
}

/** Celdas Proy/Plan/Var/%Var reutilizadas por las 4 tablas del reporte — mismo criterio de color en
 * todas: verde cuando el proyectado queda bajo el plan (ahorro), rojo cuando lo supera. */
export function VarCells({ proy, plan, muted, bold }: { proy: number; plan: number; muted?: boolean; bold?: boolean }) {
  const v = variacion(proy, plan)
  const textSize = cn(muted ? 'text-[12.5px] text-muted-foreground' : 'text-[13px] text-foreground', bold && 'font-bold')
  return (
    <>
      <td className={`p-[8px_10px] text-right ${textSize}`}>{formatMillones(proy)}</td>
      <td className={`p-[8px_10px] text-right ${textSize}`}>{formatMillones(plan)}</td>
      <td
        className={cn(
          'p-[8px_10px] text-right font-semibold',
          muted ? 'text-[12.5px]' : 'text-[13px]',
          v <= 0 ? 'text-[#067647]' : 'text-[#B42318]',
        )}
      >
        {v <= 0 ? '(' : '+'}
        {formatMillones(Math.abs(v))}
        {v <= 0 ? ')' : ''}
      </td>
      <td className="p-[8px_10px] text-right">
        <DesvioChip pct={pctVariacion(proy, plan)} />
      </td>
    </>
  )
}
