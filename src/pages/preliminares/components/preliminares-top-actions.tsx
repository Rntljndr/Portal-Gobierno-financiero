import { Badge, Button, Icon } from '@/shared/ui'
import { useRole } from '@/shared/context/use-role'
import { PrelimFilterToggle } from './preliminares-filters'

interface PreliminaresTopActionsProps {
  filtersOpen: boolean
  onToggleFilters: () => void
  activeFilterCount: number
  activeForecastLabel?: string | null
  onCierreContable: () => void
  /** El botón de acción (no el tag informativo) es exclusivo de la vista general — se oculta en la navegación interna N7/SubPEP. */
  showCierreContable?: boolean
}

/** Filtros y Cierre Contable por sobre las cards de KPI, en Preliminares N4 y N7 — el resto de las acciones sigue en la barra habitual. */
export function PreliminaresTopActions({
  filtersOpen,
  onToggleFilters,
  activeFilterCount,
  activeForecastLabel,
  onCierreContable,
  showCierreContable = true,
}: PreliminaresTopActionsProps) {
  const { role } = useRole()
  const isCdG = role === 'cdg'

  return (
    <div className="mx-8 mb-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <PrelimFilterToggle open={filtersOpen} onToggle={onToggleFilters} activeCount={activeFilterCount} />
        {activeForecastLabel && (
          <Badge variant="neutral" className="border border-[#DDD0F8] bg-[#F3EEFF] text-[#6922E7]">
            <Icon name="trendup" size={12} color="currentColor" />
            {activeForecastLabel}
          </Badge>
        )}
      </div>
      {isCdG && showCierreContable && (
        <Button variant="primary" size="sm" onClick={onCierreContable} className="bg-[#B42318] hover:bg-[#941d15]">
          <Icon name="lock" size={12} color="#fff" /> Cierre Contable
        </Button>
      )}
    </div>
  )
}
