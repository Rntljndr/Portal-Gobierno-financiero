import { Badge, Icon } from '@/shared/ui'

interface PreliminaresSubPepHeaderProps {
  servicio: string
  codigo: string
  mesAbierto: string
}

export function PreliminaresSubPepHeader({ servicio, codigo, mesAbierto }: PreliminaresSubPepHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 p-[10px_32px_18px]">
      <div>
        <div className="flex items-center gap-2.5">
          <span className="text-[20px] leading-tight font-bold tracking-tight text-primary">N7 — {servicio}</span>
          <Badge variant="primary">{codigo}</Badge>
        </div>
        <div className="mt-1.5 flex items-center gap-2 text-[13px] text-muted-foreground">
          <Icon name="check" size={13} color="#067647" /> SubPEPs · {mesAbierto}
        </div>
      </div>
    </div>
  )
}
