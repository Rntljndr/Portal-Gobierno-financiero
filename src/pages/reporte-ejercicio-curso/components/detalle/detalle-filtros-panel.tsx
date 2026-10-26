import { Icon, MultiSelect } from '@/shared/ui'
import { PAISES_CON_REALES } from '../../lib/recoe-data'
import { DETALLE_FILTROS_VACIOS, GERENCIA_OPTIONS, BANDERA_OPTIONS, CUENTA_OPTIONS, RUBRO_OPTIONS, type DetalleFiltros } from '../../lib/detalle/filtros'

const labelClass = 'mb-1 block text-[11px] font-bold tracking-[0.04em] text-muted-foreground uppercase'

/** Mismo botón toggle que `RealesFilterToggle`/`ForecastFilterToggle` — el patrón de filtros estándar
 * del resto del portal (botón + panel inline en el flujo de la página, nunca un Drawer lateral). */
export function DetalleFilterToggle({ open, onToggle, activeCount }: { open: boolean; onToggle: () => void; activeCount: number }) {
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

interface DetalleFiltrosPanelProps {
  open: boolean
  filtros: DetalleFiltros
  onChange: (f: DetalleFiltros) => void
  activeCount: number
}

/** Panel inline (no Drawer) con los 5 campos del Detalle configurable — mismo layout `grid-cols-4` y
 * "Limpiar filtros" que `RealesFiltersPanel`/`ForecastFiltersPanel`. Solo afecta la tabla de abajo,
 * nunca a la Vista Ejecutiva. */
export function DetalleFiltrosPanel({ open, filtros, onChange, activeCount }: DetalleFiltrosPanelProps) {
  if (!open) return null

  return (
    <div className="flex flex-col gap-3.5 rounded-xl border border-border bg-white p-4.5 shadow-[0_4px_16px_rgba(6,20,60,0.06)]">
      <div className="grid grid-cols-4 gap-3">
        <div>
          <label className={labelClass}>País</label>
          <MultiSelect placeholder="Todos los países" options={PAISES_CON_REALES} values={filtros.pais} onChange={(v) => onChange({ ...filtros, pais: v })} />
        </div>
        <div>
          <label className={labelClass}>Gerencia</label>
          <MultiSelect placeholder="Todas" options={GERENCIA_OPTIONS} values={filtros.gerencia} onChange={(v) => onChange({ ...filtros, gerencia: v })} />
        </div>
        <div>
          <label className={labelClass}>División / Bandera</label>
          <MultiSelect placeholder="Todas" options={BANDERA_OPTIONS} values={filtros.bandera} onChange={(v) => onChange({ ...filtros, bandera: v })} />
        </div>
        <div>
          <label className={labelClass}>Cuenta Contable</label>
          <MultiSelect placeholder="Todas" options={CUENTA_OPTIONS} values={filtros.cuentaContable} onChange={(v) => onChange({ ...filtros, cuentaContable: v })} />
        </div>
        <div>
          <label className={labelClass}>Rubro</label>
          <MultiSelect placeholder="Todos" options={RUBRO_OPTIONS} values={filtros.rubro} onChange={(v) => onChange({ ...filtros, rubro: v })} />
        </div>
      </div>
      <div className="flex justify-end border-t border-primary/10 pt-2">
        <button
          type="button"
          onClick={() => onChange(DETALLE_FILTROS_VACIOS)}
          disabled={activeCount === 0}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12.5px] font-semibold text-cs-gris-oscuro hover:bg-[#F1F4FA] disabled:opacity-40"
        >
          <Icon name="trash" size={13} color="currentColor" /> Limpiar filtros {activeCount > 0 && `(${activeCount})`}
        </button>
      </div>
    </div>
  )
}
