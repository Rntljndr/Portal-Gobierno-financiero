import { cn } from '@/shared/lib/utils'

const MESES = ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
const NOMBRES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

/** Franja de los 12 meses del ejercicio: real cerrado, mes abierto (preliminares) y forecast. */
export function CicloMeses({ cerrados }: { cerrados: number }) {
  const fase = (i: number) => (i < cerrados ? 'real' : i === cerrados ? 'abierto' : 'forecast')
  const CLASE = {
    real: 'bg-primary text-white',
    abierto: 'bg-warning-surface text-warning ring-2 ring-warning-line',
    forecast: 'bg-info-surface text-primary',
  }
  return (
    <div>
      <div className="grid grid-cols-12 gap-1" role="img" aria-label={`Enero a ${NOMBRES[cerrados - 1]} con real cerrado, ${NOMBRES[cerrados]} abierto y el resto en forecast`}>
        {MESES.map((m, i) => (
          <span key={i} title={NOMBRES[i]} className={cn('flex h-7 items-center justify-center rounded-md text-xs font-bold', CLASE[fase(i)])}>
            {m}
          </span>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-primary" /> Real cerrado
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-warning" /> Mes abierto · preliminares
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-info-line" /> Forecast
        </span>
      </div>
    </div>
  )
}
