import { Icon } from '@/shared/ui'
import type { Pais } from '@/data/services'
import type { ForecastN4Linea } from '@/data/forecast-lineas'
import { CountryDistributionBar } from '@/pages/servicio-detalle/components/country-distribution-bar'
import { calcN4Totals } from '../lib/forecast-edit-calc'
import { buildForecastN4PaisSegments } from '../lib/forecast-n4-resumen'
import { formatForecastAmount } from '../lib/format-forecast-amount'

function Metric({ label, value, tone }: { label: string; value: string; tone?: 'up' | 'down' }) {
  const color = tone === 'up' ? 'text-[#B42318]' : tone === 'down' ? 'text-[#067647]' : 'text-foreground'
  return (
    <div className="min-w-[110px]">
      <div className="mb-1 text-[10px] font-bold tracking-[0.06em] text-muted-foreground uppercase">{label}</div>
      <div className={`flex items-center gap-1 text-xl font-bold ${color}`}>
        {tone && <Icon name="trendup" size={18} color={tone === 'up' ? '#B42318' : '#067647'} />}
        {value}
      </div>
    </div>
  )
}

interface ForecastN4ResumenCardProps {
  n4: ForecastN4Linea
  cutoff: number
}

/** F: "agregar este recuadro en donde muestra el resumen, esto está en presupuesto... los campos a
 * comparar son Plan y Forecast" — mismo diseño y estructura que BudgetSummary
 * (servicio-detalle/components/budget-summary.tsx): Plan/Forecast anual del N4 + variación $/% + la
 * misma barra de distribución por país (CountryDistributionBar, reusada tal cual, sin acoplamiento a
 * servicio-detalle — igual criterio que ForecastN4InfoCard con DataField). */
export function ForecastN4ResumenCard({ n4, cutoff }: ForecastN4ResumenCardProps) {
  const totals = calcN4Totals(n4, cutoff)
  const variacion = totals.realMasForecast - totals.plan
  const varPct = totals.plan ? (variacion / totals.plan) * 100 : 0
  const tone = variacion === 0 ? undefined : variacion > 0 ? 'up' : 'down'
  // F: los PEP N7 de Forecast ya usan los mismos nombres de país que @/data/services, salvo "EEUU"
  // (acá) vs "Estados Unidos" (allá) — no aplica a ningún N4 de la semilla actual, pero por eso el cast
  // en vez de ampliar el tipo Pais de un componente compartido con Presupuesto.
  const segments = buildForecastN4PaisSegments(n4).map((s) => ({ pais: s.pais as Pais, pct: s.pct }))

  return (
    <div className="mx-8 mb-5 rounded-xl border border-border bg-white">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3 p-[18px_24px]">
        <Metric label="Plan" value={formatForecastAmount(totals.plan)} />
        <div className="h-8 w-px shrink-0 bg-border" />
        <Metric label="Forecast" value={formatForecastAmount(totals.realMasForecast)} />
        <div className="h-8 w-px shrink-0 bg-border" />
        <Metric label="Variación %" value={variacion === 0 ? '—' : `${Math.abs(varPct).toFixed(1)}%`} tone={tone} />
        <div className="h-8 w-px shrink-0 bg-border" />
        <Metric label="Variación $" value={variacion === 0 ? '—' : formatForecastAmount(Math.abs(variacion))} tone={tone} />
      </div>
      <div className="h-px bg-border" />
      <CountryDistributionBar segments={segments} />
    </div>
  )
}
