import { fmtPct, fmtUSD, negocioLabel, pesoPorNegocio, type PesoVenta } from '../lib'

interface PesoVentaCardProps {
  negocio: string
  peso: PesoVenta
}

/** Peso del gasto IT sobre la venta del negocio, comparado con los demás negocios de Cencosud. */
export function PesoVentaCard({ negocio, peso }: PesoVentaCardProps) {
  const ranking = pesoPorNegocio().sort((a, b) => b.peso.realAcumPct - a.peso.realAcumPct)
  const max = Math.max(...ranking.map((r) => Math.max(r.peso.realAcumPct, r.peso.planPct))) * 1.08
  const posicion = ranking.findIndex((r) => r.key === negocio) + 1
  const promedio = ranking.reduce((s, r) => s + r.peso.realAcumPct, 0) / ranking.length

  return (
    <section className="flex h-full flex-col rounded-xl border border-border bg-white p-[14px_18px]">
      <div className="text-[14px] font-bold text-foreground">Peso del gasto IT sobre la venta</div>
      <div className="mb-3 text-[12px] text-muted-foreground">
        {negocioLabel(negocio)} destina <b className="text-foreground">{fmtPct(peso.realAcumPct, false, 2)}</b> de su venta a IT (venta acumulada{' '}
        {fmtUSD(peso.ventaRealAcum)}). Es el <b className="text-foreground">#{posicion}</b> de {ranking.length} negocios; promedio Cencosud{' '}
        {fmtPct(promedio, false, 2)}.
      </div>

      <div className="flex flex-col gap-1">
        {ranking.map((r) => {
          const sel = r.key === negocio
          return (
            <div
              key={r.key}
              className={`grid grid-cols-[120px_1fr_56px] items-center gap-2 rounded-[4px] px-1.5 py-[3px] ${sel ? 'bg-primary/8' : ''}`}
              title={`${r.label}: real ${fmtPct(r.peso.realAcumPct, false, 2)} · plan ${fmtPct(r.peso.planPct, false, 2)}`}
            >
              <span className={`truncate text-[11.5px] ${sel ? 'font-bold text-primary' : 'text-cs-gris-oscuro'}`}>{r.label}</span>
              <div className="relative h-3">
                <div className="absolute inset-y-0 left-0 rounded-[4px]" style={{ width: `${(r.peso.realAcumPct / max) * 100}%`, background: sel ? '#0047B0' : '#B6CCF7' }} />
                <div className="absolute -top-0.5 -bottom-0.5 w-0.5 rounded-full bg-cs-negro" style={{ left: `${(r.peso.planPct / max) * 100}%` }} />
              </div>
              <span className={`text-right text-[11.5px] tabular-nums ${sel ? 'font-bold text-foreground' : 'text-muted-foreground'}`}>
                {fmtPct(r.peso.realAcumPct, false, 2)}
              </span>
            </div>
          )
        })}
      </div>

      <div className="mt-3 flex items-center gap-4 border-t border-border-table pt-2 text-[11px] text-cs-gris-oscuro">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-4 rounded-[3px] bg-primary" /> Real acumulado
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-0.5 rounded-full bg-cs-negro" /> Plan
        </span>
      </div>
    </section>
  )
}
