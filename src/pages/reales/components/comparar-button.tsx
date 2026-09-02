import { Badge } from '@/shared/ui'

interface CompararButtonProps {
  count: number
  onClick: () => void
}

export function CompararButton({ count, onClick }: CompararButtonProps) {
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
