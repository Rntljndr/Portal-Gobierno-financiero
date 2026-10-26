import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'

interface DimensionTabsProps<T extends string> {
  value: T
  onChange: (v: T) => void
  options: { value: T; label: string }[]
  /** Acción a la derecha de la barra (p. ej. "Expandir todo"). */
  extra?: ReactNode
  className?: string
}

/** Pestañas de dimensión de una tabla (País, División, Negocio…): barra con borde inferior y la pestaña
 * activa en azul suave. Es la del "Detalle del presupuesto consolidado" del Reporte Tecnología. */
export function DimensionTabs<T extends string>({ value, onChange, options, extra, className }: DimensionTabsProps<T>) {
  return (
    <div className={cn('flex flex-wrap items-center justify-between gap-2 border-b border-border p-[10px_14px]', className)} role="tablist">
      <div className="flex flex-wrap gap-1">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={o.value === value}
            onClick={() => onChange(o.value)}
            className={cn('rounded-lg px-3 py-1.5 text-xs font-bold text-muted-foreground hover:bg-surface-hover', o.value === value && 'bg-primary/10 text-primary')}
          >
            {o.label}
          </button>
        ))}
      </div>
      {extra}
    </div>
  )
}
