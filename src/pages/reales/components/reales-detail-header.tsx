import { Badge, Icon } from '@/shared/ui'
import { REALES_ULTIMO_REAL_LABEL } from '@/data/reales'

interface RealesDetailHeaderProps {
  title: string
  codigo: string
}

export function RealesDetailHeader({ title, codigo }: RealesDetailHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 p-[10px_32px_18px]">
      <div>
        <div className="flex items-center gap-2.5">
          <span className="text-[20px] leading-tight font-bold tracking-tight text-primary">{title}</span>
          <Badge variant="primary">{codigo}</Badge>
        </div>
        <div className="mt-1.5 flex items-center gap-2 text-[13px] text-muted-foreground">
          <Icon name="check" size={13} color="#067647" />
          <span>
            Detalle · Solo lectura · Último real: <strong className="text-foreground">{REALES_ULTIMO_REAL_LABEL}</strong>
          </span>
        </div>
      </div>
    </div>
  )
}
