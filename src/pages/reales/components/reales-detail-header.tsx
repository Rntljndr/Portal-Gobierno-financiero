import { Badge, Icon } from '@/shared/ui'
import { REALES_ULTIMO_REAL_LABEL } from '@/data/reales'

interface RealesDetailHeaderProps {
  title: string
  codigo: string
  /** F (al entrar a un N4): "eliminar el tag con el código de servicio que tiene actualmente" — default
   * true para no afectar otras pantallas que reusan este header (p. ej. RealesSubPepPage). */
  showCodigoBadge?: boolean
  /** F (al entrar a un N4): "el tag de forecast activo debe estar al lado derecho del título" — antes
   * vivía en RealesTopActions, debajo de esta cabecera. */
  activeForecastLabel?: string | null
}

export function RealesDetailHeader({ title, codigo, showCodigoBadge = true, activeForecastLabel }: RealesDetailHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 p-[10px_32px_18px]">
      <div>
        <div className="flex items-center gap-2.5">
          <span className="text-[20px] leading-tight font-bold tracking-tight text-primary">{title}</span>
          {showCodigoBadge && <Badge variant="primary">{codigo}</Badge>}
        </div>
        <div className="mt-1.5 flex items-center gap-2 text-[13px] text-muted-foreground">
          <Icon name="check" size={13} color="#067647" />
          <span>
            Detalle · Solo lectura · Último real: <strong className="text-foreground">{REALES_ULTIMO_REAL_LABEL}</strong>
          </span>
        </div>
      </div>
      {activeForecastLabel && (
        <Badge variant="neutral" className="border border-[#DDD0F8] bg-[#F3EEFF] text-[#6922E7]">
          <Icon name="trendup" size={12} color="currentColor" />
          {activeForecastLabel}
        </Badge>
      )}
    </div>
  )
}
