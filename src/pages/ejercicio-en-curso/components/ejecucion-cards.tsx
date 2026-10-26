import { useNavigate } from 'react-router'
import { EmptyState, Icon } from '@/shared/ui'
import { cn } from '@/shared/lib/utils'
import { formatNumber } from '@/shared/lib/format'
import type { Servicio } from '@/data/services'
import { ejecucionDe } from '../lib/ejecucion'

const tono = (n: number) => (n > 0 ? 'text-destructive' : n < 0 ? 'text-success' : 'text-muted-foreground')
const firmado = (n: number, moneda: string) => `${n > 0 ? '+' : n < 0 ? '−' : ''}${moneda} ${formatNumber(Math.round(Math.abs(n)))}`

function Fila({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <span>{label}</span>
      <b className={cn('text-[12.5px] font-bold tabular-nums text-foreground', className)}>{children}</b>
    </div>
  )
}

/** Tarjeta de una línea del ejercicio en curso (mismo diseño que la de Mis líneas): plan, real acumulado con su
 * avance, forecast anual y desvío contra el plan. */
function EjecucionCard({ s }: { s: Servicio }) {
  const navigate = useNavigate()
  const x = ejecucionDe(s)
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-white p-4 transition-all hover:-translate-y-px hover:border-cs-azul hover:shadow-[0_8px_20px_rgba(6,20,148,0.08)]">
      <div className="mb-2.5 min-w-0">
        <div className="mb-1 flex items-center text-[11px] font-bold tracking-[0.04em] text-primary tabular-nums">
          {s.pep}
          <span className="mx-2.5 text-muted-foreground">•</span>
          {s.pais}
        </div>
        <div className="line-clamp-2 text-[13.5px] leading-snug font-bold tracking-tight text-foreground">{s.nombre}</div>
        <div className="mt-0.5 text-[11.5px] text-muted-foreground">
          {s.gerenciaPadre} <span className="text-slate-300">•</span> {s.gerencia} <span className="text-slate-300">•</span> {s.equipo}
        </div>
      </div>
      <span
        className={cn(
          'mb-3 inline-flex w-fit items-center rounded-md px-2 py-0.5 text-[10px] font-bold',
          x.forecastActualizado ? 'bg-success-surface text-success' : 'bg-warning-surface text-warning',
        )}
      >
        {x.forecastActualizado ? 'Forecast actualizado' : 'Forecast pendiente'}
      </span>
      <div className="flex flex-col gap-1.5 text-xs text-cs-gris-oscuro">
        <Fila label="Plan 2026">
          {s.moneda} {formatNumber(Math.round(x.plan))}
        </Fila>
        <Fila label="Real acumulado" className="font-semibold text-cs-gris-oscuro">
          {s.moneda} {formatNumber(Math.round(x.real))}
        </Fila>
        <div>
          <div className="mb-1 flex justify-between text-[11px]">
            <span>Avance del real</span>
            <b className="tabular-nums text-foreground">{x.avancePct.toFixed(1)}%</b>
          </div>
          <div className="h-1.5 rounded-full bg-chart-track">
            <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(x.avancePct, 100)}%` }} />
          </div>
        </div>
        <Fila label="Forecast anual" className="text-primary">
          {s.moneda} {formatNumber(Math.round(x.forecast))}
        </Fila>
        <div className="my-0.5 h-px bg-border" />
        <Fila label="Desvío $" className={tono(x.desv)}>
          {firmado(x.desv, s.moneda)}
        </Fila>
        <Fila label="Desvío %" className={tono(x.desvPct)}>
          {`${x.desvPct > 0 ? '+' : x.desvPct < 0 ? '−' : ''}${Math.abs(x.desvPct).toFixed(1)}%`}
        </Fila>
      </div>
      <div className="mt-3 flex items-center justify-end border-t border-border pt-2.5">
        <button
          type="button"
          onClick={() => navigate('/forecast')}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-bold text-primary hover:bg-[#E8EEFF]"
        >
          <Icon name="edit" size={13} color="currentColor" /> Editar forecast
        </button>
      </div>
    </div>
  )
}

export function EjecucionCards({ items }: { items: Servicio[] }) {
  if (items.length === 0) {
    return (
      <div className="mx-8 mb-6">
        <EmptyState icon="search" title="Sin resultados" text="Ajusta los filtros o elige otro estado." />
      </div>
    )
  }
  return (
    <div className="mx-8 mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((s) => (
        <EjecucionCard key={s.id} s={s} />
      ))}
    </div>
  )
}
