import type { ReactNode } from 'react'
import { DesvioChip } from '@/shared/ui'
import { GIT_CORTE_LABEL } from '@/data/gasto-it-v2'
import { fmtPct, fmtUSD, type PesoVenta, type Totales } from '../lib'

function Tile({ label, value, children }: { label: string; value: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 rounded-xl border border-border bg-white p-[16px_18px]">
      <div className="text-[10px] leading-snug font-bold tracking-[0.08em] text-muted-foreground uppercase">{label}</div>
      <div className="text-[24px] font-extrabold tracking-tight text-foreground">{value}</div>
      <div className="flex flex-wrap items-center gap-1.5 text-[12px] text-muted-foreground">{children}</div>
    </div>
  )
}

interface KpiRowProps {
  t: Totales
  /** Si viene, la cuarta tarjeta muestra el peso del gasto IT sobre la venta; si no, la variación vs. año anterior. */
  peso?: PesoVenta
}

/** Cuatro cifras que un ejecutivo necesita para opinar: lo ejecutado, el cierre esperado, el desvío y el contexto. */
export function KpiRow({ t, peso }: KpiRowProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Tile label={`Real acumulado a ${GIT_CORTE_LABEL}`} value={fmtUSD(t.realAcum)}>
        <DesvioChip pct={t.desvAcumPct} />
        <span>vs. plan a la fecha ({fmtUSD(t.planAcum)})</span>
      </Tile>

      <Tile label="Proyección de cierre" value={fmtUSD(t.proyeccion)}>
        <span>Real + forecast · Plan anual {fmtUSD(t.planAnual)}</span>
      </Tile>

      <Tile label="Desvío proyectado al cierre" value={fmtUSD(t.desvProy, true)}>
        <DesvioChip pct={t.desvProyPct} />
        <span>{t.desvProy > 0 ? 'gasto adicional al plan' : 'saldo disponible del plan'}</span>
      </Tile>

      {peso ? (
        <Tile label="Gasto IT sobre la venta" value={fmtPct(peso.realAcumPct, false, 2)}>
          <DesvioChip pct={peso.planPct > 0 ? ((peso.realAcumPct - peso.planPct) / peso.planPct) * 100 : null} />
          <span>vs. plan ({fmtPct(peso.planPct, false, 2)})</span>
        </Tile>
      ) : (
        <Tile label="Vs. año anterior (mismo período)" value={fmtPct(t.yoyPct, true)}>
          <span>Real {fmtUSD(t.realAcum)} vs. {fmtUSD(t.anioAnteriorAcum)}</span>
        </Tile>
      )}
    </div>
  )
}
