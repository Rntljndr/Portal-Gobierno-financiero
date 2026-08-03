import { Icon } from '@/shared/ui'
import { formatNumber } from '@/shared/lib/format'
import type { Servicio } from '@/data/services'

const td = 'p-[13px_14px] align-middle text-[12.5px] text-foreground border-b border-border'
const ESTADO_STYLE: Record<string, string> = {
  Borrador: 'bg-[#F1F4FA] text-cs-gris-oscuro',
  'Requiere revisión': 'bg-[#FFF4E0] text-[#B45309]',
  Enviado: 'bg-[#E0EAFB] text-cs-azul',
  Aprobado: 'bg-[#E1FBEF] text-[#067647]',
}

function isPendiente(s: Servicio) {
  return s.estado === 'Borrador' || s.estado === 'Requiere revisión'
}

interface ServicesTableRowProps {
  s: Servicio
  selected: boolean
  onToggleSelected: (id: string) => void
  onOpen: (s: Servicio) => void
}

export function ServicesTableRow({ s, selected, onToggleSelected, onOpen }: ServicesTableRowProps) {
  const variacion = s.forecastIPC - s.forecastBase
  const varPct = s.forecastBase ? (variacion / s.forecastBase) * 100 : 0
  const varTone = variacion > 0 ? 'text-[#DC2626]' : variacion < 0 ? 'text-[#067647]' : ''

  return (
    <tr className="hover:bg-[#F5F8FE]">
      <td className={`${td} w-9 pl-4 text-center`} onClick={(e) => e.stopPropagation()}>
        {isPendiente(s) && (
          <input type="checkbox" checked={selected} onChange={() => onToggleSelected(s.id)} className="size-[15px] cursor-pointer" />
        )}
      </td>
      <td className={`${td} max-w-[320px]`}>
        <div className="mb-1 text-[11px] font-semibold text-primary tabular-nums">
          {s.pep} <span className="text-muted-foreground">•</span> {s.pais}
        </div>
        <div className="font-bold text-foreground">{s.nombre}</div>
        <div className="mt-0.5 text-[11px] text-muted-foreground">
          {s.gerenciaPadre} <span className="text-slate-300">•</span> {s.gerencia}
        </div>
        <span className={`mt-1 inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold ${ESTADO_STYLE[s.estado]}`}>{s.estado}</span>
      </td>
      <td className={td}>{s.pais}</td>
      <td className={td}>{s.equipo}</td>
      <td className={`${td} whitespace-nowrap`}>
        <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-[11px] font-bold ${s.tipoOrigen === 'Nuevo' ? 'bg-[#E1FBEF] text-[#067647]' : 'bg-[#E0EAFB] text-cs-azul'}`}>
          {s.tipoOrigen}
        </span>
      </td>
      <td className={td}>{s.moneda === 'USD' ? 'Sí' : 'No'}</td>
      <td className={`${td} text-right font-bold tabular-nums`}>
        <span className="mr-1 text-[10px] font-semibold text-muted-foreground">{s.moneda}</span>
        {formatNumber(s.totalPlan)}
      </td>
      <td className={`${td} text-right font-semibold text-cs-gris-oscuro tabular-nums`}>
        <span className="mr-1 text-[10px] font-semibold text-muted-foreground">{s.moneda}</span>
        {formatNumber(s.forecastBase)}
      </td>
      <td className={`${td} text-right font-bold text-primary tabular-nums`}>
        <span className="mr-1 text-[10px] font-semibold text-muted-foreground">{s.moneda}</span>
        {formatNumber(s.forecastIPC)}
      </td>
      <td className={`${td} text-right font-bold tabular-nums ${varTone}`}>
        {variacion === 0 ? '—' : `${variacion > 0 ? '+' : '−'}${s.moneda} ${formatNumber(Math.abs(variacion))}`}
      </td>
      <td className={`${td} text-right font-bold tabular-nums ${varTone}`}>
        {variacion === 0 ? '—' : `${varPct > 0 ? '+' : '−'}${Math.abs(varPct).toFixed(1)}%`}
      </td>
      <td className={`${td} whitespace-nowrap`} onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={() => onOpen(s)} aria-label="Editar" className="mr-1 flex size-7 items-center justify-center rounded-md text-primary hover:bg-[#E8EEFB]">
          <Icon name="edit" size={13} color="currentColor" />
        </button>
        <button type="button" onClick={(e) => e.stopPropagation()} aria-label="Eliminar" className="flex size-7 items-center justify-center rounded-md text-[#B42318] hover:bg-[#FEE8E8]">
          <Icon name="trash" size={13} color="currentColor" />
        </button>
      </td>
    </tr>
  )
}
