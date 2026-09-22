import { cn } from '@/shared/lib/utils'
import { monthLabels } from '@/data/reporteria'
import { FORECAST_ACUMULADO_COLS, FORECAST_PROYECCION_COLS, FORECAST_PROYECCION_LABEL } from '../lib/forecast-resumen-labels'

const thGroup = 'p-[6px_8px] text-center text-[10.5px] font-bold whitespace-nowrap border-b border-border'
const th = 'p-[9px_8px] text-left text-[10.5px] font-bold tracking-[0.04em] text-muted-foreground uppercase whitespace-nowrap border-b-2 border-border bg-[#F4F6FB]'

interface ForecastTableHeaderProps {
  cutoff: number
  identityLabel: string
}

export function ForecastTableHeader({ cutoff, identityLabel }: ForecastTableHeaderProps) {
  return (
    <thead>
      <tr>
        <th className={cn(th, 'sticky left-0 z-[2]')} />
        <th colSpan={cutoff} className={cn(thGroup, 'border-l-2 border-l-[#C4DFFF] bg-[#EEF4FF] text-primary')}>
          Real (YTD) · {monthLabels[0].slice(0, 3)}-{monthLabels[cutoff - 1].slice(0, 3)}
        </th>
        <th colSpan={12 - cutoff} className={cn(thGroup, 'border-l-2 border-l-[#CBD5E1] text-muted-foreground')}>
          Forecast (YTG) · {monthLabels[cutoff].slice(0, 3)}-{monthLabels[11].slice(0, 3)}
        </th>
        <th colSpan={FORECAST_ACUMULADO_COLS.length} className={cn(thGroup, 'border-l-2 border-l-border text-cs-gris-oscuro')}>
          {cutoff > 0 ? `Acumulado ${monthLabels[0]}–${monthLabels[cutoff - 1]}` : 'Acumulado'}
        </th>
        <th colSpan={FORECAST_PROYECCION_COLS.length} className={cn(thGroup, 'border-l-2 border-l-border bg-primary/5 text-primary')}>
          {FORECAST_PROYECCION_LABEL}
        </th>
      </tr>
      <tr>
        <th className={cn(th, 'sticky left-0 z-[2] min-w-[170px]')}>{identityLabel}</th>
        {monthLabels.map((label, i) => {
          const closed = i < cutoff
          return (
            <th
              key={label}
              className={cn(
                'min-w-[62px] p-[8px_4px_6px] text-right text-[11px] font-bold whitespace-nowrap border-b-2',
                closed ? 'border-b-[#C4DFFF] bg-primary/5 text-primary' : 'border-b-border bg-[#F8F9FD] text-muted-foreground',
                i === 0 && (closed ? 'border-l-2 border-l-[#C4DFFF]' : 'border-l-2 border-l-[#CBD5E1]'),
                i === cutoff && 'border-l-2 border-l-[#CBD5E1]',
              )}
            >
              <div>{label.slice(0, 3)}</div>
              <div className="mt-px text-[8px] font-semibold opacity-75">{closed ? 'Real' : 'FC'}</div>
            </th>
          )
        })}
        {FORECAST_ACUMULADO_COLS.map((c, i) => (
          <th key={c.key} className={cn(th, i === 0 && 'border-l-2 border-l-border', c.key.startsWith('desvioAcumPct') ? 'text-center' : 'text-right')}>
            {c.label}
          </th>
        ))}
        {FORECAST_PROYECCION_COLS.map((c, i) => (
          <th key={c.key} className={cn(th, 'bg-primary/5 text-primary', i === 0 && 'border-l-2 border-l-border', c.key === 'desvioAnualPct' ? 'text-center' : 'text-right')}>
            {c.label}
          </th>
        ))}
      </tr>
    </thead>
  )
}
