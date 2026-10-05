import { useState } from 'react'
import { Button, Icon, SegmentedTabs } from '@/shared/ui'
import { cn } from '@/shared/lib/utils'
import type { ResumenTotals } from '@/shared/lib/resumen-blocks'
import { formatForecastAmount } from '../lib/format-forecast-amount'
import { ForecastEvolucionChart } from './forecast-evolucion-chart'
import { ForecastEvolucionPointsChart } from './forecast-evolucion-points-chart'

interface ForecastChartSectionProps {
  meses: Record<string, number>
  cutoff: number
  /** Plan de referencia (C9, detalle N7): al venir, el gráfico compara Real+Forecast contra el Plan
   * en vez de solo mostrar Real+Forecast — y el título deja de hablar de "vs. Real". */
  plan?: Record<string, number>
  /** Forecast anterior elegido en la Comparativa (M3) — se suma como tercera serie al gráfico (M4:
   * "cada serie que se agrega a la comparativa se suma también al gráfico"). */
  anterior?: Record<string, number>
  /** Muestra el botón "Comparar" en el header (M3) — solo en el detalle N7, donde vive la Comparativa. */
  onComparar?: () => void
  /** A9: totales ya calculados (calcN4Totals/calcN7Totals) — si vienen, se muestra el indicador
   * "Proyectado fin de año" bajo el gráfico. Ya incluye realMasForecast/pctDesvio, no hay que calcular
   * nada de nuevo acá. */
  totals?: ResumenTotals
}

/** A9: "Proyectado fin de año: [monto] — [X% sobre/bajo plan]" — lo que el usuario necesita saber de
 * un vistazo (¿termina sobre o bajo el plan?), sin tener que leer el gráfico mes a mes. Verde si va a
 * cerrar bajo plan (ahorro), rojo si va a cerrar sobre plan (sobregiro). */
function ForecastProyeccionIndicador({ totals }: { totals: ResumenTotals }) {
  const sobre = totals.pctDesvio > 0
  return (
    <div className={cn('mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border p-[10px_14px]', sobre ? 'border-destructive-line bg-destructive-surface' : 'border-[#A7F3D0] bg-[#ECFDF5]')}>
      <span className="text-[11.5px] font-medium text-foreground">Proyectado fin de año</span>
      <span className={cn('text-[13px] font-extrabold tabular-nums', sobre ? 'text-destructive' : 'text-[#067647]')}>
        {formatForecastAmount(totals.realMasForecast)}
        <span className="ml-1 font-semibold">
          ({sobre ? '+' : ''}
          {totals.pctDesvio.toFixed(1)}% {sobre ? 'sobre' : 'bajo'} plan)
        </span>
      </span>
    </div>
  )
}

/** Sección colapsable propia ("Gráficos", A9) separada de la ficha de datos cualitativos — expandida
 * por defecto (F: "se debe ver el gráfico de barras"), patrón hand-rolled de pep-n4-card.tsx, no existe
 * un Collapsible genérico en shared/ui. Dos visiones con selector (F): barras (ForecastEvolucionChart,
 * la que se ve por defecto) o puntos (ForecastEvolucionPointsChart), misma escala/datos en ambas. */
export function ForecastChartSection({ meses, cutoff, plan, anterior, onComparar, totals }: ForecastChartSectionProps) {
  const [open, setOpen] = useState(true)
  const [vista, setVista] = useState<'barras' | 'puntos'>('barras')

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white">
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between p-[16px_20px] text-left">
        <span>
          <span className="flex items-center gap-2 text-[14px] font-bold text-foreground">
            <Icon name="chart" size={15} color="#0047B0" /> Gráficos
          </span>
          <span className="mt-0.5 block text-[11px] text-muted-foreground">{plan ? 'Evolución Real + Forecast vs. Plan' : 'Evolución Forecast vs. Real'}</span>
        </span>
        <Icon name={open ? 'chevron_up' : 'chevron_down'} size={16} color="#0047B0" />
      </button>
      {open && (
        <div className="border-t border-[#eef0f8] p-[20px]">
          <div className="mb-3 flex items-center justify-between">
            {onComparar ? (
              <Button variant="outline" size="sm" onClick={onComparar}>
                Comparar {anterior && '(1)'}
              </Button>
            ) : (
              <span />
            )}
            <SegmentedTabs
              value={vista}
              onChange={setVista}
              options={[
                { value: 'barras', label: 'Barras' },
                { value: 'puntos', label: 'Puntos' },
              ]}
            />
          </div>
          {vista === 'barras' ? (
            <ForecastEvolucionChart meses={meses} cutoff={cutoff} plan={plan} anterior={anterior} />
          ) : (
            <ForecastEvolucionPointsChart meses={meses} cutoff={cutoff} plan={plan} anterior={anterior} />
          )}
          {totals && plan && <ForecastProyeccionIndicador totals={totals} />}
        </div>
      )}
    </div>
  )
}
