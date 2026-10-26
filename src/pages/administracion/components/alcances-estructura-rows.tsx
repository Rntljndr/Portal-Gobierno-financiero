import { Icon } from '@/shared/ui'
import type { GerenciaNodo, EquipoNodo } from '@/data/gerencias-equipos'
import type { DraftPermisos } from '../lib/use-alcances-permisos'
import { estadoDeIds, type NodoEstado } from '../lib/alcances-estado'
import { AdministracionToggle } from './administracion-toggle'

const td = 'p-[9px_14px] text-[12.5px] text-foreground'

interface AsignarOToggleProps {
  ids: string[]
  estado: NodoEstado
  onAsignar: () => void
  onSetPermiso: (ids: string[], patch: { ver?: boolean; editar?: boolean }) => void
}

export function AsignarOToggle({ ids, estado, onAsignar, onSetPermiso }: AsignarOToggleProps) {
  if (!estado.asignado) {
    return (
      <button type="button" onClick={onAsignar} className="text-[12px] font-semibold text-primary hover:underline">
        + Asignar
      </button>
    )
  }
  return (
    <div className="flex items-center gap-4">
      <label className="flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
        <AdministracionToggle checked={estado.ver} onChange={(v) => onSetPermiso(ids, { ver: v, editar: v ? estado.editar : false })} label="Ver" />
        Ver
      </label>
      <label className="flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
        <AdministracionToggle checked={estado.editar} onChange={(v) => onSetPermiso(ids, { editar: v })} label="Editar" />
        Editar
      </label>
    </div>
  )
}

interface GerenciaRowProps {
  gerencia: GerenciaNodo
  expandido: boolean
  onToggle: () => void
  draft: DraftPermisos
  onAsignar: (nodoId: string) => void
  onSetPermiso: (ids: string[], patch: { ver?: boolean; editar?: boolean }) => void
}

export function GerenciaRow({ gerencia, expandido, onToggle, draft, onAsignar, onSetPermiso }: GerenciaRowProps) {
  const ids = gerencia.equipos.map((e) => e.id)
  const estado = estadoDeIds(ids, draft)
  return (
    <tr className="border-t border-[#F1F3F8] hover:bg-surface-hover">
      <td className={td} style={{ paddingLeft: 28 }} colSpan={2}>
        <button type="button" onClick={onToggle} className="flex items-center gap-2 text-left">
          <Icon name={expandido ? 'chevron_down' : 'chevron_right'} size={12} color="#8A90A2" />
          <span className="flex size-6 items-center justify-center rounded-md bg-[#EEF4FF] text-primary">
            <Icon name="config" size={12} color="#0047B0" />
          </span>
          <span className="font-semibold">{gerencia.nombre}</span>
          <span className="text-[11px] text-muted-foreground">{gerencia.equipos.length} equipos</span>
        </button>
      </td>
      <td className="p-[9px_14px] text-right" colSpan={2}>
        <div className="flex justify-end">
          <AsignarOToggle ids={ids} estado={estado} onAsignar={() => onAsignar(gerencia.id)} onSetPermiso={onSetPermiso} />
        </div>
      </td>
    </tr>
  )
}

interface EquipoRowProps {
  equipo: EquipoNodo
  draft: DraftPermisos
  onAsignar: (nodoId: string) => void
  onSetPermiso: (ids: string[], patch: { ver?: boolean; editar?: boolean }) => void
}

export function EquipoRow({ equipo, draft, onAsignar, onSetPermiso }: EquipoRowProps) {
  const ids = [equipo.id]
  const estado = estadoDeIds(ids, draft)
  return (
    <tr className="border-t border-[#F8F9FD] hover:bg-surface-hover">
      <td className={td} style={{ paddingLeft: 56 }} colSpan={2}>
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-md bg-[#EEF4FF] text-primary">
            <Icon name="user" size={12} color="#0047B0" />
          </span>
          <span className="font-medium">{equipo.nombre}</span>
        </div>
      </td>
      <td className="p-[9px_14px] text-right" colSpan={2}>
        <div className="flex justify-end">
          <AsignarOToggle ids={ids} estado={estado} onAsignar={() => onAsignar(equipo.id)} onSetPermiso={onSetPermiso} />
        </div>
      </td>
    </tr>
  )
}
