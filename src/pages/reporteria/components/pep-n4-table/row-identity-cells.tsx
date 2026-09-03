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
  const tdBase = 'whitespace-nowrap border-b border-border px-2 py-[7px]'
  const cellFor = (key: string) => {
    const idx = layout.cols.findIndex((c) => c.key === key)
    if (idx === -1) return null
    const col = layout.cols[idx]
    const isEdge = idx === layout.lastStickyIndex
    const style = col.sticky ? { position: 'sticky' as const, left: layout.left[idx], background: bg, zIndex: 3 } : undefined
    return { style, isEdge }
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
        <td style={spacer.style} className={`${tdBase} text-center`}>
          {onToggle && (
            <button type="button" onClick={onToggle} className="inline-flex items-center justify-center text-muted-foreground">
              <Icon name={isExpanded ? 'chevron_left' : 'chevron_right'} size={11} color="currentColor" />
            </button>
          )}
        </td>
      )}
      {nombreCell && (
        <td
          style={{ ...nombreCell.style, paddingLeft: isChild ? 24 : 8 }}
          className={`${tdBase} ${isChild ? 'text-xs font-medium text-muted-foreground' : 'font-semibold'} ${nombreCell.isEdge ? 'shadow-[4px_0_6px_-2px_rgba(0,0,0,0.10)]' : ''}`}
        >
          {nombre}
        </td>
      )}
      {pep && (
        <td style={pep.style} className={`${tdBase} ${isChild ? 'text-xs text-muted-foreground' : 'text-[12.5px] font-semibold'}`}>
          {codigo}
        </td>
      )}
      {paisOrigen && (
        <td style={paisOrigen.style} className={`${tdBase} ${isChild ? 'text-xs' : ''}`}>
          {pais}
        </td>
      )}
      {paisDestinoCell && (
        <td style={paisDestinoCell.style} className={`${tdBase} ${isChild ? 'text-xs' : ''}`}>
          {destino}
        </td>
      )}
      {equipoCell && (
        <td style={equipoCell.style} className={`${tdBase} ${isChild ? 'text-xs' : ''}`}>
          {equipo}
        </td>
      )}
    </>
  )
}
