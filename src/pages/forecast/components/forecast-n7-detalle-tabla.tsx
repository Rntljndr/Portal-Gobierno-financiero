import { Button } from '@/shared/ui'
import { monthKeys, monthLabels } from '@/data/reporteria'
import type { ForecastN7Linea } from '@/data/forecast-lineas'
import { formatForecastAmount } from '../lib/format-forecast-amount'

const th = 'p-[10px_14px] text-left text-[11px] font-bold tracking-[0.04em] text-muted-foreground uppercase border-b-2 border-border'
const td = 'p-[10px_14px] text-[13px] text-cs-gris-oscuro border-b border-[#F0F4FA]'

interface ForecastN7DetalleTablaProps {
  n7: ForecastN7Linea
  plan: Record<string, number>
  cutoff: number
  draft: Record<string, string>
  onChangeMes: (monthKey: string, value: string) => void
  onMesConjunto: () => void
}

/** Tabla de Forecast (F): un mes por fila, Presupuesto (Plan) y Real/Forecast — los meses ya cerrados
 * (< cutoff) muestran el Real como texto fijo, los meses restantes del año son inputs editables, todos
 * juntos en esta pantalla (a diferencia de ForecastEditDrawer, que edita un mes a la vez). "Mes
 * Conjunto" copia el valor del primer mes editable al resto, para cargar rápido un monto parejo. */
export function ForecastN7DetalleTabla({ n7, plan, cutoff, draft, onChangeMes, onMesConjunto }: ForecastN7DetalleTablaProps) {
  const planTotal = monthKeys.reduce((s, k) => s + (plan[k] || 0), 0)
  const realForecastTotal = monthKeys.reduce((s, k, i) => s + (i < cutoff ? n7.meses[k] || 0 : Number(draft[k]) || 0), 0)

  return (
    <div className="mx-8 mb-5 rounded-xl border border-border bg-white p-[20px]">
      <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
        <span className="text-[15px] font-bold text-primary">Tabla de Forecast</span>
        <Button variant="outline" size="sm" onClick={onMesConjunto}>
          Mes Conjunto
        </Button>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className={th}>Mes</th>
            <th className={th}>Presupuesto</th>
            <th className={th}>Real/Forecast</th>
          </tr>
        </thead>
        <tbody>
          {monthKeys.map((k, i) => {
            const closed = i < cutoff
            return (
              <tr key={k}>
                <td className={td}>{monthLabels[i]}</td>
                <td className={td}>{formatForecastAmount(plan[k] || 0)}</td>
                <td className={td}>
                  {closed ? (
                    formatForecastAmount(n7.meses[k] || 0)
                  ) : (
                    <input
                      type="number"
                      step="0.01"
                      value={draft[k] ?? ''}
                      onChange={(e) => onChangeMes(k, e.target.value)}
                      className="w-[140px] rounded-lg border border-border px-3 py-1.5 text-[13px] outline-none focus:border-primary"
                    />
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          <tr className="font-bold">
            <td className="p-[10px_14px] text-[13px] text-foreground">TOTAL</td>
            <td className="p-[10px_14px] text-[13px] text-foreground">{formatForecastAmount(planTotal)}</td>
            <td className="p-[10px_14px] text-[13px] text-foreground">{formatForecastAmount(realForecastTotal)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
