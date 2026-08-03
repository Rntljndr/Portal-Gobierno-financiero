import { useMemo, useState } from 'react'
import { EmptyState } from '@/shared/ui'
import type { Servicio } from '@/data/services'
import { nextSort, sortServices, type SortColumn, type SortDir } from '../lib/sort-services'
import { ServicesTableHeader } from './services-table-header'
import { ServicesTableRow } from './services-table-row'

interface ServicesTableProps {
  items: Servicio[]
  selectedIds: Set<string>
  onToggleSelected: (id: string) => void
  onOpen: (s: Servicio) => void
}

export function ServicesTable({ items, selectedIds, onToggleSelected, onOpen }: ServicesTableProps) {
  const [sortCol, setSortCol] = useState<SortColumn>(null)
  const [sortDir, setSortDir] = useState<SortDir>(null)

  const rows = useMemo(() => sortServices(items, sortCol, sortDir), [items, sortCol, sortDir])

  const handleSort = (col: NonNullable<SortColumn>) => {
    const next = nextSort(sortCol, sortDir, col)
    setSortCol(next.col)
    setSortDir(next.dir)
  }

  if (rows.length === 0) {
    return (
      <div className="mx-8 mb-6">
        <EmptyState icon="search" title="Sin resultados" text="Ajustá los filtros o limpiá la búsqueda." />
      </div>
    )
  }

  return (
    <div className="mx-8 mb-6 overflow-x-auto rounded-2xl border border-border bg-white">
      <table className="w-full min-w-[980px] border-collapse">
        <ServicesTableHeader sortCol={sortCol} sortDir={sortDir} onSort={handleSort} />
        <tbody>
          {rows.map((s) => (
            <ServicesTableRow key={s.id} s={s} selected={selectedIds.has(s.id)} onToggleSelected={onToggleSelected} onOpen={onOpen} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
