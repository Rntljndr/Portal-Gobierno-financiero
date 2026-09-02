import { countryFlags } from '@/data/reporteria'
import { Icon } from '@/shared/ui'
import type { StickyLayout } from '../../lib/pep-n4-table-cols'

interface RowIdentityCellsProps {
  layout: StickyLayout
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

export function RowIdentityCells({ layout, codigo, nombre, pais, paisDestino, equipo, bg, isChild, isExpanded, onToggle }: RowIdentityCellsProps) {
  const destino = paisDestino || pais
  const tdBase = 'z-[3] whitespace-nowrap border-b border-border px-2 py-[7px]'
  const cellFor = (key: string) => {
    const idx = layout.cols.findIndex((c) => c.key === key)
    if (idx === -1) return null
    const isLast = idx === layout.cols.length - 1
    const sticky = { position: 'sticky' as const, left: layout.left[idx], background: bg }
    return { sticky, isLast }
  }

  const spacer = cellFor('spacer')
  const pep = cellFor('pep')
  const nombreCell = cellFor('nombre')
  const paisOrigen = cellFor('paisOrigen')
  const paisDestinoCell = cellFor('paisDestino')
  const equipoCell = cellFor('equipo')

  return (
    <>
      {spacer && (
        <td style={spacer.sticky} className={`${tdBase} text-center`}>
          {onToggle && (
            <button type="button" onClick={onToggle} className="inline-flex items-center justify-center text-muted-foreground">
              <Icon name={isExpanded ? 'chevron_left' : 'chevron_right'} size={11} color="currentColor" />
            </button>
          )}
        </td>
      )}
      {pep && (
        <td style={{ ...pep.sticky, paddingLeft: isChild ? 24 : 8 }} className={`${tdBase} ${isChild ? 'text-xs text-muted-foreground' : 'text-[12.5px] font-semibold'} ${pep.isLast ? 'shadow-[4px_0_6px_-2px_rgba(0,0,0,0.10)]' : ''}`}>
          {codigo}
        </td>
      )}
      {nombreCell && (
        <td style={nombreCell.sticky} className={`${tdBase} ${isChild ? 'text-xs font-medium text-muted-foreground' : 'font-semibold'} ${nombreCell.isLast ? 'shadow-[4px_0_6px_-2px_rgba(0,0,0,0.10)]' : ''}`}>
          {nombre}
        </td>
      )}
      {paisOrigen && (
        <td style={paisOrigen.sticky} className={`${tdBase} ${isChild ? 'text-xs' : ''} ${paisOrigen.isLast ? 'shadow-[4px_0_6px_-2px_rgba(0,0,0,0.10)]' : ''}`}>
          {countryFlags[pais] || ''} {pais}
        </td>
      )}
      {paisDestinoCell && (
        <td style={paisDestinoCell.sticky} className={`${tdBase} ${isChild ? 'text-xs' : ''} ${paisDestinoCell.isLast ? 'shadow-[4px_0_6px_-2px_rgba(0,0,0,0.10)]' : ''}`}>
          {countryFlags[destino] || ''} {destino}
        </td>
      )}
      {equipoCell && (
        <td style={equipoCell.sticky} className={`${tdBase} ${isChild ? 'text-xs' : ''} ${equipoCell.isLast ? 'shadow-[4px_0_6px_-2px_rgba(0,0,0,0.10)]' : ''}`}>
          {equipo}
        </td>
      )}
    </>
  )
}
