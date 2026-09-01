import { Badge, Icon, EmptyState } from '@/shared/ui'
import type { DriverRow } from '@/data/drivers'
import { EstadoPill } from './estado-pill'

const th = 'p-[10px_14px] text-left text-[10.5px] font-bold tracking-[0.06em] text-muted-foreground uppercase whitespace-nowrap'
const td = 'p-[10px_14px] text-[12.5px] align-top'

export function DriversTable({ rows, onDelete }: { rows: DriverRow[]; onDelete: (id: number) => void }) {
  if (rows.length === 0) {
    return (
      <div className="mx-8 mb-8">
        <EmptyState icon="search" title="Sin resultados" text="Probá ajustar la búsqueda o crear un nuevo driver." />
      </div>
    )
  }

  return (
    <div className="mx-8 mb-8 overflow-hidden rounded-xl border border-border bg-white">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-[#F8FAFC]">
            <tr>
              <th className={th}>Nombre</th>
              <th className={th}>Responsable</th>
              <th className={th}>Equipo</th>
              <th className={th}>Gerencia</th>
              <th className={`${th} max-w-[240px]`}>Descripción</th>
              <th className={th}>Última edición</th>
              <th className={th}>Estado</th>
              <th className={th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-border hover:bg-[#FBFCFE]">
                <td className={`${td} min-w-[200px] font-semibold text-foreground`}>
                  <div className="mb-1 flex items-center gap-1.5">
                    {r.nuevo && (
                      <Badge variant="success" shape="chip" className="text-[10px]">Nuevo</Badge>
                    )}
                    {!r.distribucion && (
                      <Badge variant="warning" shape="chip" className="text-[10px]">
                        <Icon name="alert" size={10} color="currentColor" /> Sin distribución
                      </Badge>
                    )}
                  </div>
                  {r.nombre}
                </td>
                <td className={`${td} text-cs-gris-oscuro`}>{r.responsable}</td>
                <td className={`${td} text-cs-gris-oscuro`}>{r.equipo}</td>
                <td className={`${td} text-cs-gris-oscuro`}>{r.gerencia}</td>
                <td className={`${td} max-w-[240px] text-muted-foreground`}>{r.descripcion}</td>
                <td className={`${td} whitespace-nowrap text-muted-foreground`}>{r.ultEdicion}</td>
                <td className={td}>
                  <EstadoPill estado={r.estadoProc} />
                </td>
                <td className={td}>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      title="Eliminar driver"
                      onClick={() => onDelete(r.id)}
                      className="flex size-7 items-center justify-center rounded-md text-[#B42318] hover:bg-[#FEE8E8]"
                    >
                      <Icon name="trash" size={14} color="currentColor" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
