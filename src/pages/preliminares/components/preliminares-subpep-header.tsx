import { Badge, Button, Icon } from '@/shared/ui'
import { PRELIM_MES_OPEN_LABEL } from '@/data/preliminares'

interface PreliminaresSubPepHeaderProps {
  servicio: string
  codigo: string
  onBack: () => void
}

export function PreliminaresSubPepHeader({ servicio, codigo, onBack }: PreliminaresSubPepHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 p-[10px_32px_18px]">
      <div>
        <div className="flex items-center gap-2.5">
          <span className="text-[20px] leading-tight font-bold tracking-tight text-primary">{servicio}</span>
          <Badge variant="primary">{codigo}</Badge>
        </div>
        <div className="mt-1.5 flex items-center gap-2 text-[13px] text-muted-foreground">
          <Icon name="check" size={13} color="#067647" /> SubPEPs · {PRELIM_MES_OPEN_LABEL}
        </div>
      </div>
      <Button variant="outline" size="sm" onClick={onBack}>
        <Icon name="chevron_left" size={12} color="currentColor" /> Volver a N7
      </Button>
    </div>
  )
}
