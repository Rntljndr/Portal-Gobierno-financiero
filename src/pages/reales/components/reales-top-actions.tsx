import { Badge, Icon } from '@/shared/ui'
import { RealesFilterToggle } from './reales-filters'

interface RealesTopActionsProps {
  filtersOpen?: boolean
  onToggleFilters?: () => void
  activeFilterCount?: number
  activeForecastLabel?: string | null
}

/** Filtros y tag de forecast activo por sobre las cards de KPI, en Reales N4/N7/SubPEP — el resto de acciones sigue en la barra habitual. */
export function RealesTopActions({ filtersOpen, onToggleFilters, activeFilterCount = 0, activeForecastLabel }: RealesTopActionsProps) {
  return (
    <div className="mx-8 mb-4 flex flex-wrap items-center gap-2.5">
      {onToggleFilters && <RealesFilterToggle open={!!filtersOpen} onToggle={onToggleFilters} activeCount={activeFilterCount} />}
      {activeForecastLabel && (
        <Badge variant="neutral" className="border border-[#DDD0F8] bg-[#F3EEFF] text-[#6922E7]">
          <Icon name="trendup" size={12} color="currentColor" />
          {activeForecastLabel}
        </Badge>
      )}
    </div>
  )
}
