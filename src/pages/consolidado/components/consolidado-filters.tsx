import { useState } from 'react'
import { Icon, MultiSelect } from '@/shared/ui'
import { filtroOpciones, type Pais } from '@/data/services'
import type { ConsolidadoFilters } from '../lib/use-consolidado-filters'
import { ConsolidadoMoreFilters } from './consolidado-more-filters'

const label = 'mb-1 block text-[10px] font-bold tracking-[0.06em] text-muted-foreground uppercase'
const TIPO_GASTO_OPTIONS = ['Recurrente', 'Nuevo Servicio']

interface ConsolidadoFiltersProps {
  filters: ConsolidadoFilters
  onChange: <K extends keyof ConsolidadoFilters>(key: K, value: ConsolidadoFilters[K]) => void
  hidePaisOrigen: boolean
  hidePaisDestino: boolean
  paisMonedaChip: { label: string; value: Pais } | null
  onClearPaisMoneda: () => void
}

export function ConsolidadoFiltersBar({ filters, onChange, hidePaisOrigen, hidePaisDestino, paisMonedaChip, onClearPaisMoneda }: ConsolidadoFiltersProps) {
  const [showMore, setShowMore] = useState(false)

  return (
    <div className="mx-8 mb-[26px] rounded-xl border border-border bg-white p-[14px_18px]">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {!hidePaisDestino && (
          <div>
            <label className={label}>País destino</label>
            <MultiSelect placeholder="Todos" options={filtroOpciones.pais} values={filters.paisDestino} onChange={(v) => onChange('paisDestino', v)} />
          </div>
        )}
        <div>
          <label className={label}>Gerencia padre</label>
          <MultiSelect placeholder="Todas" options={filtroOpciones.gerenciaPadre} values={filters.gerenciaPadre} onChange={(v) => onChange('gerenciaPadre', v)} />
        </div>
        <div>
          <label className={label}>Tipo de gasto</label>
          <MultiSelect placeholder="Todos" options={TIPO_GASTO_OPTIONS} values={filters.tipoGasto} onChange={(v) => onChange('tipoGasto', v)} />
        </div>
        <div>
          <label className={label}>Buscar en el presupuesto</label>
          <div className="flex h-9 items-center gap-2 rounded-lg border border-border bg-white px-3">
            <Icon name="search" size={14} color="#8A90A2" />
            <input
              value={filters.buscar}
              onChange={(e) => onChange('buscar', e.target.value)}
              placeholder="Servicio, PEP o cuenta..."
              className="h-full flex-1 bg-transparent text-[12.5px] outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </div>

      <button type="button" onClick={() => setShowMore((v) => !v)} className="mt-2.5 inline-flex items-center gap-1.5 text-[12px] font-semibold text-primary hover:underline">
        <Icon name="filter" size={12} color="#0047B0" />
        {showMore ? 'Menos filtros' : 'Más filtros'}
        <Icon name={showMore ? 'chevron_up' : 'chevron_down'} size={11} color="#0047B0" />
      </button>

      {paisMonedaChip && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EFF4FF] py-[3px] pr-1.5 pl-2.5 text-[11px] font-semibold text-primary">
            {paisMonedaChip.label}: {paisMonedaChip.value}
            <button type="button" onClick={onClearPaisMoneda} className="inline-flex items-center">
              <Icon name="x_close" size={10} color="#0047B0" />
            </button>
          </span>
        </div>
      )}

      {showMore && <ConsolidadoMoreFilters filters={filters} onChange={onChange} hidePaisOrigen={hidePaisOrigen} />}
    </div>
  )
}
