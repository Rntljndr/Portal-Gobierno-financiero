import { Icon, DesvioChip } from '@/shared/ui'
import { formatCompact } from '@/shared/lib/format'
import { realesN7Rows } from '@/data/reales'
import { totalesUSD } from '../../lib/recoe-data'

/** "¿Cómo proyectamos llegar?" — cierre proyectado del año (Real acumulado + Forecast de los meses
 * restantes) vs. Plan anual, en USD, fijo. */
export function EjecutivoComoProyectamosCard() {
  const t = totalesUSD(realesN7Rows)
  const favorable = t.desvio <= 0

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-white p-5">
      <div className="flex items-center gap-2 text-[13px] font-bold text-foreground">
        <Icon name="trendup" size={15} color="#0047B0" /> ¿Cómo proyectamos llegar?
      </div>

      <div>
        <div className="text-[9px] font-bold tracking-[0.06em] text-muted-foreground uppercase">
          Cierre proyectado del año (USD) · Real + Forecast
        </div>
        <div className="text-[26px] font-extrabold tracking-tight text-foreground">${formatCompact(t.realMasForecast)}</div>
      </div>
      <div className="text-[11.5px] text-muted-foreground">
        Plan anual: <b className="text-foreground">${formatCompact(t.plan)}</b>
      </div>

      <div className="flex items-center gap-2 border-t border-[#eef0f8] pt-2.5">
        <DesvioChip pct={t.pctDesvio} />
        <span className={`text-[12px] font-semibold ${favorable ? 'text-[#067647]' : 'text-[#B42318]'}`}>
          {favorable ? '(' : '+'}${formatCompact(Math.abs(t.desvio))}
          {favorable ? ')' : ''} {favorable ? 'bajo' : 'sobre'} plan al cierre
        </span>
      </div>
    </div>
  )
}
