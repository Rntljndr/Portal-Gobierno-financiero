import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'

interface CardProps {
  /** `lg` = Slot / Card-chart (padding 24) · `md` = KpiCard LG / rr-svc-card (padding 16). */
  padding?: 'md' | 'lg'
  className?: string
  children: ReactNode
}

/** Slot / Card del design system: fondo blanco, radius 12, borde 1px #F1F3F8. */
export function Card({ padding = 'lg', className, children }: CardProps) {
  return <div className={cn('rounded-xl border border-border-table bg-white', padding === 'lg' ? 'p-6' : 'p-4', className)}>{children}</div>
}

interface CardTitleProps {
  title: ReactNode
  subtitle?: ReactNode
  className?: string
}

/** Título de Slot / Card-alert: Montserrat 18 w700 azul de marca; subtítulo 12 muted. */
export function CardTitle({ title, subtitle, className }: CardTitleProps) {
  return (
    <div className={className}>
      <div className="text-lg leading-snug font-bold text-primary">{title}</div>
      {subtitle && <div className="mt-0.5 text-xs text-muted-foreground">{subtitle}</div>}
    </div>
  )
}

/** List / Action-card del design system: fondo blanco, radius 8, borde #EDEDED, padding 16, gap 12. */
export function ActionCard({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('flex items-start gap-3 rounded-lg border border-cs-gris bg-white p-4', className)}>{children}</div>
}

/** BanToolbar del design system: barra de filtros blanca, radius 8, borde #EDEDED, padding 16, gap 12. */
export function Toolbar({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('flex flex-wrap items-center gap-3 rounded-lg border border-cs-gris bg-white p-4', className)}>{children}</div>
}

interface ConfigRowProps {
  title: string
  description?: ReactNode
  /** Control a la derecha (Switch, SegmentedTabs…). */
  control?: ReactNode
  disabled?: boolean
  /** `compact` (padding 16) para listas largas dentro de un drawer; por defecto padding 24 del Penpot. */
  compact?: boolean
  children?: ReactNode
}

/** Drw-config-row del design system: fondo #F3F5FC, radius 12, borde rgba(6,20,148,0.10), padding 24,
 * título Montserrat 14 w700 azul. */
export function ConfigRow({ title, description, control, disabled, compact, children }: ConfigRowProps) {
  return (
    <div className={cn('flex flex-col gap-3 rounded-xl border', compact ? 'p-4' : 'p-6', disabled ? 'border-transparent bg-surface-disabled text-text-disabled' : 'border-border bg-surface-elevated')}>
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className={cn('text-sm font-bold', disabled ? 'text-inherit' : 'text-primary')}>{title}</div>
          {description && <div className="mt-1 text-xs text-muted-foreground">{description}</div>}
        </div>
        {control}
      </div>
      {children}
    </div>
  )
}
