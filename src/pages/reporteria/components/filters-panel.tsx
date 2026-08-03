import { useState } from 'react'
import { Icon, MultiSelect } from '@/shared/ui'
import { filtroOpciones } from '@/data/services'
import { centrosCosto } from '@/data/centros-costo'
import { countryTabs, divisionData } from '@/data/reporteria'
import type { ReporteriaFilters } from '../lib/use-reporteria-filters'

interface FiltersPanelProps {
  filters: ReporteriaFilters
  onChange: <K extends keyof ReporteriaFilters>(key: K, value: ReporteriaFilters[K]) => void
  onClear: () => void
  activeCount: number
}

const forecastVersions = ['Forecast 2027 v3', 'Forecast 2027 v2', 'Forecast 2027 v1']
const divisiones = divisionData.map((d) => d.nombre)
const centrosCostoCodigos = centrosCosto.map((c) => c.codigo)

export function FiltersPanel({ filters, onChange, onClear, activeCount }: FiltersPanelProps) {
  const [open, setOpen] = useState(false)
  const [forecast, setForecast] = useState(forecastVersions[0])

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
          <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1.5 text-[10.5px] font-bold text-white">
            {activeCount}
          </span>
        )}
        <Icon name={open ? 'chevron_left' : 'chevron_right'} size={13} color="#0047B0" />
      </button>

      {open && (
        <div className="mt-2.5 flex flex-col gap-3.5 rounded-xl border border-border bg-white p-4.5 shadow-[0_4px_16px_rgba(6,20,60,0.06)]">
          <div className="grid grid-cols-4 gap-2.5">
            <MultiSelect placeholder="País origen" options={countryTabs} values={filters.paisOrigen} onChange={(v) => onChange('paisOrigen', v)} />
            <MultiSelect placeholder="País destino" options={countryTabs} values={filters.paisDestino} onChange={(v) => onChange('paisDestino', v)} />
            <select
              value={forecast}
              onChange={(e) => setForecast(e.target.value)}
              className="h-9 rounded-lg border border-border bg-white px-3 text-[12.5px] text-foreground outline-none"
            >
              {forecastVersions.map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
            <div className="flex h-9 items-center gap-2 rounded-lg border border-border bg-white px-3">
              <Icon name="search" size={14} color="#8A90A2" />
              <input
                value={filters.buscarServicio}
                onChange={(e) => onChange('buscarServicio', e.target.value)}
                placeholder="Buscar servicio"
                className="h-full flex-1 bg-transparent text-[12.5px] outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2.5">
            <MultiSelect placeholder="División" options={divisiones} values={filters.division} onChange={(v) => onChange('division', v)} />
            <MultiSelect placeholder="Bandera" options={filtroOpciones.bandera} values={filters.bandera} onChange={(v) => onChange('bandera', v)} />
            <MultiSelect placeholder="Centro de costo" options={centrosCostoCodigos} values={filters.centroCosto} onChange={(v) => onChange('centroCosto', v)} />
            <MultiSelect placeholder="Gerencia padre" options={filtroOpciones.gerenciaPadre} values={filters.gerenciaPadre} onChange={(v) => onChange('gerenciaPadre', v)} />
          </div>
          <div className="grid grid-cols-4 gap-2.5">
            <MultiSelect placeholder="Gerencia" options={filtroOpciones.gerencia} values={filters.gerencia} onChange={(v) => onChange('gerencia', v)} />
            <MultiSelect placeholder="Equipo" options={filtroOpciones.equipo} values={filters.equipo} onChange={(v) => onChange('equipo', v)} />
            <MultiSelect placeholder="Cuenta contable" options={filtroOpciones.cuentaContable} values={filters.cuentaContable} onChange={(v) => onChange('cuentaContable', v)} />
            <MultiSelect placeholder="Código PEP" options={filtroOpciones.codigo} values={filters.codigoPep} onChange={(v) => onChange('codigoPep', v)} />
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
