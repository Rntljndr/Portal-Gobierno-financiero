import { Badge } from '@/shared/ui'

interface ForecastCompararButtonProps {
  count: number
  onClick: () => void
}

/** Botón "Comparar" (mismo patrón que CompararButton de Reales, ver
 * reales/components/comparar-button.tsx) — al lado de "Descargar" en el header de la tabla. */
export function ForecastCompararButton({ count, onClick }: ForecastCompararButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-lg border-[1.5px] border-border-strong bg-white px-3 py-[7px] text-xs font-semibold text-foreground hover:bg-[#F4F7FE] data-[active=true]:border-primary"
      data-active={count > 0}
    >
      Comparar
      {count > 0 && (
        <Badge variant="warning" className="h-4 min-w-4 justify-center px-1 py-0 text-[10px]">
          {count}
        </Badge>
      )}
    </button>
  )
}
