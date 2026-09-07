import { cn } from '@/shared/lib/utils'
import { Icon } from '@/shared/ui'

interface CierreIndicatorProps {
  dias: number | null
  fecha: string | null
}

/** Ajuste P4: fecha de cierre contable SAP, visible para todos los usuarios (no solo CdG) — informa hasta cuándo gestionar facturas/OC. */
export function CierreIndicator({ dias, fecha }: CierreIndicatorProps) {
  if (dias === null || fecha === null) {
    return (
      <div className="inline-flex items-center gap-2 rounded-[10px] border border-border bg-[#F4F6FB] px-3.5 py-1.5 text-[12.5px] font-semibold text-muted-foreground">
        <Icon name="calendar" size={14} color="currentColor" />
        No hay fecha de cierre contable definida para este período
      </div>
    )
  }

  const urgent = dias <= 3
  const warning = dias <= 7
  const tone = urgent ? 'destructive' : warning ? 'warning' : 'success'

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-[10px] border px-3.5 py-1.5 text-[12.5px] font-semibold',
        tone === 'destructive' && 'border-destructive-line bg-destructive-surface text-destructive',
        tone === 'warning' && 'border-warning-line bg-warning-surface text-warning',
        tone === 'success' && 'border-success/30 bg-success-surface text-success',
      )}
    >
      <Icon name="calendar" size={14} color="currentColor" />
      <span>
        Cierre contable SAP: <strong>{fecha}</strong>
      </span>
      <span
        className={cn(
          'rounded-full px-2 py-0.5 text-[11px] font-bold text-white',
          tone === 'destructive' && 'bg-destructive',
          tone === 'warning' && 'bg-warning',
          tone === 'success' && 'bg-success',
        )}
      >
        Faltan {dias} días
      </span>
    </div>
  )
}
