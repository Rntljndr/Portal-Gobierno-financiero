import type { ForecastCountryRow } from '../lib/forecast-country-summary'

const FLAG_BY_PAIS: Record<string, string> = {
  Argentina: '🇦🇷',
  Brasil: '🇧🇷',
  Chile: '🇨🇱',
  Colombia: '🇨🇴',
  Perú: '🇵🇪',
  Uruguay: '🇺🇾',
  EEUU: '🇺🇸',
}

function MetricRow({ label, value, tone, title }: { label: string; value: string; tone?: 'up' | 'down' | 'hl' | 'muted'; title?: string }) {
  const toneClass = tone === 'up' ? 'text-[#DC2626]' : tone === 'down' ? 'text-[#067647]' : tone === 'hl' ? 'text-primary' : tone === 'muted' ? 'text-[#8A90A2]' : 'text-foreground'
  const empty = value === ''
  return (
    <div className="flex h-[15px] items-center justify-between gap-3">
      <span title={title} className="text-[8.5px] font-semibold tracking-wide text-muted-foreground uppercase">
        {label}
      </span>
      {empty ? <span className="inline-block h-px w-[22px] bg-[#C2C8D4]" /> : <b className={`text-[11.5px] font-extrabold tabular-nums ${toneClass}`}>{value}</b>}
    </div>
  )
}

/** Card de un país en el Resumen por País del Forecast (M2) — mismo diseño que CountryBudgetCard de
 * Presupuesto, sin la fila de IPC (no aplica acá) y con Forecast anterior/actual en vez de Forecast
 * base/+IPC. Sin botón de conversión: siempre en moneda de origen, no hay vista "destino". */
export function ForecastCountrySummaryCard({ c }: { c: ForecastCountryRow }) {
  return (
    <div className="rounded-2xl bg-white p-[11px_10px] shadow-[0_1px_2px_rgba(6,20,60,0.05),0_5px_14px_-6px_rgba(6,20,60,0.14)]">
      <div className="mb-1.5 flex items-center justify-between border-b border-primary/12 pb-1.5">
        <span className="text-[10.5px] font-extrabold tracking-wide text-primary">
          {FLAG_BY_PAIS[c.pais] ?? ''} {c.pais}
        </span>
        <span className="text-[9px] font-bold tracking-wide text-[#8A90A2]">{c.moneda}</span>
      </div>
      <div className="flex flex-col gap-1">
        {/* F: "Forecast, plan, variación $ y variación % (línea divisoria) luego Forecast, forecast
         * anterior, variación $ y variación %" — dos bloques independientes, cada uno con su propia
         * referencia (Plan o Forecast anterior) y el Forecast actual repetido como sujeto fijo. */}
        <MetricRow label="Forecast" value={c.empty ? '' : c.actual} tone="hl" />
        <MetricRow label="Plan" value={c.empty ? '' : c.plan} />
        <MetricRow label="Variación $" title="Forecast actual − Plan" value={c.empty ? '' : c.varAbsPlan} tone={c.empty ? undefined : c.upPlan ? 'up' : 'down'} />
        <MetricRow
          label="Variación %"
          title="(Forecast actual − Plan) / Plan"
          value={c.empty ? '' : c.varPctPlan}
          tone={c.empty ? undefined : c.upPlan ? 'up' : 'down'}
        />
        <div className="my-px h-px bg-border" />
        <MetricRow label="Forecast" value={c.empty ? '' : c.actual} tone="hl" />
        <MetricRow label="Forecast anterior" value={c.empty ? '' : c.anterior} tone="muted" />
        <MetricRow
          label="Variación $"
          title="Forecast actual − Forecast anterior"
          value={c.empty ? '' : c.varAbsAnterior}
          tone={c.empty ? undefined : c.upAnterior ? 'up' : 'down'}
        />
        <MetricRow
          label="Variación %"
          title="(Forecast actual − Forecast anterior) / Forecast anterior"
          value={c.empty ? '' : c.varPctAnterior}
          tone={c.empty ? undefined : c.upAnterior ? 'up' : 'down'}
        />
      </div>
    </div>
  )
}
