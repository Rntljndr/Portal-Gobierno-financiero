import { Badge, Icon } from '@/shared/ui'
import type { CentroCostoCatalogo } from '@/data/administracion-reglas'

interface CentrosCostoTableProps {
  rows: CentroCostoCatalogo[]
  onEdit: (row: CentroCostoCatalogo) => void
}

export function CentrosCostoTable({ rows, onEdit }: CentrosCostoTableProps) {
  return (
    <div className="mx-8 mb-4 overflow-hidden rounded-xl border border-border bg-white">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#FAFBFE]">
            <th className="p-[10px_14px] text-left text-[10.5px] font-bold tracking-[0.05em] text-muted-foreground uppercase">Código</th>
            <th className="p-[10px_14px] text-left text-[10.5px] font-bold tracking-[0.05em] text-muted-foreground uppercase">Tipo</th>
            <th className="p-[10px_14px] text-left text-[10.5px] font-bold tracking-[0.05em] text-muted-foreground uppercase">Estado</th>
            <th className="p-[10px_14px] text-right text-[10.5px] font-bold tracking-[0.05em] text-muted-foreground uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-[#F1F3F8] hover:bg-surface-hover">
              <td className="p-[12px_14px] text-[12.5px] text-foreground">{row.codigo}</td>
              <td className="p-[12px_14px]">
                <Badge variant={row.tipo === 'Central' ? 'primary' : 'success'} className="text-[10.5px] font-bold uppercase">
                  {row.tipo}
                </Badge>
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
          {rows.length === 0 && (
            <tr>
              <td colSpan={4} className="p-8 text-center text-[13px] text-muted-foreground">
                Sin registros para mostrar.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
