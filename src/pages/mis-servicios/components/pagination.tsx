import { cn } from '@/shared/lib/utils'

interface PaginationProps {
  page: number
  totalPages: number
  totalItems: number
  pageSize: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, totalPages, totalItems, pageSize, onPageChange }: PaginationProps) {
  const start = (page - 1) * pageSize
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className="flex items-center justify-between px-8 pb-6 text-[12.5px] text-muted-foreground">
      <span>
        {totalItems === 0
          ? 'Sin servicios para mostrar'
          : `Mostrando ${start + 1}–${Math.min(start + pageSize, totalItems)} de ${totalItems} servicios`}
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-[7px] border border-[#E2E5EE] bg-white px-3.5 py-[7px] text-xs font-semibold text-primary disabled:cursor-not-allowed disabled:text-muted-foreground"
        >
          Anterior
        </button>
        {pages.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onPageChange(n)}
            className={cn(
              'rounded-[7px] border border-[#E2E5EE] bg-white px-3.5 py-[7px] text-xs font-semibold text-muted-foreground hover:border-primary hover:text-primary',
              n === page && 'border-primary bg-primary text-white hover:text-white',
            )}
          >
            {n}
          </button>
        ))}
        <button
          type="button"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-[7px] border border-[#E2E5EE] bg-white px-3.5 py-[7px] text-xs font-semibold text-primary disabled:cursor-not-allowed disabled:text-muted-foreground"
        >
          Siguiente
        </button>
      </div>
    </div>
  )
}
