import { Icon } from '@/shared/ui'
import type { CatalogoColumnDef } from './catalogo-admin-page'

interface CatalogoTableProps<T extends { id: string }> {
  rows: T[]
  columns: CatalogoColumnDef<T>[]
  allowDelete: boolean
  onEdit: (row: T) => void
  onDelete: (row: T) => void
}

export function CatalogoTable<T extends { id: string }>({ rows, columns, allowDelete, onEdit, onDelete }: CatalogoTableProps<T>) {
  return (
    <div className="mx-8 mb-4 overflow-hidden rounded-xl border border-border bg-white">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#FAFBFE]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`p-[10px_14px] text-[10.5px] font-bold tracking-[0.05em] text-muted-foreground uppercase whitespace-nowrap ${col.align === 'right' ? 'text-right' : 'text-left'}`}
                >
                  {col.label}
                </th>
              ))}
              <th className="p-[10px_14px] text-right text-[10.5px] font-bold tracking-[0.05em] text-muted-foreground uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-[#F1F3F8] hover:bg-surface-hover">
                {columns.map((col) => (
                  <td key={col.key} className={`p-[12px_14px] text-[12.5px] text-foreground ${col.align === 'right' ? 'text-right' : 'text-left'}`}>
                    {col.render ? col.render(row) : String(row[col.key] ?? '—')}
                  </td>
                ))}
                <td className="p-[12px_14px]">
                  <div className="flex justify-end gap-1">
                    <button type="button" onClick={() => onEdit(row)} aria-label="Editar" className="flex size-7 items-center justify-center rounded-md text-primary hover:bg-surface-hover">
                      <Icon name="edit" size={14} color="#0047B0" />
                    </button>
                    {allowDelete && (
                      <button
                        type="button"
                        onClick={() => onDelete(row)}
                        aria-label="Eliminar"
                        className="flex size-7 items-center justify-center rounded-md text-destructive hover:bg-surface-hover"
                      >
                        <Icon name="trash" size={14} color="#B42318" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="p-8 text-center text-[13px] text-muted-foreground">
                  Sin registros para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
