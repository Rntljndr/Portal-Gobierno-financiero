import { Icon } from '@/shared/ui'
import { cn } from '@/shared/lib/utils'
import type { EquipoNodo } from '@/data/gerencias-equipos'
import { AdministracionEstadoBadge } from './administracion-estado-badge'
import { AdministracionAccionesMenu } from './administracion-acciones-menu'

const td = 'p-[10px_14px] text-[13px] text-foreground'
const tdRight = 'p-[10px_14px] text-right text-[13px] text-muted-foreground'

interface EquipoRowProps {
  equipo: EquipoNodo
  expandido: boolean
  onToggle: () => void
  onAction: (tipo: 'ver' | 'editar' | 'eliminar') => void
}

export function EquipoRow({ equipo, expandido, onToggle, onAction }: EquipoRowProps) {
  return (
    <tr className="border-t border-[#F1F3F8] hover:bg-surface-hover">
      <td className={td} style={{ paddingLeft: 56 }}>
        <button type="button" onClick={onToggle} className="flex items-center gap-2 text-left">
          <Icon name={expandido ? 'chevron_down' : 'chevron_right'} size={12} color="#8A90A2" />
          <span className="flex size-6 items-center justify-center rounded-md bg-[#EEF4FF] text-primary">
            <Icon name="user" size={12} color="#0047B0" />
          </span>
          <span className="font-medium">{equipo.nombre}</span>
        </button>
      </td>
      <td className={tdRight}>{equipo.miembros.length} miembros</td>
      <td className="p-[10px_14px]">
        <AdministracionEstadoBadge estado={equipo.estado} />
      </td>
      <td className="p-[10px_14px] text-right">
        <AdministracionAccionesMenu onAction={onAction} />
      </td>
    </tr>
  )
}

interface MiembroRowProps {
  miembro: EquipoNodo['miembros'][number]
}

export function MiembroRow({ miembro }: MiembroRowProps) {
  const iniciales = miembro.nombre
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <tr className="border-t border-[#F8F9FD]">
      <td className={cn(td, 'text-cs-gris-oscuro')} colSpan={2} style={{ paddingLeft: 84 }}>
        <div className="flex items-center gap-2.5">
          <span className="flex size-6 items-center justify-center rounded-full bg-[#EEF1FB] text-[10px] font-bold text-primary">{iniciales}</span>
          <span className="font-medium text-foreground">{miembro.nombre}</span>
          <span className="text-[11.5px] text-muted-foreground">{miembro.email}</span>
        </div>
      </td>
      <td className="p-[10px_14px] text-right" colSpan={2}>
        <span className="rounded-md border border-[#B6CCF7] px-2 py-1 text-[11px] font-bold text-primary uppercase">{miembro.rol}</span>
      </td>
    </tr>
  )
}
