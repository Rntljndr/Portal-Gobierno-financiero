import { Icon, EmptyState } from '@/shared/ui'
import { paisFlagBandera, type BanderaRow } from '@/data/banderas'

const th = 'p-[10px_14px] text-left text-[10.5px] font-bold tracking-[0.06em] text-muted-foreground uppercase whitespace-nowrap'
const td = 'p-[10px_14px] text-[12.5px] text-foreground'

interface BanderasTableProps {
  rows: BanderaRow[]
  onToggleVisible: (id: number) => void
  onDelete: (id: number) => void
}

export function BanderasTable({ rows, onToggleVisible, onDelete }: BanderasTableProps) {
  if (rows.length === 0) {
    return (
      <div className="mx-8 mb-8">
        <EmptyState icon="search" title="Sin resultados" text="Probá ajustar la búsqueda o crear una nueva bandera." />
      </div>
    )
  }

  return (
    <div className="mx-8 mb-8 overflow-hidden rounded-xl border border-border bg-white">
      <table className="w-full border-collapse">
        <thead className="bg-[#F8FAFC]">
          <tr>
            <th className={th}>Nombre</th>
            <th className={th}>Código</th>
            <th className={th}>División</th>
            <th className={th}>País</th>
            <th className={th}>Visible para driver</th>
            <th className={th}>Estado</th>
            <th className={th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t border-border hover:bg-[#FBFCFE]">
              <td className={`${td} font-semibold`}>{r.desc}</td>
              <td className={`${td} font-mono text-xs`}>{r.codigo}</td>
              <td className={`${td} text-cs-gris-oscuro`}>{r.division}</td>
              <td className={td}>
                {paisFlagBandera[r.pais]} {r.pais}
              </td>
              <td className={td}>
                <button
                  type="button"
                  onClick={() => onToggleVisible(r.id)}
                  title={r.visible ? 'Visible — clic para ocultar' : 'No visible — clic para mostrar'}
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    r.visible ? 'bg-[#E1FBEF] text-[#067647]' : 'bg-[#F1F4FA] text-muted-foreground'
                  }`}
                >
                  <Icon name="eye" size={13} color="currentColor" />
                  {r.visible ? 'Visible' : 'No visible'}
                </button>
              </td>
              <td className={td}>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                    r.estado === 'activo' ? 'bg-[#E1FBEF] text-[#067647]' : 'bg-[#F1F4FA] text-muted-foreground'
                  }`}
                >
                  <span className="size-1.5 rounded-full bg-current" />
                  {r.estado === 'activo' ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className={td}>
                <button
                  type="button"
                  title="Eliminar bandera"
                  onClick={() => onDelete(r.id)}
                  className="flex size-7 items-center justify-center rounded-md text-[#B42318] hover:bg-[#FEE8E8]"
                >
                  <Icon name="trash" size={14} color="currentColor" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
