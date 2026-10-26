import { cn } from '@/shared/lib/utils'

export type StatusTab = 'todos' | 'pendientes' | 'enviados' | 'aprobados'

interface StatusTabsProps<K extends string> {
  active: K
  onChange: (tab: K) => void
  counts: Record<K, number>
  /** Pestañas; por defecto, los estados del ejercicio en planificación. */
  tabs?: { key: K; label: string }[]
}

const TABS: { key: StatusTab; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'pendientes', label: 'Pendientes' },
  { key: 'enviados', label: 'Enviados' },
  { key: 'aprobados', label: 'Validado' },
]

export function StatusTabs<K extends string = StatusTab>({ active, onChange, counts, tabs }: StatusTabsProps<K>) {
  const lista = tabs ?? (TABS as unknown as { key: K; label: string }[])
  return (
    <div className="flex flex-1 gap-1 border-b border-border">
      {lista.map((tab) => {
        const isActive = active === tab.key
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={cn(
              '-mb-px flex items-center gap-2 border-b-2 border-transparent px-3.5 py-2.5 text-[13px] font-semibold text-muted-foreground hover:text-cs-gris-oscuro',
              isActive && 'border-primary text-primary',
            )}
          >
            {tab.label}
            <span
              className={cn(
                'flex min-w-[22px] items-center justify-center rounded-full bg-cs-naranja px-1.5 py-0.5 text-[10.5px] font-bold text-white',
                !isActive && 'bg-slate-200 text-[#8A90A2]',
                isActive && 'bg-primary',
              )}
            >
              {counts[tab.key]}
            </span>
          </button>
        )
      })}
    </div>
  )
}
