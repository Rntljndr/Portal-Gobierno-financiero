import { cn } from '@/shared/lib/utils'
import { DIMENSIONES, type DimensionKey } from '../lib/dimensiones'

interface ConsolidadoDimensionTabsProps {
  dim: DimensionKey
  onChangeDim: (dim: DimensionKey) => void
  showExpandAll: boolean
  allExpanded: boolean
  onExpandAll: () => void
}

export function ConsolidadoDimensionTabs({ dim, onChangeDim, showExpandAll, allExpanded, onExpandAll }: ConsolidadoDimensionTabsProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border p-[10px_14px]">
      <div className="flex flex-wrap gap-1">
        {DIMENSIONES.map((d) => (
          <button
            key={d.key}
            type="button"
            onClick={() => onChangeDim(d.key)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-[12.5px] font-semibold text-muted-foreground hover:bg-surface-hover',
              d.key === dim && 'bg-primary/10 text-primary',
            )}
          >
            {d.label}
          </button>
        ))}
      </div>
      {showExpandAll && (
        <button type="button" onClick={onExpandAll} className="text-[12px] font-semibold text-primary hover:underline">
          {allExpanded ? 'Contraer todo' : 'Expandir todo'}
        </button>
      )}
    </div>
  )
}
