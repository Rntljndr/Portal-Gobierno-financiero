import { Icon, MultiSelect } from '@/shared/ui'
import type { RealesFilterOptions, RealesFilters } from '../lib/reales-filters-types'

interface RealesFiltersPanelProps {
  open: boolean
  isN7: boolean
  filters: RealesFilters
  options: RealesFilterOptions
  onChange: <K extends keyof RealesFilters>(key: K, value: RealesFilters[K]) => void
  onClear: () => void
  activeCount: number
}

const inputClass = 'h-[38px] w-full rounded-[10px] border-[1.5px] border-border bg-white px-3 text-[12.5px] outline-none placeholder:text-muted-foreground focus:border-primary'
const labelClass = 'mb-1 block text-[11px] font-bold tracking-[0.04em] text-muted-foreground uppercase'

export function RealesFilterToggle({ open, onToggle, activeCount }: { open: boolean; onToggle: () => void; activeCount: number }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex items-center gap-2.5 rounded-[10px] border-[1.5px] border-primary/30 bg-white px-4 py-2.5 text-[13.5px] font-bold text-primary hover:border-primary hover:bg-[#F4F7FE]"
    >
      <Icon name="filter" size={15} color="#0047B0" />
      <span>Filtros</span>
      {activeCount > 0 && (
        <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1.5 text-[10.5px] font-bold text-white">
          {activeCount}
        </span>
      )}
      <Icon name={open ? 'chevron_up' : 'chevron_down'} size={13} color="#0047B0" />
    </button>
  )
}

export function RealesFiltersPanel({ open, isN7, filters, options, onChange, onClear, activeCount }: RealesFiltersPanelProps) {
  if (!open) return null

  return (
    <div className="mx-8 mb-4 flex flex-col gap-3.5 rounded-xl border border-border bg-white p-4.5 shadow-[0_4px_16px_rgba(6,20,60,0.06)]">
      <div className="grid grid-cols-4 gap-3">
        <div>
          <label className={labelClass}>Servicio</label>
          <input className={inputClass} placeholder="Buscar servicio..." value={filters.servicio} onChange={(e) => onChange('servicio', e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Código de servicio</label>
          <input className={inputClass} placeholder="N4-2027-..." value={filters.codigo} onChange={(e) => onChange('codigo', e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>País</label>
          <MultiSelect placeholder="Todos los países" options={options.pais} values={filters.pais} onChange={(v) => onChange('pais', v)} />
        </div>
        <div>
          <label className={labelClass}>Gerencia padre</label>
          <MultiSelect placeholder="Todas" options={options.gerenciaPadre} values={filters.gerenciaPadre} onChange={(v) => onChange('gerenciaPadre', v)} />
        </div>
        <div>
          <label className={labelClass}>Gerencia</label>
          <MultiSelect placeholder="Todas" options={options.gerencia} values={filters.gerencia} onChange={(v) => onChange('gerencia', v)} />
        </div>
        <div>
          <label className={labelClass}>Equipo</label>
          <MultiSelect placeholder="Todos los equipos" options={options.equipo} values={filters.equipo} onChange={(v) => onChange('equipo', v)} />
        </div>
        {isN7 && (
          <div>
            <label className={labelClass}>Centro de costos</label>
            <MultiSelect placeholder="Todos" options={options.centroCosto} values={filters.centroCosto} onChange={(v) => onChange('centroCosto', v)} />
          </div>
        )}
        {isN7 && (
          <div>
            <label className={labelClass}>Asignación</label>
            <MultiSelect placeholder="Todas" options={options.asignacion} values={filters.asignacion} onChange={(v) => onChange('asignacion', v)} />
          </div>
        )}
        {isN7 && (
          <div>
            <label className={labelClass}>Bandera</label>
            <MultiSelect placeholder="Todas" options={options.bandera} values={filters.bandera} onChange={(v) => onChange('bandera', v)} />
          </div>
        )}
        <div>
          <label className={labelClass}>Cuenta contable</label>
          <MultiSelect placeholder="Todas las cuentas" options={options.cuentaContable} values={filters.cuentaContable} onChange={(v) => onChange('cuentaContable', v)} />
        </div>
        <div>
          <label className={labelClass}>Moneda</label>
          <MultiSelect placeholder="Todas las monedas" options={options.moneda} values={filters.moneda} onChange={(v) => onChange('moneda', v)} />
        </div>
      </div>
      <div className="flex justify-end border-t border-primary/10 pt-2">
        <button
          type="button"
          onClick={onClear}
          disabled={activeCount === 0}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12.5px] font-semibold text-cs-gris-oscuro hover:bg-[#F1F4FA] disabled:opacity-40"
        >
          <Icon name="trash" size={13} color="currentColor" /> Limpiar filtros {activeCount > 0 && `(${activeCount})`}
        </button>
      </div>
    </div>
  )
}
