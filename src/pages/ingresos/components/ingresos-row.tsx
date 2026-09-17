import { Badge, Icon } from '@/shared/ui'
import { countryFlags, monthKeys } from '@/data/reporteria'
import { formatMonto } from '../lib/format-monto'
import type { IngresoRow } from '../lib/use-ingresos'
import { IngresoMonthCell } from './ingreso-month-cell'

const td = 'p-[10px_14px] text-[12.5px] align-top whitespace-nowrap'

interface IngresosRowProps {
  row: IngresoRow
  editando: boolean
  onEditMes: (bandera: string, mesKey: string, valor: number) => void
  onToggleEditar: (bandera: string) => void
}

export function IngresosRow({ row, editando, onEditMes, onToggleEditar }: IngresosRowProps) {
  const { maestro, meses, total } = row
  return (
    <tr className="border-t border-border hover:bg-[#FBFCFE]">
      <td className={`${td} sticky left-0 z-[1] bg-white font-semibold text-foreground`}>
        <span className="inline-flex items-center gap-1.5">
          <span>{countryFlags[maestro.pais] ?? ''}</span> {maestro.pais}
        </span>
      </td>
      <td className={`${td} text-cs-gris-oscuro`}>{maestro.division}</td>
      <td className={`${td} font-semibold text-foreground`}>{maestro.nombre}</td>
      <td className={td}>
        <Badge variant="primary" shape="chip" className="text-[11px]">
          {maestro.codigo}
        </Badge>
      </td>
      {monthKeys.map((k) => (
        <IngresoMonthCell key={k} value={meses[k] ?? 0} locked={!editando} onChange={(v) => onEditMes(maestro.nombre, k, v)} />
      ))}
      <td className={`${td} text-right font-bold text-foreground`}>{formatMonto(total)}</td>
      <td className={`${td} text-center`}>
        <button
          type="button"
          title={editando ? 'Guardar cambios de la fila' : 'Habilitar edición de la fila'}
          onClick={() => onToggleEditar(maestro.nombre)}
          className={`inline-flex size-7 items-center justify-center rounded-md ${editando ? 'bg-primary text-white hover:bg-[#003685]' : 'text-muted-foreground hover:bg-[#E8EEFB] hover:text-primary'}`}
        >
          <Icon name={editando ? 'save' : 'edit'} size={13} color="currentColor" />
        </button>
      </td>
    </tr>
  )
}
