import { monthLabels } from '@/data/reporteria'
import { Icon } from '@/shared/ui'
import { SUB_HEADERS, type StickyLayout } from '../../lib/pep-n4-table-cols'
import type { SortCol } from '../../lib/pep-n4-table-helpers'

interface TableHeaderProps {
  layout: StickyLayout
  sortCol: SortCol
  sortDir: 'asc' | 'desc' | null
  onSort: (col: SortCol) => void
}

const SORT_KEYS: Record<string, Exclude<SortCol, null>> = { paisOrigen: 'pais', paisDestino: 'paisDestino', equipo: 'equipo' }

export function TableHeader({ layout, sortCol, sortDir, onSort }: TableHeaderProps) {
  return (
    <thead>
      <tr>
        {layout.cols.map((c, si) => {
          const sortKey = SORT_KEYS[c.key]
          const isEdge = si === layout.lastStickyIndex
          return (
            <th
              key={c.key}
              rowSpan={2}
              style={{ position: c.sticky ? 'sticky' : undefined, left: c.sticky ? layout.left[si] : undefined, width: c.width, minWidth: c.width }}
              className={`${c.sticky ? 'sticky z-[4]' : ''} whitespace-nowrap border-b-2 border-border bg-white px-2 py-2 text-[10.5px] font-bold tracking-wide text-muted-foreground uppercase align-middle ${si === 0 ? 'text-center' : 'text-left'} ${isEdge ? 'shadow-[3px_0_8px_rgba(0,0,0,0.07)]' : ''}`}
            >
              {sortKey ? (
                <button type="button" onClick={() => onSort(sortKey)} className="inline-flex items-center gap-0.5">
                  {c.label}
                  <Icon
                    name={sortCol === sortKey && sortDir === 'asc' ? 'chevron_left' : 'chevron_right'}
                    size={10}
                    color={sortCol === sortKey ? '#0047B0' : '#94A3B8'}
                  />
                </button>
              ) : (
                c.label
              )}
            </th>
          )
        })}
        {monthLabels.map((m) => (
          <th key={`mh-${m}`} colSpan={7} className="border-b border-border border-l-2 border-l-[rgba(6,20,148,0.10)] px-2 py-1.5 text-center text-[11px] font-bold tracking-wide text-muted-foreground uppercase whitespace-nowrap">
            {m}
          </th>
        ))}
        <th colSpan={7} className="border-l-2 border-l-[#C4DFFF] bg-[#EEF4FF] px-2.5 py-2 text-center text-[10.5px] font-bold tracking-wide text-primary uppercase">
          TOTALES
        </th>
      </tr>
      <tr>
        {monthLabels.map((m, mi) => (
          <SubHeaderGroup key={`sub-${m}`} isFirst={mi === 0} />
        ))}
        <SubHeaderGroup isFirst tone="totales" />
      </tr>
    </thead>
  )
}

function SubHeaderGroup({ isFirst, tone }: { isFirst: boolean; tone?: 'totales' }) {
  const toneCls = tone === 'totales' ? 'bg-[#EEF4FF] text-primary' : 'text-muted-foreground'
  return (
    <>
      {SUB_HEADERS.map((label, i) => (
        <th
          key={label + i}
          className={`min-w-[62px] border-b-2 border-border px-1.5 py-1 text-right text-[9.5px] font-semibold tracking-wide uppercase whitespace-nowrap ${toneCls} ${i === 0 && isFirst ? 'border-l-2 border-l-[rgba(6,20,148,0.10)]' : ''} ${i === 4 ? `border-l-2 ${tone === 'totales' ? 'border-l-[#C4DFFF]' : 'border-l-[rgba(6,20,148,0.15)]'} text-[#185FA5]` : ''}`}
        >
          {label}
        </th>
      ))}
    </>
  )
}
