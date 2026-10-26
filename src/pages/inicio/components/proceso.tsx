import type { ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { Icon } from '@/shared/ui'
import { cn } from '@/shared/lib/utils'

export interface Paso {
  titulo: string
  detalle: ReactNode
  estado: 'hecho' | 'actual' | 'pendiente'
  to?: string
}

const PUNTO: Record<Paso['estado'], string> = {
  hecho: 'border-success bg-success text-white',
  actual: 'border-primary bg-primary text-white',
  pendiente: 'border-border-strong bg-white text-muted-foreground',
}

/** Etapas del proceso en vertical: hecho (✓ verde), en curso (azul) y pendiente (gris). Las etapas con
 * pantalla propia son enlaces. */
export function Proceso({ pasos }: { pasos: Paso[] }) {
  const navigate = useNavigate()
  return (
    <ol className="flex flex-col">
      {pasos.map((p, i) => {
        const contenido = (
          <>
            <div className="flex items-center gap-2">
              <span className={cn('text-sm font-bold', p.estado === 'pendiente' ? 'text-muted-foreground' : 'text-foreground')}>{p.titulo}</span>
              {p.estado === 'actual' && <span className="rounded-full bg-info-surface px-2 py-0.5 text-xs font-medium text-primary">En curso</span>}
              {p.to && (
                <span className="ml-auto text-primary">
                  <Icon name="chevron_right" size={14} color="currentColor" />
                </span>
              )}
            </div>
            <div className="mt-0.5 text-xs text-muted-foreground">{p.detalle}</div>
          </>
        )
        return (
          <li key={p.titulo} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span className={cn('flex size-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold', PUNTO[p.estado])}>
                {p.estado === 'hecho' ? <Icon name="check" size={12} color="currentColor" /> : i + 1}
              </span>
              {i < pasos.length - 1 && <span className={cn('w-0.5 flex-1', p.estado === 'hecho' ? 'bg-success' : 'bg-border-strong')} />}
            </div>
            {p.to ? (
              <button type="button" onClick={() => navigate(p.to!)} className="mb-3 min-w-0 flex-1 rounded-lg px-2 py-1 text-left hover:bg-surface-hover">
                {contenido}
              </button>
            ) : (
              <div className="mb-3 min-w-0 flex-1 px-2 py-1">{contenido}</div>
            )}
          </li>
        )
      })}
    </ol>
  )
}

/** Cifra clave del panel: etiqueta, valor y una línea de contexto. */
export function Cifra({ label, valor, detalle }: { label: string; valor: ReactNode; detalle?: ReactNode }) {
  return (
    <div className="min-w-0 rounded-lg bg-surface-elevated p-3">
      <div className="text-xxs font-bold tracking-wider text-muted-foreground uppercase">{label}</div>
      <div className="mt-1 text-lg font-bold text-foreground tabular-nums">{valor}</div>
      {detalle && <div className="mt-0.5 text-xs text-muted-foreground">{detalle}</div>}
    </div>
  )
}

/** Variación de gasto: rojo si sube, verde si baja. */
export function Var({ n, children }: { n: number; children: ReactNode }) {
  return <span className={n > 0.05 ? 'text-destructive' : n < -0.05 ? 'text-success' : 'text-muted-foreground'}>{children}</span>
}
