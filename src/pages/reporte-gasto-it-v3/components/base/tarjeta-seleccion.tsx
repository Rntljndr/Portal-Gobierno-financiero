import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'

interface TarjetaSeleccionProps {
  activo: boolean
  onClick: () => void
  titulo: string
  detalle: string
  valor: string
  /** Filas de contexto bajo la cifra (usar <FilaDato>). */
  children: ReactNode
}

/** Tarjeta seleccionable con su cifra principal (período del reporte, forecast vs preliminares): compacta,
 * con el radio a la derecha; la activa va con borde azul y fondo suave. */
export function TarjetaSeleccion({ activo, onClick, titulo, detalle, valor, children }: TarjetaSeleccionProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={activo}
      onClick={onClick}
      className={cn(
        'flex flex-col gap-2 rounded-xl border bg-white px-4 py-3 text-left transition-colors',
        activo ? 'border-primary bg-surface-hover shadow-m' : 'border-border-table hover:border-border-strong',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-xxs font-bold tracking-wider text-muted-foreground uppercase">{titulo}</div>
          <div className="truncate text-xs text-muted-foreground">{detalle}</div>
        </div>
        <span className={cn('mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border-2', activo ? 'border-primary' : 'border-border-strong')} aria-hidden>
          {activo && <span className="size-2 rounded-full bg-primary" />}
        </span>
      </div>
      <div className="text-xl leading-tight font-bold tracking-tight text-foreground tabular-nums">{valor}</div>
      <div className="flex flex-col gap-1.5 border-t border-border-table pt-2">{children}</div>
    </button>
  )
}

/** Fila de dato de una TarjetaSeleccion: etiqueta a la izquierda, valor (y su complemento) a la derecha. */
export function FilaDato({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="flex items-center gap-2 font-bold text-foreground tabular-nums">{children}</span>
    </div>
  )
}
