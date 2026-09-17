import { useState } from 'react'
import { Icon, MultiSelect, Select } from '@/shared/ui'
import { filtroOpciones } from '@/data/services'
import { DIRECCION_BANDERAS, DIRECCION_DIVISIONES, DIRECCION_RUBROS } from '@/data/reporte-direccion'
import { TODAS, type DireccionFilters } from '../lib/use-direccion-filters'
import { DireccionPeriodoSelector } from './direccion-periodo-selector'

const label = 'mb-1 block text-[10px] font-bold tracking-[0.06em] text-muted-foreground uppercase'

function withTodas(opciones: string[], todasLabel = 'Todas') {
  return [{ value: TODAS, label: todasLabel }, ...opciones.map((o) => ({ value: o, label: o }))]
}

interface DireccionFiltersPanelProps {
  filters: DireccionFilters
  onChange: <K extends keyof DireccionFilters>(key: K, value: DireccionFilters[K]) => void
  activeCount: number
}

export function DireccionFiltersPanel({ filters, onChange, activeCount }: DireccionFiltersPanelProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="mx-8 mb-[26px]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2.5 rounded-[10px] border-[1.5px] border-primary/30 bg-white px-4 py-2.5 text-[13.5px] font-bold text-primary hover:border-primary hover:bg-[#F4F7FE]"
      >
        <Icon name="filter" size={15} color="#0047B0" />
        <span>Filtros</span>
        {activeCount > 0 && (
          <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1.5 text-[10.5px] font-bold text-white">{activeCount}</span>
        )}
        <Icon name={open ? 'chevron_left' : 'chevron_right'} size={13} color="#0047B0" />
      </button>

      {open && (
        <div className="mt-2.5 grid grid-cols-3 gap-3 rounded-xl border border-border bg-white p-[16px_18px] shadow-[0_4px_16px_rgba(6,20,60,0.06)] md:grid-cols-5">
          <div>
            <label className={label}>División</label>
            <Select value={filters.division} onChange={(v) => onChange('division', v)} options={withTodas(DIRECCION_DIVISIONES)} />
          </div>
          <div>
            <label className={label}>Bandera</label>
            <Select value={filters.bandera} onChange={(v) => onChange('bandera', v)} options={withTodas(DIRECCION_BANDERAS)} />
          </div>
          <div>
            <label className={label}>Rubro</label>
            <Select value={filters.rubro} onChange={(v) => onChange('rubro', v)} options={withTodas(DIRECCION_RUBROS)} />
          </div>
          <div>
            <label className={label}>País</label>
            <MultiSelect placeholder="Todos" options={filtroOpciones.pais} values={filters.pais} onChange={(v) => onChange('pais', v)} />
          </div>
          <div>
            <label className={label}>Periodo</label>
            <DireccionPeriodoSelector
              anio={filters.periodoAnio}
              meses={filters.periodoMeses}
              onChangeAnio={(v) => onChange('periodoAnio', v)}
              onChangeMeses={(v) => onChange('periodoMeses', v)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
