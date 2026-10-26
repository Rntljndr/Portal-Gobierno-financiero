import { cn } from '@/shared/lib/utils'

/** Ancho mínimo visible (en % de la mitad de la barra) para que el color se vea aunque el monto sea chico. */
const MIN_VISIBLE = 6

/** Barra divergente delgada (8px, como ProgressBar/Theme): rojo hacia la derecha si va sobre plan, verde
 * hacia la izquierda si va bajo plan, siempre con un mínimo visible; sin barra solo si el desvío es 0. */
export function BarraDesvio({ monto, maxAbs }: { monto: number; maxAbs: number }) {
  const w = monto === 0 ? 0 : Math.max((Math.abs(monto) / maxAbs) * 50, (MIN_VISIBLE / 100) * 50)
  const sobre = monto > 0
  return (
    <div className="relative h-2 rounded-full bg-chart-track" aria-hidden>
      <div className="absolute -top-1 -bottom-1 left-1/2 w-px bg-border-table-strong" />
      {w > 0 && <div className={cn('absolute inset-y-0 rounded-full', sobre ? 'bg-destructive' : 'bg-success')} style={{ width: `${w}%`, left: sobre ? '50%' : `${50 - w}%` }} />}
    </div>
  )
}
