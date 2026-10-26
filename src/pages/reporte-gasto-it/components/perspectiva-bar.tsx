import { Select, SegmentedTabs } from '@/shared/ui'
import { GIT_PAISES, type GitPais } from '@/data/gasto-it-v2'
import { PERSPECTIVAS, NEGOCIO_OPCIONES, GERENCIA_OPCIONES, GESTOR_OPCIONES, type Alcance, type Perspectiva } from '../lib'

interface PerspectivaBarProps {
  alcance: Alcance
  onChange: (patch: Partial<Alcance>) => void
}

const PAIS_OPCIONES = [{ value: 'todos', label: 'Todos los países' }, ...GIT_PAISES.map((p) => ({ value: p, label: p }))]

/** "Ver como": elige la audiencia del reporte y, según ella, qué negocio / gerencia / gestor se mira. */
export function PerspectivaBar({ alcance, onChange }: PerspectivaBarProps) {
  const p = alcance.perspectiva
  const descripcion = PERSPECTIVAS.find((x) => x.value === p)?.descripcion

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-white p-[14px_18px]">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
        <span className="text-[10px] font-bold tracking-[0.08em] text-muted-foreground uppercase">Ver como</span>
        <div className="max-w-full overflow-x-auto">
          <SegmentedTabs<Perspectiva> value={p} onChange={(v) => onChange({ perspectiva: v })} options={PERSPECTIVAS.map(({ value, label }) => ({ value, label }))} />
        </div>

        <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
          {p === 'negocio' && (
            <Select className="w-[220px]" value={alcance.negocio} onChange={(v) => onChange({ negocio: v })} options={NEGOCIO_OPCIONES} />
          )}
          {p === 'it' && (
            <Select className="w-[240px]" value={alcance.gerencia} onChange={(v) => onChange({ gerencia: v })} options={GERENCIA_OPCIONES} />
          )}
          {p === 'gestor' && (
            <Select className="w-[300px]" value={alcance.gestor} onChange={(v) => onChange({ gestor: v })} options={GESTOR_OPCIONES} />
          )}
          {p !== 'negocio' && (
            <Select className="w-[180px]" value={alcance.pais} onChange={(v) => onChange({ pais: v as GitPais | 'todos' })} options={PAIS_OPCIONES} />
          )}
        </div>
      </div>
      {descripcion && <div className="text-[12px] text-muted-foreground">{descripcion}</div>}
    </div>
  )
}
