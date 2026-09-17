import { MultiSelect } from '@/shared/ui'
import { filtroOpciones, banderasByDivision } from '@/data/services'
import { optionsFor } from '@/shared/lib/utils'
import type { ConsolidadoFilters } from '../lib/use-consolidado-filters'

const label = 'mb-1 block text-[10px] font-bold tracking-[0.06em] text-muted-foreground uppercase'

interface ConsolidadoMoreFiltersProps {
  filters: ConsolidadoFilters
  onChange: <K extends keyof ConsolidadoFilters>(key: K, value: ConsolidadoFilters[K]) => void
  hidePaisOrigen: boolean
}

export function ConsolidadoMoreFilters({ filters, onChange, hidePaisOrigen }: ConsolidadoMoreFiltersProps) {
  const banderaOpts = optionsFor(banderasByDivision, filters.division, filtroOpciones.bandera)

  return (
    <div className="mt-3 grid grid-cols-2 gap-3 border-t border-border pt-3 md:grid-cols-4">
      <div>
        <label className={label}>Gerencia</label>
        <MultiSelect placeholder="Todas" options={filtroOpciones.gerencia} values={filters.gerencia} onChange={(v) => onChange('gerencia', v)} />
      </div>
      <div>
        <label className={label}>Equipo</label>
        <MultiSelect placeholder="Todos" options={filtroOpciones.equipo} values={filters.equipo} onChange={(v) => onChange('equipo', v)} />
      </div>
      {!hidePaisOrigen && (
        <div>
          <label className={label}>País origen</label>
          <MultiSelect placeholder="Todos" options={filtroOpciones.pais} values={filters.paisOrigen} onChange={(v) => onChange('paisOrigen', v)} />
        </div>
      )}
      <div>
        <label className={label}>Rubro</label>
        <MultiSelect placeholder="Todos" options={filtroOpciones.rubro} values={filters.rubro} onChange={(v) => onChange('rubro', v)} />
      </div>
      <div>
        <label className={label}>División</label>
        <MultiSelect placeholder="Todas" options={filtroOpciones.division} values={filters.division} onChange={(v) => onChange('division', v)} />
      </div>
      <div>
        <label className={label}>Bandera</label>
        <MultiSelect placeholder="Todas" options={banderaOpts} values={filters.bandera} onChange={(v) => onChange('bandera', v)} />
      </div>
      <div>
        <label className={label}>Cuenta contable</label>
        <MultiSelect placeholder="Todas" options={filtroOpciones.cuentaContable} values={filters.cuentaContable} onChange={(v) => onChange('cuentaContable', v)} />
      </div>
    </div>
  )
}
