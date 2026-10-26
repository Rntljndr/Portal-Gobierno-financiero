import { DesvioChip } from '@/shared/ui'
import { formatCompact } from '@/shared/lib/format'
import { resumenPorRubroUSD } from '../../lib/recoe-data'

const th = 'p-[8px_10px] text-left text-[10.5px] font-bold tracking-[0.05em] text-muted-foreground uppercase'
const thRight = `${th} text-right`
const td = 'p-[8px_10px] text-[12.5px] text-foreground'
const tdRight = `${td} text-right tabular-nums`

/** "¿Cómo vamos por rubro?" — Plan/Real/desvío en USD por cada rubro (Amortizaciones, Nómina,
 * Servicios, Licencias), fijo, consolidado en todos los países. CAPEX y OPEX se muestran aparte, en sus
 * propios recuadros (`EjecutivoRubroCard`), no como filas de esta tabla. */
export function EjecutivoPorRubroTable() {
  const filas = resumenPorRubroUSD().filter((f) => f.rubro !== 'CAPEX' && f.rubro !== 'OPEX')

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white">
      <div className="border-b border-[#eef0f8] p-[14px_18px] text-[13px] font-bold text-foreground">¿Cómo vamos por rubro?</div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#FAFBFE]">
            <th className={th}>Rubro</th>
            <th className={thRight}>Plan</th>
            <th className={thRight}>Real</th>
            <th className={thRight}>Desvío $</th>
            <th className={thRight}>Desvío %</th>
          </tr>
        </thead>
        <tbody>
          {filas.map((f) => (
            <tr key={f.rubro} className="border-t border-[#F1F3F8]">
              <td className={td}>{f.rubro}</td>
              <td className={tdRight}>${formatCompact(f.totals.planAcum)}</td>
              <td className={tdRight}>${formatCompact(f.totals.real)}</td>
              <td className={tdRight}>
                {f.totals.desvioAcumMonto <= 0 ? '(' : '+'}${formatCompact(Math.abs(f.totals.desvioAcumMonto))}
                {f.totals.desvioAcumMonto <= 0 ? ')' : ''}
              </td>
              <td className={tdRight}>
                <DesvioChip pct={f.totals.desvioAcumPct} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="p-[8px_18px] text-[10.5px] text-muted-foreground">Plan y Real acumulados al último mes cerrado, en USD.</p>
    </div>
  )
}
