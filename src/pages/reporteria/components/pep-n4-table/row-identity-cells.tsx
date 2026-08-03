import { countryFlags } from '@/data/reporteria'
import { Icon } from '@/shared/ui'
import { STICKY_LEFT } from '../../lib/pep-n4-table-cols'

interface RowIdentityCellsProps {
  codigo: string
  nombre: string
  pais: string
  paisDestino?: string
  equipo: string
  bg: string
  isChild?: boolean
  isExpanded?: boolean
  onToggle?: () => void
}

export function RowIdentityCells({ codigo, nombre, pais, paisDestino, equipo, bg, isChild, isExpanded, onToggle }: RowIdentityCellsProps) {
  const sticky = (left: number) => ({ position: 'sticky' as const, left, background: bg })
  const tdBase = 'z-[3] whitespace-nowrap border-b border-border px-2 py-[7px]'
  const destino = paisDestino || pais

  return (
    <>
      <td style={sticky(STICKY_LEFT[0])} className={`${tdBase} text-center`}>
        {onToggle && (
          <button type="button" onClick={onToggle} className="inline-flex items-center justify-center text-muted-foreground">
            <Icon name={isExpanded ? 'chevron_left' : 'chevron_right'} size={11} color="currentColor" />
          </button>
        )}
      </td>
      <td style={{ ...sticky(STICKY_LEFT[1]), paddingLeft: isChild ? 24 : 8 }} className={`${tdBase} ${isChild ? 'text-xs text-muted-foreground' : 'text-[12.5px] font-semibold'}`}>
        {codigo}
      </td>
      <td style={sticky(STICKY_LEFT[2])} className={`${tdBase} ${isChild ? 'text-xs font-medium text-muted-foreground' : 'font-semibold'}`}>
        {nombre}
      </td>
      <td style={sticky(STICKY_LEFT[3])} className={`${tdBase} ${isChild ? 'text-xs' : ''}`}>
        {countryFlags[pais] || ''} {pais}
      </td>
      <td style={sticky(STICKY_LEFT[4])} className={`${tdBase} ${isChild ? 'text-xs' : ''}`}>
        {countryFlags[destino] || ''} {destino}
      </td>
      <td style={sticky(STICKY_LEFT[5])} className={`${tdBase} ${isChild ? 'text-xs' : ''} shadow-[4px_0_6px_-2px_rgba(0,0,0,0.10)]`}>
        {equipo}
      </td>
    </>
  )
}
