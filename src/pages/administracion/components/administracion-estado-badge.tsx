import { Badge } from '@/shared/ui'
import type { EstadoOrganizacional } from '@/data/gerencias-equipos'

export function AdministracionEstadoBadge({ estado }: { estado: EstadoOrganizacional }) {
  return (
    <Badge variant={estado === 'Activo' ? 'success' : 'neutral'} className="text-[10.5px] font-bold uppercase">
      {estado}
    </Badge>
  )
}
