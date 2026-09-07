import { Spinner } from '@/shared/ui'

interface RealesInfiniteFooterProps {
  visibleCount: number
  total: number
  itemLabel: string
  hasMore: boolean
  loadingMore: boolean
  sentinelRef: React.RefObject<HTMLDivElement | null>
}

/** Ajuste R3: reemplaza la Pagination por scroll infinito — mismo texto/estilo de resumen, pero cargando bloques al acercarse al final. */
export function RealesInfiniteFooter({ visibleCount, total, itemLabel, hasMore, loadingMore, sentinelRef }: RealesInfiniteFooterProps) {
  return (
    <div className="px-8 pb-6">
      <div className="flex items-center justify-between text-[12.5px] text-muted-foreground">
        <span>{total === 0 ? `Sin ${itemLabel} para mostrar` : `Mostrando 1–${visibleCount} de ${total} ${itemLabel}`}</span>
        {loadingMore && (
          <span className="flex items-center gap-2">
            <Spinner size={4} /> Cargando más...
          </span>
        )}
      </div>
      {hasMore && <div ref={sentinelRef} className="h-1" />}
    </div>
  )
}
