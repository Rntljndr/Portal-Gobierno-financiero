import { Icon, MultiSelect } from '@/shared/ui'
import { filtroOpciones } from '@/data/services'
import { centrosCosto } from '@/data/centros-costo'
import {
  allBanderas,
  allEquipos,
  allGerencias,
  banderasByDivision,
  descripcionOptions,
  divisionOptions,
  equiposByGerencia,
  gerenciaPadreOptions,
  gerenciasByPadre,
  justificacionOptions,
  optionsFor,
  origenServicioOptions,
  referenciaOptions,
} from '../lib/filter-catalog'
import type { ReporteriaFilters } from '../lib/use-reporteria-filters'

const centrosCostoCodigos = centrosCosto.map((c) => c.codigo)
const label = 'mb-0.5 block text-[10px] font-bold tracking-[0.07em] text-muted-foreground uppercase'

interface FiltersFieldsGridProps {
  draft: ReporteriaFilters
  onChange: <K extends keyof ReporteriaFilters>(key: K, value: ReporteriaFilters[K]) => void
}

export function FiltersFieldsGrid({ draft, onChange }: FiltersFieldsGridProps) {
  const banderaOpts = optionsFor(banderasByDivision, draft.division, allBanderas)
  const gerenciaOpts = optionsFor(gerenciasByPadre, draft.gerenciaPadre, allGerencias)
  const equipoOpts = optionsFor(equiposByGerencia, draft.gerencia, allEquipos)

  return (
    <div className="grid grid-cols-4 gap-2.5 p-[14px_18px_10px]">
      <div className="col-span-2">
        <label className={label}>Buscar servicio</label>
        <div className="flex h-9 items-center gap-2 rounded-lg border border-border bg-white px-3">
          <Icon name="search" size={14} color="#8A90A2" />
          <input
            value={draft.buscarServicio}
            onChange={(e) => onChange('buscarServicio', e.target.value)}
            placeholder="Buscar servicio"
            className="h-full flex-1 bg-transparent text-[12.5px] outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div>
        <label className={label}>División</label>
        <MultiSelect placeholder="Todas" options={divisionOptions} values={draft.division} onChange={(v) => onChange('division', v)} />
      </div>
      <div>
        <label className={label}>Bandera</label>
        <MultiSelect placeholder="Todas" options={banderaOpts} values={draft.bandera} onChange={(v) => onChange('bandera', v)} />
      </div>
      <div>
        <label className={label}>Centro de costo</label>
        <MultiSelect placeholder="Todos" options={centrosCostoCodigos} values={draft.centroCosto} onChange={(v) => onChange('centroCosto', v)} />
      </div>
      <div>
        <label className={label}>Gerencia padre</label>
        <MultiSelect placeholder="Todas" options={gerenciaPadreOptions} values={draft.gerenciaPadre} onChange={(v) => onChange('gerenciaPadre', v)} />
      </div>
      <div>
        <label className={label}>Gerencia hijo</label>
        <MultiSelect placeholder="Todas" options={gerenciaOpts} values={draft.gerencia} onChange={(v) => onChange('gerencia', v)} />
      </div>
      <div>
        <label className={label}>Equipo</label>
        <MultiSelect placeholder="Todos" options={equipoOpts} values={draft.equipo} onChange={(v) => onChange('equipo', v)} />
      </div>
      <div>
        <label className={label}>Cuenta contable</label>
        <MultiSelect placeholder="Todas" options={filtroOpciones.cuentaContable} values={draft.cuentaContable} onChange={(v) => onChange('cuentaContable', v)} />
      </div>
      <div>
        <label className={label}>Código PEP</label>
        <MultiSelect placeholder="Todos" options={filtroOpciones.codigo} values={draft.codigoPep} onChange={(v) => onChange('codigoPep', v)} />
      </div>
      <div>
        <label className={label}>Origen del servicio</label>
        <MultiSelect placeholder="Todos" options={origenServicioOptions} values={draft.origenServicio} onChange={(v) => onChange('origenServicio', v)} />
      </div>
      <div>
        <label className={label}>Referencia</label>
        <MultiSelect placeholder="Todas" options={referenciaOptions} values={draft.referencia} onChange={(v) => onChange('referencia', v)} />
      </div>
      <div>
        <label className={label}>Justificación</label>
        <MultiSelect placeholder="Todas" options={justificacionOptions} values={draft.justificacion} onChange={(v) => onChange('justificacion', v)} />
      </div>
      <div>
        <label className={label}>Descripción</label>
        <MultiSelect placeholder="Todas" options={descripcionOptions} values={draft.descripcion} onChange={(v) => onChange('descripcion', v)} />
      </div>
    </div>
  )
}
