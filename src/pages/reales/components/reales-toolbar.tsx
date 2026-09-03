import { Badge, Button, Icon } from '@/shared/ui'
import { RealesFilterToggle } from './reales-filters'
import { CompararButton } from './comparar-button'

interface RealesToolbarProps {
  filtersOpen: boolean
  onToggleFilters: () => void
  activeFilterCount: number
  comparisonCount: number
  onOpenComparar: () => void
  onDownload: () => void
  onOpenColumnas: () => void
}

export function RealesToolbar({ filtersOpen, onToggleFilters, activeFilterCount, comparisonCount, onOpenComparar, onDownload, onOpenColumnas }: RealesToolbarProps) {
  return (
    <div className="mx-8 mb-3 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <RealesFilterToggle open={filtersOpen} onToggle={onToggleFilters} activeCount={activeFilterCount} />
        <Badge variant="neutral" className="border border-[#DDD0F8] bg-[#F3EEFF] text-[#6922E7]">
          <Icon name="trendup" size={12} color="currentColor" />
          Forecast Agosto 2026
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onOpenColumnas}>
          <Icon name="eye" size={12} color="#0047B0" /> Columnas
        </Button>
        <Button variant="outline" size="sm" onClick={onDownload}>
          <Icon name="download" size={12} color="#0047B0" /> Descargar
        </Button>
        <CompararButton count={comparisonCount} onClick={onOpenComparar} />
      </div>
    </div>
  )
}
