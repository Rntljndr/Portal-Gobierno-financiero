import { useState } from 'react'
import { SegmentedTabs } from '@/shared/ui'
import { formatCompact } from '@/shared/lib/format'
import { rankingPaisesUSD } from '../../lib/recoe-data'

type Orden = 'monto' | 'pct'

/** Ranking de todos los países por desvío (acumulado a la fecha, USD) — cada país ve su posición. El
 * mejor desempeño y el mayor desvío quedan destacados. Orden configurable (monto o %), fijo en USD. */
export function EjecutivoRankingPaises() {
  const [orden, setOrden] = useState<Orden>('monto')
  const items = rankingPaisesUSD()
    .slice()
    .sort((a, b) => Math.abs(b.totals.desvioAcumMonto) - Math.abs(a.totals.desvioAcumMonto))
  if (orden === 'pct') {
    items.sort((a, b) => Math.abs(b.totals.desvioAcumPct ?? 0) - Math.abs(a.totals.desvioAcumPct ?? 0))
  }
  const maxAbs = Math.max(...items.map((it) => Math.abs(it.totals.desvioAcumMonto)), 1)
  const mejorPais = items.reduce((best, it) => (it.totals.desvioAcumMonto < best.totals.desvioAcumMonto ? it : best), items[0])
  const peorPais = items.reduce((worst, it) => (it.totals.desvioAcumMonto > worst.totals.desvioAcumMonto ? it : worst), items[0])

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-white">
      <div className="flex items-center justify-between border-b border-[#eef0f8] p-[14px_18px]">
        <div className="text-[13px] font-bold text-foreground">Ranking de países por desvío</div>
        <SegmentedTabs
          value={orden}
          onChange={setOrden}
          options={[
            { value: 'monto', label: 'Por monto' },
            { value: 'pct', label: 'Por %' },
          ]}
        />
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto">
        {items.map((it, i) => {
          const favorable = it.totals.desvioAcumMonto <= 0
          const barPct = Math.round((Math.abs(it.totals.desvioAcumMonto) / maxAbs) * 100)
          const destacado = it.pais === mejorPais.pais ? 'mejor' : it.pais === peorPais.pais ? 'peor' : null
          return (
            <div key={it.pais} className="flex items-center gap-3 border-t border-[#F1F3F8] p-[10px_18px] first:border-t-0">
              <span className="w-5 text-[11px] font-bold text-muted-foreground">{i + 1}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 text-[12.5px] font-semibold text-foreground">
                  {it.pais}
                  {destacado === 'mejor' && (
                    <span className="rounded-full bg-[#ECFDF3] px-1.5 py-[1px] text-[9.5px] font-bold text-[#067647]">Mejor desempeño</span>
                  )}
                  {destacado === 'peor' && (
                    <span className="rounded-full bg-[#FEE8E8] px-1.5 py-[1px] text-[9.5px] font-bold text-[#B42318]">Mayor desvío</span>
                  )}
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#EEF1FB]">
                  <div className={`h-full rounded-full ${favorable ? 'bg-[#067647]' : 'bg-[#B42318]'}`} style={{ width: `${barPct}%` }} />
                </div>
              </div>
              <div className="w-[90px] shrink-0 text-right text-[12px] font-bold tabular-nums">
                <span className={favorable ? 'text-[#067647]' : 'text-[#B42318]'}>
                  {favorable ? '(' : '+'}${formatCompact(Math.abs(it.totals.desvioAcumMonto))}
                  {favorable ? ')' : ''}
                </span>
              </div>
              <div className="w-[60px] shrink-0 text-right text-[11.5px] font-semibold text-muted-foreground">
                {it.totals.desvioAcumPct === null ? '—' : `${it.totals.desvioAcumPct.toFixed(1)}%`}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
