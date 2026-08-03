import { EmptyState } from '@/shared/ui'
import type { Servicio } from '@/data/services'
import { ServiceCard } from './service-card'

interface ServicesGridProps {
  items: Servicio[]
  selectedIds: Set<string>
  onToggleSelected: (id: string) => void
  onOpen: (s: Servicio) => void
}

export function ServicesGrid({ items, selectedIds, onToggleSelected, onOpen }: ServicesGridProps) {
  if (items.length === 0) {
    return (
      <div className="mx-8 mb-6">
        <EmptyState icon="search" title="Sin resultados" text="Ajustá los filtros o limpiá la búsqueda para ver más servicios." />
      </div>
    )
  }

  return (
    <div className="mx-8 mb-6 grid grid-cols-3 gap-4">
      {items.map((s) => (
        <ServiceCard
          key={s.id}
          s={s}
          selected={selectedIds.has(s.id)}
          onToggleSelected={onToggleSelected}
          onOpen={() => onOpen(s)}
        />
      ))}
    </div>
  )
}
