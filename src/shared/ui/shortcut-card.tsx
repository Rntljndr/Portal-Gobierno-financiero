import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { cn } from '@/shared/lib/utils'
import { Icon, type IconName } from './icon'

export interface Shortcut {
  label: string
  to: string
  descripcion: string
  icon: IconName
}

/** Tarjeta de acceso a una sección (la de la pantalla de Administración): ícono, nombre, descripción corta
 * y chevrón; toda la tarjeta navega. */
export function ShortcutCard({ label, to, descripcion, icon }: Shortcut) {
  const navigate = useNavigate()
  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      className="group flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 text-left transition-colors hover:border-primary hover:bg-primary/5"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon name={icon} size={16} color="currentColor" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-bold text-foreground">{label}</span>
        <span className="block truncate text-xs text-muted-foreground">{descripcion}</span>
      </span>
      <span className="text-muted-foreground group-hover:text-primary">
        <Icon name="chevron_right" size={14} color="currentColor" />
      </span>
    </button>
  )
}

interface ShortcutGroupProps {
  label: string
  icon: IconName
  /** Etiqueta de estado junto al título del grupo (p. ej. "En curso"). */
  badge?: ReactNode
  secciones: Shortcut[]
  /** Clases de la grilla de tarjetas (por defecto 1 · 2 · 3 columnas). */
  gridClassName?: string
  /** false = título fijo, sin chevrón (grupos que no se pliegan). */
  collapsible?: boolean
}

/** Grupo colapsable de accesos: título en mayúsculas con ícono y chevrón (mismo patrón que el sidebar),
 * abierto por defecto. */
export function ShortcutGroup({ label, icon, badge, secciones, gridClassName, collapsible = true }: ShortcutGroupProps) {
  const [open, setOpen] = useState(true)
  return (
    <div>
      <div className="mb-2.5 flex items-center gap-2">
        {collapsible ? (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="flex items-center gap-1.5 text-left text-xs font-bold tracking-wider whitespace-nowrap text-muted-foreground uppercase hover:text-foreground"
          >
            <Icon name={icon} size={14} color="currentColor" />
            {label}
            <Icon name={open ? 'chevron_up' : 'chevron_down'} size={12} color="currentColor" />
          </button>
        ) : (
          <h3 className="flex items-center gap-1.5 text-xs font-bold tracking-wider whitespace-nowrap text-muted-foreground uppercase">
            <Icon name={icon} size={14} color="currentColor" />
            {label}
          </h3>
        )}
        {badge}
      </div>
      {(open || !collapsible) && (
        <div className={cn('grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3', gridClassName)}>
          {secciones.map((s) => (
            <ShortcutCard key={s.to} {...s} />
          ))}
        </div>
      )}
    </div>
  )
}
