import { Badge, Icon } from '@/shared/ui'
import type { PrelimEstado } from '@/data/preliminares'

export function EstadoBadge({ estado }: { estado: PrelimEstado }) {
  if (estado === 'definitivo') {
    return (
      <Badge variant="success">
        <Icon name="lock" size={10} color="currentColor" /> Definitivo
      </Badge>
    )
  }
  return (
    <Badge variant="neutral">
      <Icon name="trendup" size={10} color="currentColor" /> Preliminar
    </Badge>
  )
}
