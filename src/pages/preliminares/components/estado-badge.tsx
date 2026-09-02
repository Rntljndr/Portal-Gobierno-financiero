import { Badge, Icon } from '@/shared/ui'
import type { PrelimEstado, PrelimTipoActualizacion } from '@/data/preliminares'

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

export function TipoActualizacionBadge({ tipo }: { tipo: PrelimTipoActualizacion }) {
  if (tipo === 'manual') {
    return <Badge variant="warning">Manual</Badge>
  }
  return <Badge variant="neutral">Automática</Badge>
}
