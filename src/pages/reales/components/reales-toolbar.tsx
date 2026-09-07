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
  onOpenCargaMasiva?: () => void
  allComparisonsCollapsed?: boolean
  onToggleAllComparisons?: () => void
  activeForecastLabel?: string | null
  showFiltros?: boolean
}

export function RealesToolbar({
  filtersOpen,
  onToggleFilters,
  activeFilterCount,
  comparisonCount,
  onOpenComparar,
  onDownload,
  onOpenColumnas,
  onOpenCargaMasiva,
  allComparisonsCollapsed = false,
  onToggleAllComparisons,
  activeForecastLabel,
  showFiltros = true,
}: RealesToolbarProps) {
  return (
    <div className="mx-8 mb-3 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        {showFiltros && <RealesFilterToggle open={filtersOpen} onToggle={onToggleFilters} activeCount={activeFilterCount} />}
        {showFiltros && activeForecastLabel && (
          <Badge variant="neutral" className="border border-[#DDD0F8] bg-[#F3EEFF] text-[#6922E7]">
            <Icon name="trendup" size={12} color="currentColor" />
            {activeForecastLabel}
          </Badge>
        )}
      </div>
      <div className="flex items-center gap-2">
        {comparisonCount > 0 && onToggleAllComparisons && (
          <Button variant="outline" size="sm" onClick={onToggleAllComparisons}>
            <Icon name={allComparisonsCollapsed ? 'chevron_down' : 'chevron_up'} size={12} color="#0047B0" />
            {allComparisonsCollapsed ? 'Expandir todo' : 'Contraer todo'}
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={onOpenColumnas}>
          <Icon name="eye" size={12} color="#0047B0" /> Columnas
        </Button>
        <Button variant="outline" size="sm" onClick={onDownload}>
          <Icon name="download" size={12} color="#0047B0" /> Descargar
        </Button>
        {onOpenCargaMasiva && (
          <Button variant="outline" size="sm" onClick={onOpenCargaMasiva}>
            <Icon name="upload" size={12} color="#0047B0" /> Carga masiva
          </Button>
        )}
        <CompararButton count={comparisonCount} onClick={onOpenComparar} />
      </div>
    </div>
  )
}
