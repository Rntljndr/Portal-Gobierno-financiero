import { Badge } from '@/shared/ui'
import type { EstadoServicio, TipoOrigen } from '@/data/services'

const ESTADO_VARIANT: Record<EstadoServicio, 'neutral' | 'warning' | 'primary' | 'success'> = {
  Borrador: 'neutral',
  'Requiere revisión': 'warning',
  Enviado: 'primary',
  Aprobado: 'success',
}

export function ServiceCardBadges({ estado, tipoOrigen }: { estado: EstadoServicio; tipoOrigen: TipoOrigen }) {
  return (
    <div className="mb-3 flex flex-wrap gap-1.5 self-start">
      <Badge variant={ESTADO_VARIANT[estado]} shape="chip" className="tracking-wide">
        {estado}
      </Badge>
      <Badge variant={tipoOrigen === 'Nuevo' ? 'success' : 'primary'} shape="chip" className="tracking-wide">
        {tipoOrigen}
      </Badge>
    </div>
  )
}
