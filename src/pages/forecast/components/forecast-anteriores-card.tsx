import { Icon } from '@/shared/ui'

interface ForecastAnterioresCardProps {
  count: number
  onClick: () => void
}

/** Card clickeable: al seleccionarla abre ForecastAnterioresDrawer con el listado de forecasts
 * cerrados (info + tasas de cambio de cada uno). */
export function ForecastAnterioresCard({ count, onClick }: ForecastAnterioresCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={count === 0}
      className="flex-1 rounded-xl border border-border bg-white p-5 text-left transition-colors hover:border-primary/40 hover:bg-[#F8FAFF] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-border disabled:hover:bg-white"
    >
      <div className="mb-1.5 flex items-center justify-between">
        <div className="text-[11px] font-bold tracking-[0.07em] text-muted-foreground uppercase">Forecasts Anteriores</div>
        <Icon name="chevron_right" size={14} color="#8A90A2" />
      </div>
      <div className="mb-4 flex items-baseline gap-2">
        <span className="text-[26px] font-extrabold text-foreground">{count}</span>
        <span className="text-[13px] text-muted-foreground">
          forecast{count === 1 ? '' : 's'} cerrado{count === 1 ? '' : 's'}
        </span>
      </div>
      <div className="text-[12px] font-semibold text-primary">{count > 0 ? 'Ver listado y tasas de cambio →' : 'Todavía no hay forecasts cerrados'}</div>
    </button>
  )
}
