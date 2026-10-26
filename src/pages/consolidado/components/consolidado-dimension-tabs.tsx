import { DimensionTabs } from '@/shared/ui'
import { DIMENSIONES, type DimensionKey } from '../lib/dimensiones'

interface ConsolidadoDimensionTabsProps {
  dim: DimensionKey
  onChangeDim: (dim: DimensionKey) => void
  showExpandAll: boolean
  allExpanded: boolean
  onExpandAll: () => void
}

export function ConsolidadoDimensionTabs({ dim, onChangeDim, showExpandAll, allExpanded, onExpandAll }: ConsolidadoDimensionTabsProps) {
  return (
    <DimensionTabs
      value={dim}
      onChange={onChangeDim}
      options={DIMENSIONES.map((d) => ({ value: d.key, label: d.label }))}
      extra={
        showExpandAll && (
          <button type="button" onClick={onExpandAll} className="text-xs font-bold text-primary hover:underline">
            {allExpanded ? 'Contraer todo' : 'Expandir todo'}
          </button>
        )
      }
    />
  )
}
