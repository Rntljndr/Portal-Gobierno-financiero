import { Icon, MultiSelect } from '@/shared/ui'
import { filtroOpciones, banderasByDivision, origenServicioOptions } from '@/data/services'
import { optionsFor } from '@/shared/lib/utils'
import type { ConsolidadaFilters } from '../lib/use-consolidada-filters'
import { ConsolidadaMesSelector } from './consolidada-mes-selector'

const label = 'mb-1 block text-[10px] font-bold tracking-[0.06em] text-muted-foreground uppercase'

interface ConsolidadaFiltersFieldsProps {
  filters: ConsolidadaFilters
  onChange: <K extends keyof ConsolidadaFilters>(key: K, value: ConsolidadaFilters[K]) => void
}

export function ConsolidadaFiltersFields({ filters, onChange }: ConsolidadaFiltersFieldsProps) {
  const banderaOpts = optionsFor(banderasByDivision, filters.division, filtroOpciones.bandera)

  return (
    <div className="grid grid-cols-2 gap-3 p-[16px_18px] md:grid-cols-4">
      <div className="col-span-2 md:col-span-4">
        <label className={label}>Buscar PEP, servicio, cuenta</label>
        <div className="flex h-9 items-center gap-2 rounded-lg border border-border bg-white px-3">
          <Icon name="search" size={14} color="#8A90A2" />
          <input
            value={filters.buscar}
            onChange={(e) => onChange('buscar', e.target.value)}
            placeholder="Buscar..."
            className="h-full flex-1 bg-transparent text-[12.5px] outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div>
        <label className={label}>Gerencia Padre</label>
        <MultiSelect placeholder="Todas" options={filtroOpciones.gerenciaPadre} values={filters.gerenciaPadre} onChange={(v) => onChange('gerenciaPadre', v)} />
      </div>
      <div>
        <label className={label}>Gerencia</label>
        <MultiSelect placeholder="Todas" options={filtroOpciones.gerencia} values={filters.gerencia} onChange={(v) => onChange('gerencia', v)} />
      </div>
      <div>
        <label className={label}>Equipo</label>
        <MultiSelect placeholder="Todos" options={filtroOpciones.equipo} values={filters.equipo} onChange={(v) => onChange('equipo', v)} />
      </div>
      <div>
        <label className={label}>País Origen</label>
        <MultiSelect placeholder="Todos" options={filtroOpciones.pais} values={filters.paisOrigen} onChange={(v) => onChange('paisOrigen', v)} />
      </div>
      <div>
        <label className={label}>País Destino</label>
        <MultiSelect placeholder="Todos" options={filtroOpciones.pais} values={filters.paisDestino} onChange={(v) => onChange('paisDestino', v)} />
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
        <label className={label}>Rubro</label>
        <MultiSelect placeholder="Todos" options={filtroOpciones.rubro} values={filters.rubro} onChange={(v) => onChange('rubro', v)} />
      </div>
      <div>
        <label className={label}>Cuenta Contable</label>
        <MultiSelect placeholder="Todas" options={filtroOpciones.cuentaContable} values={filters.cuentaContable} onChange={(v) => onChange('cuentaContable', v)} />
      </div>
      <div>
        <label className={label}>Origen Servicio</label>
        <MultiSelect placeholder="Todos" options={[...origenServicioOptions]} values={filters.origenServicio} onChange={(v) => onChange('origenServicio', v)} />
      </div>
      <div>
        <label className={label}>Mes</label>
        <ConsolidadaMesSelector value={filters.meses} onChange={(v) => onChange('meses', v)} />
      </div>
    </div>
  )
}
