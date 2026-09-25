import { cn } from '@/shared/lib/utils'
import { monthKeys, monthLabels } from '@/data/reporteria'
import type { ForecastN7Linea } from '@/data/forecast-lineas'
import { formatForecastAmount } from '../lib/format-forecast-amount'

const th = 'p-[10px_14px] text-left text-[10.5px] font-bold tracking-[0.04em] text-muted-foreground uppercase bg-[#F4F6FB] border-b-2 border-border'
const td = 'p-[10px_14px] text-[13px] border-b border-[#F0F4FA]'

interface ForecastN7DetalleTablaProps {
  n7: ForecastN7Linea
  plan: Record<string, number>
  cutoff: number
  draft: Record<string, string>
  onChangeMes: (monthKey: string, value: string) => void
}

/** Tabla de Forecast (F, copiada de GestionOpex QA — ForecastN7Historico "Editar"/PEP): un mes por
 * fila, Presupuesto (Plan) y Real/Forecast. Los meses ya cerrados muestran el Real como texto fijo;
 * los meses restantes del año son inputs editables — el valor se guarda en `draft` (estado local de
 * la página) hasta que se presiona "Guardar", no celda a celda. */
export function ForecastN7DetalleTabla({ n7, plan, cutoff, draft, onChangeMes }: ForecastN7DetalleTablaProps) {
  const planTotal = monthKeys.reduce((s, k) => s + (plan[k] || 0), 0)
  const realForecastTotal = monthKeys.reduce((s, k, i) => s + (i < cutoff ? n7.meses[k] || 0 : Number(draft[k]) || 0), 0)

  return (
    <div className="mx-8 mb-3 overflow-hidden rounded-xl border border-border bg-white shadow-[0_1px_4px_rgba(0,20,60,0.06)]">
      <div className="border-b border-border p-[16px_20px] text-[15px] font-bold text-primary">Tabla de Forecast</div>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className={th}>Mes</th>
            <th className={cn(th, 'text-right')}>Presupuesto</th>
            <th className={cn(th, 'text-right')}>Real/Forecast</th>
          </tr>
        </thead>
        <tbody>
          {monthKeys.map((k, i) => {
            const closed = i < cutoff
            return (
              <tr key={k} className={cn(!closed && 'bg-primary/[0.02]')}>
                <td className={cn(td, 'font-semibold text-foreground')}>
                  {monthLabels[i]}
                  <span className="ml-2 text-[10px] font-semibold text-muted-foreground">{closed ? 'Real' : 'FC'}</span>
                </td>
                <td className={cn(td, 'text-right tabular-nums text-cs-gris-oscuro')}>{formatForecastAmount(plan[k] || 0)}</td>
                <td className={cn(td, 'text-right')}>
                  {closed ? (
                    <span className="tabular-nums font-semibold text-primary">{formatForecastAmount(n7.meses[k] || 0)}</span>
                  ) : (
                    <input
                      type="number"
                      step="0.01"
                      value={draft[k] ?? ''}
                      onChange={(e) => onChangeMes(k, e.target.value)}
                      className="w-[140px] rounded-lg border border-border px-3 py-1.5 text-right text-[13px] outline-none focus:border-primary"
                    />
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          <tr className="bg-[#FAFBFE] font-bold">
            <td className="p-[10px_14px] text-[13px] text-foreground">TOTAL</td>
            <td className="p-[10px_14px] text-right text-[13px] tabular-nums text-foreground">{formatForecastAmount(planTotal)}</td>
            <td className="p-[10px_14px] text-right text-[13px] tabular-nums text-primary">{formatForecastAmount(realForecastTotal)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
