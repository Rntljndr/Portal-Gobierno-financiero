import { useState } from 'react'
import { pepN4Tablon } from '@/data/reporteria'
import { sortRows, type SortCol } from '../../lib/pep-n4-table-helpers'
import { TableHeader } from './table-header'
import { TableRow } from './table-row'

export function PepN4Table() {
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

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-white">
      <table className="border-collapse" style={{ minWidth: 596 + 12 * 455 + 120 }}>
        <TableHeader sortCol={sortCol} sortDir={sortDir} onSort={handleSort} />
        <tbody>
          {sorted.map((row) => (
            <TableRow key={row.codigo} row={row} isExpanded={!!expanded[row.codigo]} onToggle={() => toggleRow(row.codigo)} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
