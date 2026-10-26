import { Badge, Icon } from '@/shared/ui'
import type { UsuarioCatalogo } from '@/data/administracion-usuarios'

function initials(nombre: string, apellido: string) {
  return `${nombre[0] ?? ''}${apellido[0] ?? ''}`.toUpperCase()
}

interface UsuariosTableProps {
  rows: UsuarioCatalogo[]
  onEdit: (row: UsuarioCatalogo) => void
  onDelete: (row: UsuarioCatalogo) => void
}

export function UsuariosTable({ rows, onEdit, onDelete }: UsuariosTableProps) {
  return (
    <div className="mx-8 mb-4 overflow-hidden rounded-xl border border-border bg-white">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#FAFBFE]">
            <th className="p-[10px_14px] text-left text-[10.5px] font-bold tracking-[0.05em] text-muted-foreground uppercase">Usuario</th>
            <th className="p-[10px_14px] text-left text-[10.5px] font-bold tracking-[0.05em] text-muted-foreground uppercase">Roles</th>
            <th className="p-[10px_14px] text-left text-[10.5px] font-bold tracking-[0.05em] text-muted-foreground uppercase">Estado</th>
            <th className="p-[10px_14px] text-right text-[10.5px] font-bold tracking-[0.05em] text-muted-foreground uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-[#F1F3F8] hover:bg-surface-hover">
              <td className="p-[12px_14px]">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                    {initials(row.nombre, row.apellido)}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-[12.5px] font-semibold text-foreground">
                      {row.nombre} {row.apellido}
                    </div>
                    <div className="truncate text-[11px] text-muted-foreground">{row.email}</div>
                  </div>
                </div>
              </td>
              <td className="p-[12px_14px]">
                <div className="flex flex-wrap gap-1">
                  {row.roles.map((r) => (
                    <Badge key={`${r.modulo}-${r.rol}`} variant="primary" className="text-[10.5px]">
                      {r.modulo}: {r.rol}
                    </Badge>
                  ))}
                </div>
              </td>
              <td className="p-[12px_14px]">
                <Badge variant={row.activo ? 'success' : 'neutral'} className="text-[10.5px] font-bold uppercase">
                  {row.activo ? 'Activo' : 'Inactivo'}
                </Badge>
              </td>
              <td className="p-[12px_14px]">
                <div className="flex justify-end gap-1">
                  <button type="button" onClick={() => onEdit(row)} aria-label="Editar" className="flex size-7 items-center justify-center rounded-md text-primary hover:bg-surface-hover">
                    <Icon name="edit" size={14} color="#0047B0" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(row)}
                    aria-label="Eliminar"
                    className="flex size-7 items-center justify-center rounded-md text-destructive hover:bg-surface-hover"
                  >
                    <Icon name="trash" size={14} color="#B42318" />
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
