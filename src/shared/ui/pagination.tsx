import { cn } from '@/shared/lib/utils'

interface PaginationProps {
  page: number
  totalPages: number
  totalItems: number
  pageSize: number
  onPageChange: (page: number) => void
  itemLabel?: string
}

export function Pagination({ page, totalPages, totalItems, pageSize, onPageChange, itemLabel = 'elementos' }: PaginationProps) {
  const start = (page - 1) * pageSize

  const pages: (number | '...')[] = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1, 2, 3)
    if (page > 4) pages.push('...')
    if (page > 3 && page < totalPages - 2) pages.push(page)
    if (page < totalPages - 3) pages.push('...')
    pages.push(totalPages - 2, totalPages - 1, totalPages)
  }
  const uniquePages = pages.filter((p, i) => pages.indexOf(p) === i && (p === '...' || (p >= 1 && p <= totalPages)))

  return (
    <div className="flex items-center justify-between px-8 pb-6 text-[12.5px] text-muted-foreground">
      <span>
        {totalItems === 0
          ? `Sin ${itemLabel} para mostrar`
          : `Mostrando ${start + 1}–${Math.min(start + pageSize, totalItems)} de ${totalItems} ${itemLabel}`}
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-lg border border-border-table bg-white px-3.5 py-[7px] text-xs font-semibold text-primary disabled:cursor-not-allowed disabled:text-muted-foreground"
        >
          Anterior
        </button>
        {uniquePages.map((n, i) =>
          n === '...' ? (
            <span key={`e${i}`} className="px-2 text-xs text-muted-foreground">
              …
            </span>
          ) : (
            <button
              key={n}
              type="button"
              onClick={() => onPageChange(n)}
              className={cn(
                'rounded-lg border border-border-table bg-white px-3.5 py-[7px] text-xs font-semibold text-muted-foreground hover:border-primary hover:text-primary',
                n === page && 'border-primary bg-primary text-white hover:text-white',
              )}
            >
              {n}
            </button>
          ),
        )}
        <button
          type="button"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-lg border border-border-table bg-white px-3.5 py-[7px] text-xs font-semibold text-primary disabled:cursor-not-allowed disabled:text-muted-foreground"
        >
          Siguiente
        </button>
      </div>
    </div>
  )
}
