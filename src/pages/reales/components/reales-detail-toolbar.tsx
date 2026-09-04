import { Badge, Button, Icon } from '@/shared/ui'
import { RealesFilterToggle } from './reales-filters'
import { CompararButton } from './comparar-button'

interface RealesDetailToolbarProps {
  filtersOpen?: boolean
  onToggleFilters?: () => void
  activeFilterCount?: number
  comparisonCount: number
  allComparisonsCollapsed: boolean
  onToggleAllComparisons: () => void
  onDownload: () => void
  onOpenComparar: () => void
  onOpenCargaMasiva: () => void
}

export function RealesDetailToolbar({
  filtersOpen,
  onToggleFilters,
  activeFilterCount = 0,
  comparisonCount,
  allComparisonsCollapsed,
  onToggleAllComparisons,
  onDownload,
  onOpenComparar,
  onOpenCargaMasiva,
}: RealesDetailToolbarProps) {
  return (
    <div className="mx-8 mb-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        {onToggleFilters && <RealesFilterToggle open={!!filtersOpen} onToggle={onToggleFilters} activeCount={activeFilterCount} />}
        <Badge variant="neutral" className="border border-[#DDD0F8] bg-[#F3EEFF] text-[#6922E7]">
          <Icon name="trendup" size={12} color="currentColor" />
          Forecast Agosto 2026
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        {comparisonCount > 0 && (
          <Button variant="outline" size="sm" onClick={onToggleAllComparisons}>
            <Icon name={allComparisonsCollapsed ? 'chevron_down' : 'chevron_up'} size={12} color="#0047B0" />
            {allComparisonsCollapsed ? 'Expandir todo' : 'Contraer todo'}
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={onDownload}>
          <Icon name="download" size={12} color="#0047B0" /> Descargar
        </Button>
        <Button variant="outline" size="sm" onClick={onOpenCargaMasiva}>
          <Icon name="upload" size={12} color="#0047B0" /> Carga masiva
        </Button>
        <CompararButton count={comparisonCount} onClick={onOpenComparar} />
      </div>
    </div>
  )
}
