import { useState } from 'react'
import { Icon, MultiSelect } from '@/shared/ui'
import { filtroOpciones } from '@/data/services'

export interface Filters {
  nombre: string[]
  codigo: string[]
  pep: string[]
  pais: string[]
  origen: string[]
  rubro: string[]
  gerenciaPadre: string[]
  gerencia: string[]
  equipo: string[]
}

interface FilterBarProps {
  filters: Filters
  onChange: <K extends keyof Filters>(key: K, values: Filters[K]) => void
  onClear: () => void
}

const activeCount = (f: Filters) => Object.values(f).reduce((a, v) => a + v.length, 0)

export function FilterBar({ filters, onChange, onClear }: FilterBarProps) {
  const [open, setOpen] = useState(false)
  const count = activeCount(filters)

  return (
    <div className="mx-8 mb-[26px]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2.5 rounded-[10px] border-[1.5px] border-primary/30 bg-white px-4 py-2.5 text-[13.5px] font-bold text-primary hover:border-primary hover:bg-[#F4F7FE]"
      >
        <Icon name="filter" size={15} color="#0047B0" />
        <span>Filtro PEP N4</span>
        {count > 0 && (
          <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1.5 text-[10.5px] font-bold text-white">
            {count}
          </span>
        )}
        <Icon name={open ? 'chevron_left' : 'chevron_right'} size={13} color="#0047B0" />
      </button>

      {open && (
        <div className="mt-2.5 flex flex-col gap-3.5 rounded-xl border border-border bg-white p-4.5 shadow-[0_4px_16px_rgba(6,20,60,0.06)]">
          <div className="grid grid-cols-3 gap-2.5">
            <MultiSelect placeholder="Nombre del servicio" options={filtroOpciones.nombre} values={filters.nombre} onChange={(v) => onChange('nombre', v)} />
            <MultiSelect placeholder="Código de servicio" options={filtroOpciones.codigo} values={filters.codigo} onChange={(v) => onChange('codigo', v)} />
            <MultiSelect placeholder="Código de PEP" options={filtroOpciones.pep} values={filters.pep} onChange={(v) => onChange('pep', v)} />
            <MultiSelect placeholder="País origen" options={filtroOpciones.pais} values={filters.pais} onChange={(v) => onChange('pais', v)} />
            <MultiSelect placeholder="Origen del servicio" options={filtroOpciones.origen} values={filters.origen} onChange={(v) => onChange('origen', v)} />
            <MultiSelect placeholder="Cuenta contable" options={filtroOpciones.rubro} values={filters.rubro} onChange={(v) => onChange('rubro', v)} />
            <MultiSelect placeholder="Gerencia padre" options={filtroOpciones.gerenciaPadre} values={filters.gerenciaPadre} onChange={(v) => onChange('gerenciaPadre', v)} />
            <MultiSelect placeholder="Gerencia" options={filtroOpciones.gerencia} values={filters.gerencia} onChange={(v) => onChange('gerencia', v)} />
            <MultiSelect placeholder="Equipo" options={filtroOpciones.equipo} values={filters.equipo} onChange={(v) => onChange('equipo', v)} />
          </div>
          <div className="flex justify-end border-t border-primary/10 pt-2">
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12.5px] font-semibold text-cs-gris-oscuro hover:bg-[#F1F4FA]"
            >
              <Icon name="trash" size={13} color="currentColor" /> Limpiar filtros
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
