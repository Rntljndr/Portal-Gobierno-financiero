import { Icon } from '@/shared/ui'
import { monthLabelsShort } from '@/data/reporteria'

export type CellValue = number | string | null

function formatNumero(v: CellValue) {
  if (v === null || v === undefined || v === '') return '—'
  const n = Number(v)
  if (Number.isNaN(n) || n === 0) return '—'
  return n.toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatFecha(v: CellValue) {
  if (!v) return '—'
  const d = new Date(`${v}T00:00:00`)
  return d.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

interface Matriz12MesesRowProps {
  pais: string
  moneda?: string
  valores: CellValue[]
  editando: boolean
  draft: CellValue[]
  cellType: 'number' | 'date'
  onChangeDraft: (i: number, v: CellValue) => void
  onStartEdit: () => void
  onCancelEdit: () => void
  onConfirmEdit: () => void
}

function Matriz12MesesRow({ pais, moneda, valores, editando, draft, cellType, onChangeDraft, onStartEdit, onCancelEdit, onConfirmEdit }: Matriz12MesesRowProps) {
  const mostrados = editando ? draft : valores
  return (
    <tr className="border-t border-[#F1F3F8] hover:bg-surface-hover">
      <td className="p-[12px_14px] text-[12.5px] font-medium whitespace-nowrap text-foreground">{pais}</td>
      {moneda !== undefined && <td className="p-[12px_14px] text-[12.5px] text-muted-foreground">{moneda}</td>}
      {mostrados.map((v, i) =>
        editando ? (
          <td key={i} className="p-[4px_6px] text-right">
            <input
              type={cellType === 'date' ? 'date' : 'text'}
              inputMode={cellType === 'number' ? 'decimal' : undefined}
              value={v ?? ''}
              onChange={(e) => onChangeDraft(i, cellType === 'number' ? (e.target.value === '' ? 0 : Number(e.target.value.replace(',', '.'))) : e.target.value)}
              className="w-[86px] rounded-md border border-primary bg-white px-1.5 py-1 text-right text-[12px] tabular-nums outline-none"
            />
          </td>
        ) : (
          <td key={i} className="p-[10px_10px] text-right text-[12.5px] whitespace-nowrap text-foreground tabular-nums">
            {cellType === 'number' ? formatNumero(v) : formatFecha(v)}
          </td>
        ),
      )}
      <td className="p-[12px_14px]">
        <div className="flex justify-end">
          {editando ? (
            <div className="flex gap-1">
              <button type="button" onClick={onConfirmEdit} aria-label="Confirmar" className="flex size-7 items-center justify-center rounded-md text-success hover:bg-surface-hover">
                <Icon name="check" size={14} color="#067647" />
              </button>
              <button type="button" onClick={onCancelEdit} aria-label="Cancelar" className="flex size-7 items-center justify-center rounded-md text-destructive hover:bg-surface-hover">
                <Icon name="x_close" size={14} color="#B42318" />
              </button>
            </div>
          ) : (
            <button type="button" onClick={onStartEdit} aria-label="Editar" className="flex size-7 items-center justify-center rounded-md text-primary hover:bg-surface-hover">
              <Icon name="edit" size={14} color="#0047B0" />
            </button>
          )}
        </div>
      </td>
    </tr>
  )
}

interface Matriz12MesesTableProps {
  paises: string[]
  data: Record<string, CellValue[]>
  cellType: 'number' | 'date'
  showMoneda?: (pais: string) => string | undefined
  editingPais: string | null
  draft: CellValue[]
  onChangeDraft: (i: number, v: CellValue) => void
  onStartEdit: (pais: string) => void
  onCancelEdit: () => void
  onConfirmEdit: () => void
}

export function Matriz12MesesTable({ paises, data, cellType, showMoneda, editingPais, draft, onChangeDraft, onStartEdit, onCancelEdit, onConfirmEdit }: Matriz12MesesTableProps) {
  return (
    <div className="mx-8 mb-6 overflow-hidden rounded-xl border border-border bg-white">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#FAFBFE]">
              <th className="p-[10px_14px] text-left text-[10.5px] font-bold tracking-[0.05em] text-muted-foreground uppercase whitespace-nowrap">País</th>
              {showMoneda && <th className="p-[10px_14px] text-left text-[10.5px] font-bold tracking-[0.05em] text-muted-foreground uppercase whitespace-nowrap">Moneda</th>}
              {monthLabelsShort.map((m) => (
                <th key={m} className="p-[10px_10px] text-right text-[10.5px] font-bold tracking-[0.05em] text-muted-foreground uppercase whitespace-nowrap">
                  {m}
                </th>
              ))}
              <th className="p-[10px_14px] text-right text-[10.5px] font-bold tracking-[0.05em] text-muted-foreground uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paises.map((pais) => (
              <Matriz12MesesRow
                key={pais}
                pais={pais}
                moneda={showMoneda?.(pais)}
                valores={data[pais]}
                editando={editingPais === pais}
                draft={draft}
                cellType={cellType}
                onChangeDraft={onChangeDraft}
                onStartEdit={() => onStartEdit(pais)}
                onCancelEdit={onCancelEdit}
                onConfirmEdit={onConfirmEdit}
              />
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-border p-[10px_14px] text-[12px] text-muted-foreground">
        1–{paises.length} de {paises.length} países
      </div>
    </div>
  )
}
