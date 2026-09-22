import { useState } from 'react'
import { forecastPepList } from '@/data/forecast'

interface PepSelectionTableProps {
  selected: Set<string>
  onToggle: (codigo: string) => void
  readOnly?: boolean
}

/** Sin paginación (Ajuste T6): la lista de PEPs es chica (~40) y se recorre entera con scroll,
 * en vez de forzar al usuario a pasar de página para verla completa. */
export function PepSelectionTable({ selected, onToggle, readOnly = false }: PepSelectionTableProps) {
  const [filters, setFilters] = useState({ pep: '', pais: '', area: '', desc: '' })

  const filtered = forecastPepList.filter(
    (p) =>
      (!filters.pep || p.codigo.toLowerCase().includes(filters.pep.toLowerCase())) &&
      (!filters.pais || p.pais.toLowerCase().includes(filters.pais.toLowerCase())) &&
      (!filters.area || p.area.toLowerCase().includes(filters.area.toLowerCase())) &&
      (!filters.desc || p.nombre.toLowerCase().includes(filters.desc.toLowerCase())),
  )

  const allSelected = filtered.length > 0 && filtered.every((p) => selected.has(p.codigo))

  const toggleAll = () => {
    if (readOnly) return
    filtered.forEach((p) => (allSelected ? selected.has(p.codigo) && onToggle(p.codigo) : !selected.has(p.codigo) && onToggle(p.codigo)))
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
      <div className="mb-1.5 text-[11px] text-muted-foreground">{filtered.length} PEPs</div>
      <div className="max-h-[420px] overflow-y-auto overflow-x-auto rounded-lg border border-border">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr>
              <th className={`${th} sticky top-0 z-[1] w-9 text-center`}>
                <input type="checkbox" checked={allSelected} disabled={readOnly} onChange={toggleAll} className="accent-primary" />
              </th>
              <th className={`${th} sticky top-0 z-[1]`}>PEP</th>
              <th className={`${th} sticky top-0 z-[1]`}>País</th>
              <th className={`${th} sticky top-0 z-[1]`}>Área</th>
              <th className={`${th} sticky top-0 z-[1]`}>Descripción</th>
              <th className={`${th} sticky top-0 z-[1]`}>Cta.</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-5 text-center text-muted-foreground">
                  Sin resultados
                </td>
              </tr>
            ) : (
              filtered.map((p) => {
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
    </div>
  )
}
