import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'

export interface DataListItem {
  label: string
  value: ReactNode
}

interface DataListProps {
  items: DataListItem[]
  /** `grid` reparte los ítems en columnas (p. ej. Plan / Real / Proyectado); `rows` los apila label ↔ valor. */
  layout?: 'rows' | 'grid'
  className?: string
}

/** DataList del design system: fondo #F8FAFC, radius 8, padding 12, gap 12; valor Montserrat 14 w700. */
export function DataList({ items, layout = 'rows', className }: DataListProps) {
  return (
    <dl
      className={cn(
        'rounded-lg bg-surface-subtle p-3',
        layout === 'grid' ? 'grid gap-3' : 'flex flex-col gap-2',
        className,
      )}
      style={layout === 'grid' ? { gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` } : undefined}
    >
      {items.map((it) => (
        <div key={it.label} className={layout === 'grid' ? 'flex flex-col gap-0.5' : 'flex items-baseline justify-between gap-3'}>
          <dt className="text-xs font-medium text-muted-foreground">{it.label}</dt>
          <dd className={cn('m-0 font-bold text-foreground tabular-nums', layout === 'grid' ? 'text-lg' : 'text-sm')}>{it.value}</dd>
        </div>
      ))}
    </dl>
  )
}
