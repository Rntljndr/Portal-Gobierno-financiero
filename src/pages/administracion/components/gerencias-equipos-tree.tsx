import { Fragment } from 'react'
import { Icon } from '@/shared/ui'
import type { AreaNodo, GerenciaNodo } from '@/data/gerencias-equipos'
import { AdministracionEstadoBadge } from './administracion-estado-badge'
import { AdministracionAccionesMenu } from './administracion-acciones-menu'
import { EquipoRow, MiembroRow } from './gerencias-equipos-equipo-row'

const th = 'p-[9px_14px] text-left text-[10.5px] font-bold tracking-[0.04em] text-muted-foreground uppercase whitespace-nowrap border-b-2 border-border bg-[#F8F9FD]'
const td = 'p-[10px_14px] text-[13px] text-foreground'
const tdRight = 'p-[10px_14px] text-right text-[13px] text-muted-foreground'

function totalMiembrosGerencia(g: GerenciaNodo) {
  return g.equipos.reduce((s, e) => s + e.miembros.length, 0)
}

function totalMiembrosArea(a: AreaNodo) {
  return a.gerencias.reduce((s, g) => s + totalMiembrosGerencia(g), 0)
}

interface GerenciasEquiposTreeProps {
  areas: AreaNodo[]
  expandidos: Set<string>
  onToggle: (id: string) => void
  onAction: (nombre: string, tipo: 'ver' | 'editar' | 'eliminar') => void
}

/** Tabla jerárquica Área > Gerencia > Equipo > Miembro (F: copiada de Administración > Gerencia y
 * equipo) — cada nivel se expande por separado; `areas` ya viene resuelto para el año y los filtros
 * vigentes (ver `useGerenciasEquipos`). */
export function GerenciasEquiposTree({ areas, expandidos, onToggle, onAction }: GerenciasEquiposTreeProps) {
  return (
    <div className="mx-8 mb-6 overflow-x-auto rounded-xl border border-border">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className={th}>Estructura Organizacional</th>
            <th className={th}>Miembros</th>
            <th className={th}>Estado</th>
            <th className={th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {areas.map((area) => (
            <Fragment key={area.id}>
              <tr className="border-t border-[#F1F3F8] hover:bg-surface-hover">
                <td className={td}>
                  <button type="button" onClick={() => onToggle(area.id)} className="flex items-center gap-2 text-left">
                    <Icon name={expandidos.has(area.id) ? 'chevron_down' : 'chevron_right'} size={13} color="#8A90A2" />
                    <span className="flex size-7 items-center justify-center rounded-lg bg-[#EEF4FF] text-primary">
                      <Icon name="drives" size={14} color="#0047B0" />
                    </span>
                    <span className="font-bold text-foreground">{area.nombre}</span>
                    <span className="text-[11.5px] font-normal text-muted-foreground">
                      {area.gerencias.length} gerencias · {area.gerencias.reduce((s, g) => s + g.equipos.length, 0)} equipos
                    </span>
                  </button>
                </td>
                <td className={tdRight}>{totalMiembrosArea(area)} miembros</td>
                <td className="p-[10px_14px]">
                  <AdministracionEstadoBadge estado={area.estado} />
                </td>
                <td className="p-[10px_14px] text-right">
                  <AdministracionAccionesMenu onAction={(tipo) => onAction(area.nombre, tipo)} />
                </td>
              </tr>

              {expandidos.has(area.id) &&
                area.gerencias.map((gerencia) => (
                  <Fragment key={gerencia.id}>
                    <tr className="border-t border-[#F1F3F8] hover:bg-surface-hover">
                      <td className={td} style={{ paddingLeft: 28 }}>
                        <button type="button" onClick={() => onToggle(gerencia.id)} className="flex items-center gap-2 text-left">
                          <Icon name={expandidos.has(gerencia.id) ? 'chevron_down' : 'chevron_right'} size={12} color="#8A90A2" />
                          <span className="flex size-6.5 items-center justify-center rounded-md bg-[#EEF4FF] text-primary">
                            <Icon name="config" size={13} color="#0047B0" />
                          </span>
                          <span className="font-semibold text-foreground">{gerencia.nombre}</span>
                          <span className="text-[11.5px] font-normal text-muted-foreground">{gerencia.equipos.length} equipos</span>
                        </button>
                      </td>
                      <td className={tdRight}>{totalMiembrosGerencia(gerencia)} miembros</td>
                      <td className="p-[10px_14px]">
                        <AdministracionEstadoBadge estado={gerencia.estado} />
                      </td>
                      <td className="p-[10px_14px] text-right">
                        <AdministracionAccionesMenu onAction={(tipo) => onAction(gerencia.nombre, tipo)} />
                      </td>
                    </tr>

                    {expandidos.has(gerencia.id) &&
                      gerencia.equipos.map((equipo) => (
                        <Fragment key={equipo.id}>
                          <EquipoRow equipo={equipo} expandido={expandidos.has(equipo.id)} onToggle={() => onToggle(equipo.id)} onAction={(tipo) => onAction(equipo.nombre, tipo)} />
                          {expandidos.has(equipo.id) && equipo.miembros.map((m) => <MiembroRow key={m.id} miembro={m} />)}
                        </Fragment>
                      ))}
                  </Fragment>
                ))}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}
