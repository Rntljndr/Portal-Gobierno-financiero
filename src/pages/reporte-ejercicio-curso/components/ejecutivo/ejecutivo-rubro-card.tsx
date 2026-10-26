import { Icon, DesvioChip } from '@/shared/ui'
import { formatCompact } from '@/shared/lib/format'
import type { RubroResumenItem } from '../../lib/recoe-data'

/** Recuadro de un solo rubro (CAPEX, OPEX) — se muestran aparte de "¿Cómo vamos por rubro?" en vez de
 * como una fila más de esa tabla, mismo lenguaje visual que `EjecutivoComoVamosCard`. */
export function EjecutivoRubroCard({ item }: { item: RubroResumenItem }) {
  const favorable = item.totals.desvioAcumMonto <= 0

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-white p-5">
      <div className="flex items-center gap-2 text-[13px] font-bold text-foreground">
        <Icon name="chart" size={15} color="#0047B0" /> {item.rubro}
      </div>

      <div>
        <div className="text-[9px] font-bold tracking-[0.06em] text-muted-foreground uppercase">Real acumulado (USD)</div>
        <div className="text-[22px] font-extrabold tracking-tight text-foreground">${formatCompact(item.totals.real)}</div>
      </div>
      <div className="text-[11.5px] text-muted-foreground">
        Plan acumulado a la fecha: <b className="text-foreground">${formatCompact(item.totals.planAcum)}</b>
      </div>

      <div className="flex items-center gap-2 border-t border-[#eef0f8] pt-2.5">
        <DesvioChip pct={item.totals.desvioAcumPct} />
        <span className={`text-[12px] font-semibold ${favorable ? 'text-[#067647]' : 'text-[#B42318]'}`}>
          {favorable ? '(' : '+'}${formatCompact(Math.abs(item.totals.desvioAcumMonto))}
          {favorable ? ')' : ''} {favorable ? 'bajo' : 'sobre'} plan
        </span>
      </div>
    </div>
  )
}
