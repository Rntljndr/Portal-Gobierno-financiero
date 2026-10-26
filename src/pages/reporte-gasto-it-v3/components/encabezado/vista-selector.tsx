import { FilterButton, OptionCards } from '@/shared/ui'
import { V3_FLAG, V3_PAISES } from '@/data/gasto-it-v3'
import { ROLES, type Alcance } from '../../lib'

interface VistaSelectorProps {
  alcance: Alcance
  onChange: (patch: Partial<Alcance>) => void
}

/** Selección de la vista (audiencia) como tarjetas, y bajo ellas el país: toda la información del reporte
 * varía según esta selección. */
export function VistaSelector({ alcance, onChange }: VistaSelectorProps) {
  const { rol, pais } = alcance
  return (
    <div className="flex flex-col gap-4">
      <OptionCards value={rol} onChange={(r) => onChange({ rol: r })} options={ROLES} aria-label="Vista del reporte" />

      <div className="flex flex-wrap items-center gap-2">
        <FilterButton size="sm" active={pais === 'todos'} onClick={() => onChange({ pais: 'todos' })}>
          Todos los países
        </FilterButton>
        {V3_PAISES.map((p) => (
          <FilterButton key={p} size="sm" active={pais === p} onClick={() => onChange({ pais: p })}>
            <span className="text-base leading-none">{V3_FLAG[p]}</span>
            {p}
          </FilterButton>
        ))}
      </div>
    </div>
  )
}
