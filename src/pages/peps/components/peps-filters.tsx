import { useState } from 'react'
import { Icon, MultiSelect } from '@/shared/ui'
import { pepFiltroOpciones } from '@/data/peps'

export interface PepFilters {
  pep: string
  cod: string
  servicio: string
  pais: string[]
  moneda: string[]
  area: string[]
  cuenta: string[]
  fechaDesde: string
  fechaHasta: string
}

interface PepsFiltersProps {
  filters: PepFilters
  onChange: <K extends keyof PepFilters>(key: K, value: PepFilters[K]) => void
  onClear: () => void
  activeCount: number
}

const inputClass = 'h-[38px] w-full rounded-[10px] border-[1.5px] border-border bg-white px-3 text-[12.5px] outline-none placeholder:text-muted-foreground focus:border-primary'
const labelClass = 'mb-1 block text-[11px] font-bold tracking-[0.04em] text-muted-foreground uppercase'

export function PepsFilters({ filters, onChange, onClear, activeCount }: PepsFiltersProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="mx-8 mb-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2.5 rounded-[10px] border-[1.5px] border-primary/30 bg-white px-4 py-2.5 text-[13.5px] font-bold text-primary hover:border-primary hover:bg-[#F4F7FE]"
      >
        <Icon name="filter" size={15} color="#0047B0" />
        <span>Filtro PEP N4</span>
        {activeCount > 0 && (
          <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1.5 text-[10.5px] font-bold text-white">
            {activeCount}
          </span>
        )}
        <Icon name={open ? 'chevron_up' : 'chevron_down'} size={13} color="#0047B0" />
      </button>

      {open && (
        <div className="mt-2.5 flex flex-col gap-3.5 rounded-xl border border-border bg-white p-4.5 shadow-[0_4px_16px_rgba(6,20,60,0.06)]">
          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className={labelClass}>PEP</label>
              <input className={inputClass} placeholder="Buscar PEP..." value={filters.pep} onChange={(e) => onChange('pep', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>País</label>
              <MultiSelect placeholder="Todos los países" options={pepFiltroOpciones.pais} values={filters.pais} onChange={(v) => onChange('pais', v)} />
            </div>
            <div>
              <label className={labelClass}>Moneda</label>
              <MultiSelect placeholder="Todas las monedas" options={pepFiltroOpciones.moneda} values={filters.moneda} onChange={(v) => onChange('moneda', v)} />
            </div>
            <div>
              <label className={labelClass}>Cód. servicio</label>
              <input className={inputClass} placeholder="Buscar código..." value={filters.cod} onChange={(e) => onChange('cod', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Servicio</label>
              <input className={inputClass} placeholder="Buscar servicio..." value={filters.servicio} onChange={(e) => onChange('servicio', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Área</label>
              <MultiSelect placeholder="Todas las áreas" options={pepFiltroOpciones.area} values={filters.area} onChange={(v) => onChange('area', v)} />
            </div>
            <div>
              <label className={labelClass}>Cuenta contable</label>
              <MultiSelect placeholder="Todas las cuentas" options={pepFiltroOpciones.cuenta} values={filters.cuenta} onChange={(v) => onChange('cuenta', v)} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={labelClass}>Creación desde</label>
                <input type="date" className={inputClass} value={filters.fechaDesde} onChange={(e) => onChange('fechaDesde', e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Hasta</label>
                <input type="date" className={inputClass} value={filters.fechaHasta} onChange={(e) => onChange('fechaHasta', e.target.value)} />
              </div>
            </div>
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
