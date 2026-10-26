import { Badge, Icon } from '@/shared/ui'
import type { TipoSolicitudCatalogo } from '@/data/administracion-reglas'

interface TiposSolicitudTableProps {
  rows: TipoSolicitudCatalogo[]
  onEdit: (row: TipoSolicitudCatalogo) => void
}

export function TiposSolicitudTable({ rows, onEdit }: TiposSolicitudTableProps) {
  return (
    <div className="mx-8 mb-4 overflow-hidden rounded-xl border border-border bg-white">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#FAFBFE]">
            <th className="p-[10px_14px] text-left text-[10.5px] font-bold tracking-[0.05em] text-muted-foreground uppercase">Nombre</th>
            <th className="p-[10px_14px] text-left text-[10.5px] font-bold tracking-[0.05em] text-muted-foreground uppercase">Descripción</th>
            <th className="p-[10px_14px] text-left text-[10.5px] font-bold tracking-[0.05em] text-muted-foreground uppercase">Aprobadores</th>
            <th className="p-[10px_14px] text-left text-[10.5px] font-bold tracking-[0.05em] text-muted-foreground uppercase">Estado</th>
            <th className="p-[10px_14px] text-right text-[10.5px] font-bold tracking-[0.05em] text-muted-foreground uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-[#F1F3F8] hover:bg-surface-hover">
              <td className="p-[12px_14px] text-[12.5px] font-medium text-foreground">{row.nombre}</td>
              <td className="p-[12px_14px] text-[12.5px] text-foreground">{row.descripcion}</td>
              <td className="p-[12px_14px] text-[12.5px] text-foreground">
                <ul className="list-disc pl-4">
                  {row.aprobadores.map((a) => (
                    <li key={a.email}>{a.nombre}</li>
                  ))}
                </ul>
              </td>
              <td className="p-[12px_14px]">
                <Badge variant={row.activo ? 'success' : 'neutral'} className="text-[10.5px] font-bold uppercase">
                  {row.activo ? 'Activo' : 'Inactivo'}
                </Badge>
              </td>
              <td className="p-[12px_14px]">
                <div className="flex justify-end">
                  <button type="button" onClick={() => onEdit(row)} aria-label="Editar" className="flex size-7 items-center justify-center rounded-md text-primary hover:bg-surface-hover">
                    <Icon name="edit" size={14} color="#0047B0" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
