import { cn } from '@/shared/lib/utils'

const FILL = {
  info: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-chart-warning',
  error: 'bg-destructive',
} as const

interface ProgressBarProps {
  /** 0–100 (se recorta visualmente a 100). */
  value: number
  variant?: keyof typeof FILL
  label?: string
  /** Texto a la derecha del label (por defecto el %). */
  valueLabel?: string
  /** Marca vertical de referencia (p. ej. el 100 % del plan), en la misma escala `max`. */
  marker?: number
  /** Escala de la barra (por defecto 100); útil para mostrar sobreejecución hasta 120 %. */
  max?: number
  className?: string
}

/** ProgressBar del design system: label Montserrat 12 w700 #2F2F2F, track #EEF1FB, barra de 12px,
 * variantes Info / Success / Warning / Error. */
export function ProgressBar({ value, variant = 'info', label, valueLabel, marker, max = 100, className }: ProgressBarProps) {
  const pct = (v: number) => `${Math.max(0, Math.min(v, max)) / (max / 100)}%`
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {(label || valueLabel) && (
        <div className="flex items-baseline justify-between gap-2 text-xs font-bold text-foreground">
          <span>{label}</span>
          <span className="tabular-nums">{valueLabel ?? `${Math.round(value)} %`}</span>
        </div>
      )}
      <div className="relative h-3 rounded-full bg-chart-track" role="progressbar" aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={max}>
        <div className={cn('absolute inset-y-0 left-0 rounded-full', FILL[variant])} style={{ width: pct(value) }} />
        {marker !== undefined && <div className="absolute -top-0.5 -bottom-0.5 w-0.5 rounded-full bg-cs-negro" style={{ left: pct(marker) }} />}
      </div>
    </div>
  )
}
