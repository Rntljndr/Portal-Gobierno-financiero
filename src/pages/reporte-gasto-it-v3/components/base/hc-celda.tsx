import type { V3Linea } from '@/data/gasto-it-v3'
import { fmtHc, headcount } from '../../lib'

/** Headcount de un grupo en una celda: real vs plan arriba; forecast y año anterior debajo. */
export function HcCelda({ lineas }: { lineas: V3Linea[] }) {
  const hc = headcount(lineas)
  if (!hc.aplica) return <span className="text-muted-foreground">—</span>
  return (
    <div className="flex flex-col items-end gap-0.5 whitespace-nowrap">
      <span>
        <span className="font-bold text-foreground">{fmtHc(hc.real)}</span>
        <span className="text-muted-foreground"> / {fmtHc(hc.plan)} plan</span>
      </span>
      <span className="text-xs text-muted-foreground">
        Fcst {fmtHc(hc.forecast)} · Año ant. {fmtHc(hc.ant)}
      </span>
    </div>
  )
}

export const HC_TITULO = 'Headcount: real / plan al último mes cerrado · forecast a diciembre · año anterior'
