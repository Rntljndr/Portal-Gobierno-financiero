import { cn } from '@/shared/lib/utils'
import { REALES_LAST_CLOSED, monthLabels } from '@/data/reales'

const thGroup = 'p-[6px_8px] text-center text-[10.5px] font-bold whitespace-nowrap border-b border-border'
const th = 'p-[9px_8px] text-left text-[10.5px] font-bold tracking-[0.04em] text-muted-foreground uppercase whitespace-nowrap border-b-2 border-border bg-[#F4F6FB]'

const identityColsN4 = ['Código', 'País', 'Ger. Padre', 'Gerencia', 'Equipo', 'Cta. Contable', 'País Destino', 'Moneda']
const identityColsN7 = ['PEP N7', 'Código', 'País', 'Ger. Padre', 'Gerencia', 'Equipo', 'C. Costo', 'Asignación', 'Bandera', 'Cta. Cont.', 'País Destino', 'Moneda']

interface RealesTableHeaderProps {
  mode: 'n4' | 'n7'
}

export function RealesTableHeader({ mode }: RealesTableHeaderProps) {
  const identityCols = mode === 'n7' ? identityColsN7 : identityColsN4

  return (
    <thead>
      <tr>
        <th className={cn(th, 'sticky left-0 z-[2]')}>{mode === 'n7' ? 'Sub PEP' : 'Servicio'}</th>
        <th colSpan={identityCols.length} className="border-b border-border bg-[#F4F6FB]" />
        <th colSpan={REALES_LAST_CLOSED} className={cn(thGroup, 'border-l-2 border-l-[#C4DFFF] bg-[#EEF4FF] text-primary')}>
          Real · Ene-Jul (meses cerrados)
        </th>
        <th colSpan={12 - REALES_LAST_CLOSED} className={cn(thGroup, 'border-l-2 border-l-[#CBD5E1] text-muted-foreground')}>
          Forecast · Ago-Dic (proyectado)
        </th>
        <th colSpan={6} className={cn(thGroup, 'border-l-2 border-l-border text-cs-gris-oscuro')}>
          Resumen anual
        </th>
      </tr>
      <tr>
        <th className={cn(th, 'sticky left-0 z-[2] min-w-[140px]')}>{mode === 'n7' ? 'Sub PEP' : 'Servicio N4'}</th>
        {identityCols.map((label) => (
          <th key={label} className={cn(th, 'min-w-[85px]')}>
            {label}
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
        <th className={cn(th, 'border-l-2 border-l-border text-right')}>Plan Total</th>
        <th className={cn(th, 'bg-primary/5 text-right text-primary')}>
          <div>Acum. Real</div>
          <div className="text-[9px] font-medium text-muted-foreground normal-case">Ene-Jul</div>
        </th>
        <th className={cn(th, 'text-right')}>Disponible</th>
        <th className={cn(th, 'text-right text-[#6922E7]')}>
          <div>Real + FC</div>
          <div className="text-[9px] font-medium text-muted-foreground normal-case">Proyección anual</div>
        </th>
        <th className={cn(th, 'text-right')}>Desvío</th>
        <th className={cn(th, 'text-center')}>% Desvío</th>
      </tr>
    </thead>
  )
}
