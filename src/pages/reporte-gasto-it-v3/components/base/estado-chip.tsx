import { Badge } from '@/shared/ui'
import { estadoSigno, ESTADO_META, fmtPct } from '../../lib'

/** % con signo + ícono + color por signo: + rojo, − verde, 0 gris (el color nunca va solo). */
export function EstadoChip({ pct, conLabel = false }: { pct: number; conLabel?: boolean }) {
  const m = ESTADO_META[estadoSigno(pct)]
  return (
    <Badge variant={m.badge} className="tabular-nums">
      <span aria-hidden className="text-xxs">
        {m.simbolo}
      </span>
      {fmtPct(pct, true)}
      {conLabel && <span className="font-normal">· {m.label}</span>}
    </Badge>
  )
}

/** Texto de monto/porcentaje coloreado por el signo de `pct`, con su símbolo. */
export function EstadoTexto({ pct, children }: { pct: number; children: React.ReactNode }) {
  const m = ESTADO_META[estadoSigno(pct)]
  return (
    <span className={`font-bold tabular-nums ${m.texto}`}>
      <span aria-hidden className="mr-1 text-xxs">
        {m.simbolo}
      </span>
      {children}
    </span>
  )
}
