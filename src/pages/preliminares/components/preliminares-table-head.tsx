import { cn } from '@/shared/lib/utils'
import { preliminaresColCounts, PRELIM_SUBPEP_COL_W } from '../lib/preliminares-table-cols'

const th = 'p-[8px_10px] text-left text-[11px] font-bold text-muted-foreground uppercase tracking-[0.03em] whitespace-nowrap border-b border-border bg-[#F4F6FB]'
const thGroup = 'p-[6px_8px] text-center text-[10.5px] font-bold whitespace-nowrap border-b border-border'
const thData = 'p-[9px_10px] text-right text-[11px] font-bold text-muted-foreground uppercase tracking-[0.03em] whitespace-nowrap border-b-2 border-border bg-[#F4F6FB]'
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
        <th colSpan={4} className={cn(thGroup, 'border-l-2 border-l-border text-cs-gris-oscuro')}>
          Ene–Jul / {mesLabel}
        </th>
        <th colSpan={2} className={cn(thGroup, 'border-l-2 border-l-border text-cs-gris-oscuro')}>
          Desvío vs. Plan
        </th>
        <th colSpan={2} className={cn(thGroup, 'border-l-2 border-l-border bg-primary/5 text-primary')}>
          Desvío vs. Forecast
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
        <th className={cn(th, 'text-center')}>{isN7 ? 'Estado' : 'Completitud'}</th>
        <th className={cn(thData, 'border-l-2 border-l-border')}>Real acumulado</th>
        <th className={thData}>Forecast del mes</th>
        <th className={thData}>Plan del mes</th>
        <th className={cn(thData, 'bg-[#EEF4FF] text-primary')}>Preliminar del mes</th>
        <th className={cn(thData, 'border-l-2 border-l-border')}>Desvío monto</th>
        <th className={cn(thData, 'text-center')}>Desvío %</th>
        <th className={cn(thData, 'border-l-2 border-l-border')}>Desvío monto</th>
        <th className={cn(thData, 'text-center')}>Desvío %</th>
      </tr>
    </thead>
  )
}
