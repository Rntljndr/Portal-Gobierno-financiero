import { useMemo, useState } from 'react'
import { pepN4Tablon } from '@/data/reporteria'
import { sortRows, type SortCol } from '../../lib/pep-n4-table-helpers'
import { buildStickyLayout, TOGGLEABLE_COL_KEYS } from '../../lib/pep-n4-table-cols'
import { TableHeader } from './table-header'
import { TableRow } from './table-row'

interface PepN4TableProps {
  visibleCols?: string[]
}

export function PepN4Table({ visibleCols = TOGGLEABLE_COL_KEYS }: PepN4TableProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [sortCol, setSortCol] = useState<SortCol>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc' | null>(null)

  const handleSort = (col: SortCol) => {
    if (sortCol !== col) { setSortCol(col); setSortDir('asc') }
    else if (sortDir === 'asc') { setSortDir('desc') }
    else { setSortCol(null); setSortDir(null) }
  }

  const toggleRow = (codigo: string) => setExpanded((prev) => ({ ...prev, [codigo]: !prev[codigo] }))

  const sorted = sortRows(pepN4Tablon, sortCol, sortDir)
  const layout = useMemo(() => buildStickyLayout(visibleCols), [visibleCols])

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-white">
      <table className="border-collapse" style={{ minWidth: layout.width + 12 * 455 + 120 }}>
        <TableHeader layout={layout} sortCol={sortCol} sortDir={sortDir} onSort={handleSort} />
        <tbody>
          {sorted.map((row) => (
            <TableRow key={row.codigo} layout={layout} row={row} isExpanded={!!expanded[row.codigo]} onToggle={() => toggleRow(row.codigo)} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
