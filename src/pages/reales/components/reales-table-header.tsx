import { cn } from '@/shared/lib/utils'
import { REALES_LAST_CLOSED, monthLabels } from '@/data/reales'
import { PROYECCION_ANUAL_COLS, PROYECCION_ANUAL_LABEL, resumenAcumuladoLabel, RESUMEN_ACUMULADO_COLS } from '@/shared/lib/resumen-blocks'
import { realesColsForMode, REALES_SUBPEP_COL_W } from '../lib/reales-table-cols'

const thGroup = 'p-[6px_8px] text-center text-[10.5px] font-bold whitespace-nowrap border-b border-border'
const th = 'p-[9px_8px] text-left text-[10.5px] font-bold tracking-[0.04em] text-muted-foreground uppercase whitespace-nowrap border-b-2 border-border bg-[#F4F6FB]'

interface RealesTableHeaderProps {
  mode: 'n4' | 'n7'
  visibleCols: string[]
  showSubPepCol?: boolean
  identityLabel?: string
}

export function RealesTableHeader({ mode, visibleCols, showSubPepCol = true, identityLabel }: RealesTableHeaderProps) {
  const cols = realesColsForMode(mode).filter((c) => visibleCols.includes(c.key))
  const showSubPep = mode === 'n7' && showSubPepCol
  const identitySticky = showSubPep ? 'left-[72px]' : 'left-0'
  const label = identityLabel ?? (mode === 'n7' ? 'PEP N7' : 'Servicio')
  const labelN4 = identityLabel ?? (mode === 'n7' ? 'PEP N7' : 'Servicio N4')

  return (
    <thead>
      <tr>
        {showSubPep && <th className={cn(th, 'sticky left-0 z-[2]', REALES_SUBPEP_COL_W)} />}
        <th className={cn(th, 'sticky z-[2]', identitySticky)}>{label}</th>
        <th colSpan={cols.length} className="border-b border-border bg-[#F4F6FB]" />
        <th colSpan={REALES_LAST_CLOSED} className={cn(thGroup, 'border-l-2 border-l-[#C4DFFF] bg-[#EEF4FF] text-primary')}>
          Real · Ene-Jul (meses cerrados)
        </th>
        <th colSpan={12 - REALES_LAST_CLOSED} className={cn(thGroup, 'border-l-2 border-l-[#CBD5E1] text-muted-foreground')}>
          Forecast · Ago-Dic (proyectado)
        </th>
        <th colSpan={RESUMEN_ACUMULADO_COLS.length} className={cn(thGroup, 'border-l-2 border-l-border text-cs-gris-oscuro')}>
          {resumenAcumuladoLabel()}
        </th>
        <th colSpan={PROYECCION_ANUAL_COLS.length} className={cn(thGroup, 'border-l-2 border-l-border bg-primary/5 text-primary')}>
          {PROYECCION_ANUAL_LABEL}
        </th>
      </tr>
      <tr>
        {showSubPep && <th className={cn(th, 'sticky left-0 z-[2] text-center', REALES_SUBPEP_COL_W)}>SubPEP</th>}
        <th className={cn(th, 'sticky z-[2] min-w-[140px]', identitySticky)}>{labelN4}</th>
        {cols.map((c) => (
          <th key={c.key} className={cn(th, 'min-w-[85px]')}>
            {c.label}
          </th>
        ))}
        {monthLabels.map((label, i) => {
          const closed = i < REALES_LAST_CLOSED
          return (
            <th
              key={label}
              className={cn(
                'min-w-[62px] p-[8px_4px_6px] text-right text-[11px] font-bold whitespace-nowrap border-b-2',
                closed ? 'border-b-[#C4DFFF] bg-primary/5 text-primary' : 'border-b-border bg-[#F8F9FD] text-muted-foreground',
                i === 0 && (closed ? 'border-l-2 border-l-[#C4DFFF]' : 'border-l-2 border-l-[#CBD5E1]'),
                i === REALES_LAST_CLOSED && 'border-l-2 border-l-[#CBD5E1]',
              )}
            >
              <div>{label.slice(0, 3)}</div>
              <div className="mt-px text-[8px] font-semibold opacity-75">{closed ? 'Real' : 'FC'}</div>
            </th>
          )
        })}
        {RESUMEN_ACUMULADO_COLS.map((c, i) => (
          <th key={c.key} className={cn(th, i === 0 && 'border-l-2 border-l-border', c.key.startsWith('desvioAcumPct') ? 'text-center' : 'text-right')}>
            {c.label}
          </th>
        ))}
        {PROYECCION_ANUAL_COLS.map((c, i) => (
          <th key={c.key} className={cn(th, 'bg-primary/5 text-primary', i === 0 && 'border-l-2 border-l-border', c.key === 'desvioAnualPct' ? 'text-center' : 'text-right')}>
            {c.label}
          </th>
        ))}
      </tr>
    </thead>
  )
}
