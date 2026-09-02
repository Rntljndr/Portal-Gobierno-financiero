import { cn } from '@/shared/lib/utils'

const th = 'p-[8px_10px] text-left text-[11px] font-bold text-muted-foreground uppercase tracking-[0.03em] whitespace-nowrap border-b border-border bg-[#F4F6FB]'
const thNum = `${th} text-right bg-primary/5`
const thSubPep = 'sticky left-0 z-[2] min-w-[140px]'

interface PreliminaresTableHeadProps {
  isN7: boolean
  selectable: boolean
  mesLabel: string
}

export function PreliminaresTableHead({ isN7, selectable, mesLabel }: PreliminaresTableHeadProps) {
  return (
    <thead>
      <tr>
        {selectable && <th className={cn(th, 'w-9 text-center')} />}
        <th className={cn(th, isN7 ? thSubPep : 'font-bold text-cs-gris-oscuro')}>{isN7 ? 'Sub PEP' : 'PEP N4'}</th>
        {isN7 && <th className={cn(th, 'font-bold text-cs-gris-oscuro')}>PEP N7</th>}
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
        {isN7 && <th className={cn(th, 'text-center')}>Actualización</th>}
        <th className={cn(thNum, 'border-l-2 border-l-primary/20')}>Acum. Real (Ene-Jul)</th>
        <th className={thNum}>Real del mes</th>
        <th className={thNum}>FC {mesLabel}</th>
        <th className={thNum}>Plan del mes</th>
        <th className={thNum}>Preliminar</th>
        <th className={thNum}>Desvío</th>
        <th className={cn(thNum, 'text-center')}>% Desvío</th>
      </tr>
    </thead>
  )
}
