import { Badge } from '@/shared/ui'
import { estadoProcesoLabel, type EstadoProceso } from '@/data/drivers'

const VARIANT: Record<EstadoProceso, 'neutral' | 'warning' | 'success' | 'destructive'> = {
  preliminar: 'neutral',
  borrador: 'warning',
  enviado: 'success',
  rechazado: 'destructive',
}

export function EstadoPill({ estado }: { estado: EstadoProceso }) {
  return (
    <Badge variant={VARIANT[estado]} className="tracking-wide">
      <span className="size-1.5 rounded-full bg-current" />
      {estadoProcesoLabel[estado]}
    </Badge>
  )
}
