import { Fragment, useState } from 'react'
import { Icon } from '@/shared/ui'
import type { AreaNodo, GerenciaNodo } from '@/data/gerencias-equipos'
import type { DraftPermisos } from '../lib/use-alcances-permisos'
import { estadoDeIds } from '../lib/alcances-estado'
import { GerenciaRow, EquipoRow, AsignarOToggle } from './alcances-estructura-rows'

function filtrarBusqueda(areas: AreaNodo[], query: string): AreaNodo[] {
  const q = query.trim().toLowerCase()
  if (!q) return areas
  const matches = (nombre: string) => nombre.toLowerCase().includes(q)
  return areas
    .map((area) => {
      const gerencias = area.gerencias
        .map((ger) => {
          const equipos = ger.equipos.filter((e) => matches(e.nombre))
          if (!matches(ger.nombre) && equipos.length === 0) return null
          return { ...ger, equipos: matches(ger.nombre) ? ger.equipos : equipos }
        })
        .filter((g): g is GerenciaNodo => !!g)
      if (!matches(area.nombre) && gerencias.length === 0) return null
      return { ...area, gerencias: matches(area.nombre) ? area.gerencias : gerencias }
    })
    .filter((a): a is AreaNodo => !!a)
}

interface AlcancesEstructuraTreeProps {
  estructura: AreaNodo[]
  draft: DraftPermisos
  buscar: string
  onBuscar: (v: string) => void
  onAsignar: (nodoId: string) => void
  onSetPermiso: (ids: string[], patch: { ver?: boolean; editar?: boolean }) => void
}

/** Panel central de "Alcances y permisos": misma estructura Área > Gerencia > Equipo que "Gerencias y
 * Equipos", pero cada fila ofrece "+ Asignar" (cascada ver/editar a los equipos vigentes bajo ese
 * nodo) o, si ya tiene algún equipo asignado, los switches Ver/Editar agregados de ese nodo. */
export function AlcancesEstructuraTree({ estructura, draft, buscar, onBuscar, onAsignar, onSetPermiso }: AlcancesEstructuraTreeProps) {
  const [expandidos, setExpandidos] = useState<Set<string>>(new Set())
  const areas = filtrarBusqueda(estructura, buscar)
  const toggle = (id: string) =>
    setExpandidos((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  return (
    <div className="flex-1 rounded-xl border border-border bg-white">
      <div className="border-b border-border p-3">
        <div className="mb-2 text-[10.5px] font-bold tracking-[0.06em] text-muted-foreground uppercase">Estructura organizacional</div>
        <div className="flex h-9 items-center gap-2 rounded-lg border border-border px-3">
          <Icon name="search" size={13} color="#8A90A2" />
          <input
            value={buscar}
            onChange={(e) => onBuscar(e.target.value)}
            placeholder="Buscar gerencia o equipo..."
            className="h-full flex-1 bg-transparent text-[12.5px] outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="max-h-[560px] overflow-y-auto">
        <table className="w-full border-collapse">
          <tbody>
            {areas.map((area) => {
              const ids = area.gerencias.flatMap((g) => g.equipos.map((e) => e.id))
              const estado = estadoDeIds(ids, draft)
              return (
                <Fragment key={area.id}>
                  <tr className="border-t border-[#F1F3F8] bg-[#F8F9FD] hover:bg-surface-hover">
                    <td className="p-[9px_14px] text-[12.5px] font-bold text-foreground" colSpan={2}>
                      <button type="button" onClick={() => toggle(area.id)} className="flex items-center gap-2 text-left">
                        <Icon name={expandidos.has(area.id) ? 'chevron_down' : 'chevron_right'} size={13} color="#8A90A2" />
                        {area.nombre}
                        {estado.asignado && <span className="text-[11px] font-normal text-muted-foreground">{ids.filter((id) => draft[id]?.ver).length}/{ids.length} equipos</span>}
                      </button>
                    </td>
                    <td className="p-[9px_14px] text-right" colSpan={2}>
                      <div className="flex justify-end">
                        <AsignarOToggle ids={ids} estado={estado} onAsignar={() => onAsignar(area.id)} onSetPermiso={onSetPermiso} />
                      </div>
                    </td>
                  </tr>
                  {expandidos.has(area.id) &&
                    area.gerencias.map((gerencia) => (
                      <Fragment key={gerencia.id}>
                        <GerenciaRow
                          gerencia={gerencia}
                          expandido={expandidos.has(gerencia.id)}
                          onToggle={() => toggle(gerencia.id)}
                          draft={draft}
                          onAsignar={onAsignar}
                          onSetPermiso={onSetPermiso}
                        />
                        {expandidos.has(gerencia.id) &&
                          gerencia.equipos.map((equipo) => <EquipoRow key={equipo.id} equipo={equipo} draft={draft} onAsignar={onAsignar} onSetPermiso={onSetPermiso} />)}
                      </Fragment>
                    ))}
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
