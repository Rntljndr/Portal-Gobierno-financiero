import { cn } from '@/shared/lib/utils'
import { monthLabels } from '@/data/reporteria'
import { REALES_LAST_CLOSED } from '@/data/reales'
import { PROYECCION_ANUAL_COLS, PROYECCION_ANUAL_LABEL, RESUMEN_ACUMULADO_COLS, RESUMEN_ACUMULADO_LABEL } from '@/shared/lib/resumen-blocks'
import { preliminaresColCounts, PRELIM_SUBPEP_COL_W } from '../lib/preliminares-table-cols'

const th = 'p-[8px_10px] text-left text-[11px] font-bold text-muted-foreground uppercase tracking-[0.03em] whitespace-nowrap border-b border-border bg-[#F4F6FB]'
const thGroup = 'p-[6px_8px] text-center text-[10.5px] font-bold whitespace-nowrap border-b border-border'
const thSubPep = 'sticky z-[2] min-w-[140px]'

interface PreliminaresTableHeadProps {
  isN7: boolean
  selectable: boolean
  mesLabel: string
  showSubPepCol?: boolean
  identityLabel?: string
}

export function PreliminaresTableHead({ isN7, selectable, mesLabel, showSubPepCol = true, identityLabel }: PreliminaresTableHeadProps) {
  const { leading, afterSticky } = preliminaresColCounts(isN7, selectable, showSubPepCol)
  const showSubPep = isN7 && showSubPepCol
  const identitySticky = showSubPep ? 'left-[72px]' : 'left-0'
  const identityText = identityLabel ?? (isN7 ? 'PEP N7' : 'PEP N4')

  return (
    <thead>
      <tr>
        {leading > 0 && <th colSpan={leading} className="border-b border-border bg-[#F4F6FB]" />}
        {showSubPep && <th className={cn(th, 'sticky left-0 z-[2]', PRELIM_SUBPEP_COL_W)} />}
        <th className={cn(th, 'sticky z-[2]', identitySticky)} />
        <th colSpan={afterSticky} className="border-b border-border bg-[#F4F6FB]" />
        <th colSpan={REALES_LAST_CLOSED} className={cn(thGroup, 'border-l-2 border-l-[#C4DFFF] bg-[#EEF4FF] text-primary')}>
          Real · Ene-Jul (meses cerrados)
        </th>
        <th className={cn(thGroup, 'border-l-2 border-l-[#FDE68A] bg-[#FFFBEB] text-[#B45309]')}>Preliminar · {mesLabel}</th>
        <th colSpan={11 - REALES_LAST_CLOSED} className={cn(thGroup, 'border-l-2 border-l-[#CBD5E1] text-muted-foreground')}>
          Forecast · resto del año
        </th>
        <th colSpan={RESUMEN_ACUMULADO_COLS.length} className={cn(thGroup, 'border-l-2 border-l-border text-cs-gris-oscuro')}>
          {RESUMEN_ACUMULADO_LABEL}
        </th>
        <th colSpan={PROYECCION_ANUAL_COLS.length} className={cn(thGroup, 'border-l-2 border-l-border bg-primary/5 text-primary')}>
          {PROYECCION_ANUAL_LABEL}
        </th>
      </tr>
      <tr>
        {selectable && <th className={cn(th, 'w-9 text-center')} />}
        {showSubPep && <th className={cn(th, 'sticky left-0 z-[2] text-center', PRELIM_SUBPEP_COL_W)}>SubPEP</th>}
        <th className={cn(th, isN7 ? cn(thSubPep, identitySticky) : 'font-bold text-cs-gris-oscuro')}>{identityText}</th>
        <th className={th}>Código</th>
        <th className={th}>País</th>
        <th className={th}>Ger. Padre</th>
        <th className={th}>Gerencia</th>
        {isN7 && <th className={th}>Equipo</th>}
        {isN7 && <th className={th}>C. Costo</th>}
        {isN7 && <th className={th}>Asignación</th>}
        <th className={th}>Cta. Cont.</th>
        <th className={th}>Moneda</th>
        {isN7 && <th className={cn(th, 'text-center')}>Estado</th>}
        {monthLabels.map((label, i) => {
          const closed = i < REALES_LAST_CLOSED
          const current = i === REALES_LAST_CLOSED
          return (
            <th
              key={label}
              className={cn(
                'min-w-[62px] p-[8px_4px_6px] text-right text-[11px] font-bold whitespace-nowrap border-b-2',
                closed ? 'border-b-[#C4DFFF] bg-primary/5 text-primary' : current ? 'border-b-[#FDE68A] bg-[#FFFBEB] text-[#B45309]' : 'border-b-border bg-[#F8F9FD] text-muted-foreground',
                i === 0 && 'border-l-2 border-l-[#C4DFFF]',
                current && 'border-l-2 border-l-[#FDE68A]',
                i === REALES_LAST_CLOSED + 1 && 'border-l-2 border-l-[#CBD5E1]',
              )}
            >
              <div>{label.slice(0, 3)}</div>
              <div className="mt-px text-[8px] font-semibold opacity-75">{closed ? 'Real' : current ? 'Prelim' : 'FC'}</div>
            </th>
          )
        })}
        {RESUMEN_ACUMULADO_COLS.map((c, i) => (
          <th key={c.key} className={cn(th, i === 0 && 'border-l-2 border-l-border', c.key === 'desvioAcumPct' ? 'text-center' : 'text-right')}>
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
