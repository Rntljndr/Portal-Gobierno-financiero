import { Button } from '@/shared/ui'

interface AplicarFiltrosBarProps {
  pending: boolean
  onClear: () => void
  onApply: () => void
}

export function AplicarFiltrosBar({ pending, onClear, onApply }: AplicarFiltrosBarProps) {
  return (
    <div className="flex items-center justify-end gap-2 p-[2px_18px_12px]">
      <button type="button" onClick={onClear} className="text-[12.5px] font-semibold text-primary hover:underline">
        Limpiar filtros
      </button>
      <Button variant="primary" size="sm" onClick={onApply} className="relative">
        Aplicar filtros
        {pending && <span className="absolute -top-1 -right-1 block size-2 rounded-full border-[1.5px] border-white bg-destructive" />}
      </Button>
    </div>
  )
}
