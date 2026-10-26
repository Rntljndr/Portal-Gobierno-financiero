import { Icon, DesvioChip } from '@/shared/ui'
import { formatCompact } from '@/shared/lib/format'
import { realesN7Rows, REALES_ULTIMO_REAL_LABEL } from '@/data/reales'
import { totalesUSD } from '../../lib/recoe-data'

/** "¿Cómo vamos?" — Real acumulado al último mes cerrado vs. Plan acumulado a la misma fecha, en USD,
 * fijo (no afectado por los filtros del detalle). */
export function EjecutivoComoVamosCard() {
  const t = totalesUSD(realesN7Rows)
  const favorable = t.desvioAcumMonto <= 0
  const pctCumplimiento = t.planAcum > 0 ? (t.real / t.planAcum) * 100 : null

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-white p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[13px] font-bold text-foreground">
          <Icon name="circle_check" size={15} color="#0047B0" /> ¿Cómo vamos?
        </div>
        <span className="text-[10.5px] font-semibold text-muted-foreground">Corte: {REALES_ULTIMO_REAL_LABEL}</span>
      </div>

      <div>
        <div className="text-[9px] font-bold tracking-[0.06em] text-muted-foreground uppercase">Real acumulado (USD)</div>
        <div className="text-[26px] font-extrabold tracking-tight text-foreground">${formatCompact(t.real)}</div>
      </div>
      <div className="text-[11.5px] text-muted-foreground">
        Plan acumulado a la fecha: <b className="text-foreground">${formatCompact(t.planAcum)}</b>
        {pctCumplimiento !== null && (
          <>
            {' '}
            — <b className={favorable ? 'text-[#067647]' : 'text-[#B42318]'}>{pctCumplimiento.toFixed(1)}% de cumplimiento</b>
          </>
        )}
      </div>

      <div className="flex items-center gap-2 border-t border-[#eef0f8] pt-2.5">
        <DesvioChip pct={t.desvioAcumPct} />
        <span className={`text-[12px] font-semibold ${favorable ? 'text-[#067647]' : 'text-[#B42318]'}`}>
          {favorable ? '(' : '+'}${formatCompact(Math.abs(t.desvioAcumMonto))}
          {favorable ? ')' : ''} {favorable ? 'bajo' : 'sobre'} plan
        </span>
      </div>
    </div>
  )
}
