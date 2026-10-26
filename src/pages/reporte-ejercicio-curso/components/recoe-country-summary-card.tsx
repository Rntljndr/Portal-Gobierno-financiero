import { fmtReales, fmtPctOrDash } from '@/pages/reales/lib/reales-calc'
import type { PaisResumen } from '../lib/recoe-data'

const FLAG_BY_PAIS: Record<string, string> = {
  Argentina: '🇦🇷',
  Brasil: '🇧🇷',
  Chile: '🇨🇱',
  Colombia: '🇨🇴',
  Perú: '🇵🇪',
  Uruguay: '🇺🇾',
  'Estados Unidos': '🇺🇸',
}

function MetricRow({ label, value, tone, title }: { label: string; value: string; tone?: 'up' | 'down' | 'hl' | 'muted'; title?: string }) {
  const toneClass = tone === 'up' ? 'text-[#067647]' : tone === 'down' ? 'text-[#DC2626]' : tone === 'hl' ? 'text-primary' : tone === 'muted' ? 'text-[#8A90A2]' : 'text-foreground'
  return (
    <div className="flex h-[15px] items-center justify-between gap-3">
      <span title={title} className="text-[8.5px] font-semibold tracking-wide text-muted-foreground uppercase">
        {label}
      </span>
      <b className={`text-[11.5px] font-extrabold tabular-nums ${toneClass}`}>{value}</b>
    </div>
  )
}

interface RecoeCountrySummaryCardProps {
  r: PaisResumen
}

/** Card de un país del Resumen por País de "Reporte Ejercicio en Curso" — mismo diseño que
 * ForecastCountrySummaryCard (Forecast M2): bloque Forecast/Plan/Desvío $/Desvío %, línea divisoria,
 * bloque Real/Real año anterior/Variación $/Variación %. "Forecast" = cierre proyectado del año
 * (real acumulado + forecast de los meses restantes, `realMasForecast`) — un solo término en todo el
 * reporte en vez de "Proyectado"/"Forecast"/"Último forecast" mezclados. Sin botones propios: el único
 * control de la sección es el selector Origen ML/Destino ML/Destino USD del panel. */
export function RecoeCountrySummaryCard({ r }: RecoeCountrySummaryCardProps) {
  const variacionAnioAnterior = r.totals.real - r.realAnioAnterior
  const pctAnioAnterior = r.realAnioAnterior > 0 ? (variacionAnioAnterior / r.realAnioAnterior) * 100 : null

  return (
    <div className="rounded-2xl bg-white p-[11px_10px] shadow-[0_1px_2px_rgba(6,20,60,0.05),0_5px_14px_-6px_rgba(6,20,60,0.14)]">
      <div className="mb-1.5 flex items-center justify-between border-b border-primary/12 pb-1.5">
        <span className="text-[10.5px] font-extrabold tracking-wide text-primary">
          {FLAG_BY_PAIS[r.pais] ?? ''} {r.pais}
        </span>
        <span className="text-[9px] font-bold tracking-wide text-[#8A90A2]">{r.moneda}</span>
      </div>
      <div className="flex flex-col gap-1">
        <MetricRow label="Forecast" value={fmtReales(r.totals.realMasForecast, r.moneda)} tone="hl" />
        <MetricRow label="Plan" value={fmtReales(r.totals.plan, r.moneda)} />
        <MetricRow label="Desvío $" title="Forecast − Plan" value={fmtReales(r.totals.desvio, r.moneda)} tone={r.totals.desvio >= 0 ? 'up' : 'down'} />
        <MetricRow label="Desvío %" title="(Forecast − Plan) / Plan" value={fmtPctOrDash(r.totals.pctDesvio)} tone={r.totals.desvio >= 0 ? 'up' : 'down'} />
        <div className="my-px h-px bg-border" />
        <MetricRow label="Real" value={fmtReales(r.totals.real, r.moneda)} tone="hl" />
        <MetricRow label="Real año anterior" value={fmtReales(r.realAnioAnterior, r.moneda)} tone="muted" />
        <MetricRow label="Variación $" title="Real − Real año anterior" value={fmtReales(variacionAnioAnterior, r.moneda)} tone={variacionAnioAnterior >= 0 ? 'up' : 'down'} />
        <MetricRow
          label="Variación %"
          title="(Real − Real año anterior) / Real año anterior"
          value={fmtPctOrDash(pctAnioAnterior)}
          tone={variacionAnioAnterior >= 0 ? 'up' : 'down'}
        />
      </div>
    </div>
  )
}
