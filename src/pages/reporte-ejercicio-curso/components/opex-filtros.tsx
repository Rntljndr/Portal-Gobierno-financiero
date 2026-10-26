import { Icon, MultiSelect } from '@/shared/ui'
import type { Rubro } from '@/data/opex-it-chile'
import {
  CUENTA_CONTABLE_OPTIONS,
  DIVISION_OPTIONS,
  OPEX_FILTROS_VACIOS,
  RESPONSABLE_OPTIONS,
  RUBRO_OPTIONS,
  type OpexFiltros,
} from '../lib/opex-it-chile-helpers'

const labelClass = 'mb-1 block text-[11px] font-bold tracking-[0.04em] text-muted-foreground uppercase'

function contarActivos(filtros: OpexFiltros): number {
  return Object.values(filtros).filter((v) => (Array.isArray(v) ? v.length > 0 : Boolean(v))).length
}

/** Mismo botón toggle que `DetalleFilterToggle` (Detalle configurable) — el patrón de filtros estándar
 * del portal, botón + panel inline, nunca una barra siempre visible ni un Drawer. */
export function OpexFilterToggle({ open, onToggle, filtros }: { open: boolean; onToggle: () => void; filtros: OpexFiltros }) {
  const activos = contarActivos(filtros)
  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex items-center gap-2.5 rounded-[10px] border-[1.5px] border-primary/30 bg-white px-4 py-2.5 text-[13.5px] font-bold text-primary hover:border-primary hover:bg-[#F4F7FE]"
    >
      <Icon name="filter" size={15} color="#0047B0" />
      <span>Filtros</span>
      {activos > 0 && (
        <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1.5 text-[10.5px] font-bold text-white">
          {activos}
        </span>
      )}
      <Icon name={open ? 'chevron_up' : 'chevron_down'} size={13} color="#0047B0" />
    </button>
  )
}

interface OpexFiltrosBarProps {
  open: boolean
  filtros: OpexFiltros
  onChange: (next: OpexFiltros) => void
}

/** Panel inline de filtros de "OPEX IT Chile" — mismo componente/comportamiento que el panel de
 * Filtros del Detalle configurable (`DetalleFiltrosPanel`): toggle + panel en el flujo de la página, sin
 * Drawer, con el mismo grid-cols-4 y "Limpiar filtros" abajo a la derecha. Contenido igual al que ya
 * tenía esta vista: todos son selección múltiple por checkbox (verificado en vivo contra el reporte
 * Power BI), salvo Servicio que es un buscador de texto. Rubro aplica como filtro global de verdad —
 * recalcula KPIs, Rubro, División, Servicios/PEP y Responsable a la vez, igual que en Power BI — porque
 * es el único cruce que se pudo verificar con cifras reales (ver `porRubro` en los datos).
 * Responsable/División/Cuenta Contable solo acotan su propia tabla: el reporte original sí los cruza
 * contra todas las vistas, pero eso requeriría inventar relaciones que no se pudieron confirmar con
 * datos reales. */
export function OpexFiltrosBar({ open, filtros, onChange }: OpexFiltrosBarProps) {
  if (!open) return null
  const activos = contarActivos(filtros)

  return (
    <div className="flex flex-col gap-3.5 rounded-xl border border-border bg-white p-4.5 shadow-[0_4px_16px_rgba(6,20,60,0.06)]">
      <div className="grid grid-cols-4 gap-3">
        <div>
          <label className={labelClass}>Servicio</label>
          <div className="flex h-[38px] items-center gap-2 rounded-lg border border-border bg-white px-3">
            <Icon name="search" size={13} color="#8A90A2" />
            <input
              value={filtros.servicio}
              onChange={(e) => onChange({ ...filtros, servicio: e.target.value })}
              placeholder="Buscar..."
              className="h-full w-full bg-transparent text-[12.5px] outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Responsable</label>
          <MultiSelect
            placeholder="Todas"
            options={RESPONSABLE_OPTIONS}
            values={filtros.responsable}
            onChange={(v) => onChange({ ...filtros, responsable: v })}
          />
        </div>

        <div>
          <label className={labelClass}>Rubro</label>
          <MultiSelect placeholder="Todas" options={RUBRO_OPTIONS} values={filtros.rubro} onChange={(v) => onChange({ ...filtros, rubro: v as Rubro[] })} />
        </div>

        <div>
          <label className={labelClass}>División</label>
          <MultiSelect placeholder="Todas" options={DIVISION_OPTIONS} values={filtros.division} onChange={(v) => onChange({ ...filtros, division: v })} />
        </div>

        <div>
          <label className={labelClass}>Cuenta Contable</label>
          <MultiSelect
            placeholder="Todas"
            options={CUENTA_CONTABLE_OPTIONS}
            values={filtros.cuentaContable}
            onChange={(v) => onChange({ ...filtros, cuentaContable: v })}
          />
        </div>
      </div>
      <div className="flex justify-end border-t border-primary/10 pt-2">
        <button
          type="button"
          onClick={() => onChange(OPEX_FILTROS_VACIOS)}
          disabled={activos === 0}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12.5px] font-semibold text-cs-gris-oscuro hover:bg-[#F1F4FA] disabled:opacity-40"
        >
          <Icon name="trash" size={13} color="currentColor" /> Limpiar filtros {activos > 0 && `(${activos})`}
        </button>
      </div>
    </div>
  )
}
