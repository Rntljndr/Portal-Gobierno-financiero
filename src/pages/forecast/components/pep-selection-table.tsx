import { useEffect, useState } from 'react'
import { Pagination } from '@/shared/ui'
import { forecastPepList } from '@/data/forecast'

const PAGE_SIZE = 8

interface PepSelectionTableProps {
  selected: Set<string>
  onToggle: (codigo: string) => void
  readOnly?: boolean
}

export function PepSelectionTable({ selected, onToggle, readOnly = false }: PepSelectionTableProps) {
  const [filters, setFilters] = useState({ pep: '', pais: '', area: '', desc: '' })
  const [page, setPage] = useState(1)

  const filtered = forecastPepList.filter(
    (p) =>
      (!filters.pep || p.codigo.toLowerCase().includes(filters.pep.toLowerCase())) &&
      (!filters.pais || p.pais.toLowerCase().includes(filters.pais.toLowerCase())) &&
      (!filters.area || p.area.toLowerCase().includes(filters.area.toLowerCase())) &&
      (!filters.desc || p.nombre.toLowerCase().includes(filters.desc.toLowerCase())),
  )

  useEffect(() => setPage(1), [filters])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageSafe = Math.min(page, totalPages)
  const pageData = filtered.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE)
  const pageAllSelected = pageData.length > 0 && pageData.every((p) => selected.has(p.codigo))

  const togglePageAll = () => {
    if (readOnly) return
    pageData.forEach((p) => (pageAllSelected ? selected.has(p.codigo) && onToggle(p.codigo) : !selected.has(p.codigo) && onToggle(p.codigo)))
  }

  const inputClass = 'h-9 rounded-lg border border-border bg-white px-2.5 text-[12px] outline-none placeholder:text-muted-foreground focus:border-primary'
  const th = 'p-[9px_10px] text-left text-[11px] font-bold text-cs-gris-oscuro bg-[#F4F6FB] border-b border-border whitespace-nowrap'
  const td = 'p-[9px_10px] text-[12px] text-foreground border-b border-[#F0F4FA]'

  return (
    <div>
      <div className="mb-2.5 grid grid-cols-4 gap-2">
        <input className={inputClass} placeholder="PEP" value={filters.pep} onChange={(e) => setFilters((f) => ({ ...f, pep: e.target.value }))} />
        <input className={inputClass} placeholder="País" value={filters.pais} onChange={(e) => setFilters((f) => ({ ...f, pais: e.target.value }))} />
        <input className={inputClass} placeholder="Área" value={filters.area} onChange={(e) => setFilters((f) => ({ ...f, area: e.target.value }))} />
        <input className={inputClass} placeholder="Descripción" value={filters.desc} onChange={(e) => setFilters((f) => ({ ...f, desc: e.target.value }))} />
      </div>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr>
              <th className={`${th} w-9 text-center`}>
                <input type="checkbox" checked={pageAllSelected} disabled={readOnly} onChange={togglePageAll} className="accent-primary" />
              </th>
              <th className={th}>PEP</th>
              <th className={th}>País</th>
              <th className={th}>Área</th>
              <th className={th}>Descripción</th>
              <th className={th}>Cta.</th>
            </tr>
          </thead>
          <tbody>
            {pageData.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-5 text-center text-muted-foreground">
                  Sin resultados
                </td>
              </tr>
            ) : (
              pageData.map((p) => {
                const checked = selected.has(p.codigo)
                return (
                  <tr
                    key={p.codigo}
                    className={readOnly ? undefined : 'cursor-pointer'}
                    style={{ background: checked ? '#D6E4F7' : '#fff' }}
                    onClick={readOnly ? undefined : () => onToggle(p.codigo)}
                  >
                    <td className={`${td} text-center`} onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" checked={checked} disabled={readOnly} onChange={() => onToggle(p.codigo)} className="accent-primary" />
                    </td>
                    <td className={`${td} font-semibold text-primary`}>{p.codigo}</td>
                    <td className={td}>{p.pais}</td>
                    <td className={td}>{p.area}</td>
                    <td className={td}>{p.nombre}</td>
                    <td className={td}>{p.cuenta}</td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && <Pagination page={pageSafe} totalPages={totalPages} totalItems={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} itemLabel="PEPs" />}
    </div>
  )
}
