import { Badge, Icon, type VistaNumero } from '@/shared/ui'
import type { DireccionLeaf } from '@/data/reporte-direccion'
import type { CurrencyView } from '@/data/reporteria'
import { formatNumber, formatMillones, formatPercentCL, toUSD } from '@/shared/lib/format'
import { cn } from '@/shared/lib/utils'
import { computeDireccionMetrics } from '../lib/direccion-metrics'
import { participacionPct } from '../lib/participacion'

type Tone = 'variance' | 'hl'

/** Semáforo de cifras financieras del sistema de diseño: positivo verde, negativo rojo. */
function MetricRow({ label, value, tone, raw }: { label: string; value: string; tone?: Tone; raw?: number }) {
  const varianceClass = raw != null ? (raw > 0 ? 'text-[color:var(--success)]' : raw < 0 ? 'text-[color:var(--destructive)]' : 'text-muted-foreground') : ''
  const toneClass = tone === 'variance' ? varianceClass : tone === 'hl' ? 'text-primary' : 'text-foreground'
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-[8.5px] font-semibold tracking-wide text-muted-foreground uppercase">{label}</span>
      <b className={`text-[11.5px] font-extrabold tabular-nums ${toneClass}`}>{value}</b>
    </div>
  )
}

interface DireccionSummaryCardProps {
  nombre: string
  /** Solo a nivel País. */
  flag?: string
  /** "DIVISIÓN" / "BANDERA" — ausente a nivel País. */
  levelBadge?: string
  node: DireccionLeaf
  /** Ingresos totales contra los que se calcula "% de participación" en este nivel de apertura. */
  denomReal: number
  denomPlan: number
  vista: CurrencyView
  vistaNumero: VistaNumero
  /** false cuando hay un país activo (filtro o selector de moneda) y no es este — la card se mantiene
   * en la grilla pero sin mostrar cifras, en vez de desaparecer. */
  activo: boolean
  /** Presente solo cuando el nodo tiene un nivel siguiente para abrir (País → División → Bandera). */
  onClick?: () => void
}

export function DireccionSummaryCard({ nombre, flag, levelBadge, node, denomReal, denomPlan, vista, vistaNumero, activo, onClick }: DireccionSummaryCardProps) {
  const m = computeDireccionMetrics(node)
  const isDolar = vista === 'dolar'
  const fmt = (v: number) => {
    if (!activo) return '-'
    const converted = isDolar ? toUSD(v) : v
    return vistaNumero === 'millones' ? formatMillones(converted) : formatNumber(converted)
  }
  const fmtPct = (v: number) => (activo ? formatPercentCL(v) : '-')
  const partReal = activo ? formatPercentCL(participacionPct(node.ingresosReal, denomReal)) : '-'
  const partPlan = activo ? formatPercentCL(participacionPct(node.ingresosPlan, denomPlan)) : '-'

  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClick()
              }
            }
          : undefined
      }
      className={cn(
        'w-full rounded-2xl bg-white p-[11px_10px] text-left shadow-[0_1px_2px_rgba(6,20,60,0.05),0_5px_14px_-6px_rgba(6,20,60,0.14)]',
        onClick && 'cursor-pointer transition-shadow hover:shadow-[0_2px_6px_rgba(6,20,60,0.1),0_10px_22px_-8px_rgba(6,20,60,0.22)]',
      )}
    >
      <div className="mb-1.5 flex items-center justify-between border-b border-primary/12 pb-1.5">
        <span className="truncate text-[10.5px] font-extrabold tracking-wide text-primary">{flag ? `${flag} ${nombre}` : nombre}</span>
        <span className="ml-1 flex shrink-0 items-center gap-1">
          {levelBadge && (
            <Badge variant="neutral" shape="chip" className="text-[8px] tracking-wide">
              {levelBadge}
            </Badge>
          )}
          <span className="text-[9px] font-bold tracking-wide text-[#8A90A2]">{isDolar ? 'US$' : 'ML'}</span>
          {onClick && <Icon name="chevron_right" size={11} color="#8A90A2" />}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <MetricRow label="Total Real" value={fmt(node.real)} />
        <MetricRow label="Total Plan" value={fmt(node.plan)} tone="hl" />
        <MetricRow label="Var. vs Plan" value={fmt(m.varVsPlan)} tone="variance" raw={activo ? m.varVsPlan : undefined} />
        <MetricRow label="Var. %" value={fmtPct(m.varPct)} tone="variance" raw={activo ? m.varPct : undefined} />
        <div className="my-px h-px bg-border" />
        <MetricRow label="% Part. Real" value={partReal} tone="hl" />
        <MetricRow label="% Part. Plan" value={partPlan} tone="hl" />
        <div className="my-px h-px bg-border" />
        <MetricRow label="Año Anterior" value={fmt(node.realAnterior)} />
        <MetricRow label="Var. vs A/A" value={fmt(m.varAA)} tone="variance" raw={activo ? m.varAA : undefined} />
        <MetricRow label="Var. A/A %" value={fmtPct(m.varAAPct)} tone="variance" raw={activo ? m.varAAPct : undefined} />
      </div>
    </div>
  )
}
