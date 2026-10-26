import { useNavigate } from 'react-router'
import { EmptyState, Icon } from '@/shared/ui'
import { cn } from '@/shared/lib/utils'
import { formatNumber } from '@/shared/lib/format'
import type { Servicio } from '@/data/services'
import { ejecucionDe } from '../lib/ejecucion'

const th = 'p-[12px_14px] text-left text-[10.5px] font-bold tracking-[0.05em] text-muted-foreground uppercase whitespace-nowrap bg-[#FAFBFE]'
const td = 'p-[13px_14px] align-middle text-[12.5px] text-foreground border-b border-border'
const tono = (n: number) => (n > 0 ? 'text-destructive' : n < 0 ? 'text-success' : 'text-muted-foreground')

function Monto({ moneda, valor, className }: { moneda: string; valor: number; className?: string }) {
  return (
    <td className={cn(td, 'text-right font-bold whitespace-nowrap tabular-nums', className)}>
      <span className="mr-1 text-[10px] font-semibold text-muted-foreground">{moneda}</span>
      {formatNumber(Math.round(valor))}
    </td>
  )
}

/** Líneas del ejercicio en curso (mismo patrón que la tabla de Mis líneas): plan, real acumulado con su avance,
 * forecast anual y desvío contra el plan, con el estado del forecast en edición. */
export function EjecucionTabla({ items }: { items: Servicio[] }) {
  const navigate = useNavigate()
  if (items.length === 0) {
    return (
      <div className="mx-8 mb-6">
        <EmptyState icon="search" title="Sin resultados" text="Ajusta los filtros o elige otro estado." />
      </div>
    )
  }
  return (
    <div className="mx-8 mb-6 overflow-x-auto rounded-2xl border border-border bg-white">
      <table className="w-full min-w-[1080px] border-collapse">
        <thead>
          <tr>
            <th className={th}>Servicio</th>
            <th className={th}>Equipo</th>
            <th className={cn(th, 'text-right')}>Plan 2026</th>
            <th className={cn(th, 'text-right')}>Real acumulado</th>
            <th className={cn(th, 'w-[140px]')}>Avance</th>
            <th className={cn(th, 'text-right')}>Forecast anual</th>
            <th className={cn(th, 'text-right')}>Desvío $</th>
            <th className={cn(th, 'text-right')}>Desvío %</th>
            <th className={th} />
          </tr>
        </thead>
        <tbody>
          {items.map((s) => {
            const x = ejecucionDe(s)
            return (
              <tr key={s.id} className="hover:bg-[#F5F8FE]">
                <td className={cn(td, 'max-w-[320px]')}>
                  <div className="mb-1 text-[11px] font-semibold text-primary tabular-nums">
                    {s.pep} <span className="text-muted-foreground">•</span> {s.pais}
                  </div>
                  <div className="font-bold text-foreground">{s.nombre}</div>
                  <span
                    className={cn(
                      'mt-1 inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold',
                      x.forecastActualizado ? 'bg-success-surface text-success' : 'bg-warning-surface text-warning',
                    )}
                  >
                    {x.forecastActualizado ? 'Forecast actualizado' : 'Forecast pendiente'}
                  </span>
                </td>
                <td className={td}>{s.equipo}</td>
                <Monto moneda={s.moneda} valor={x.plan} />
                <Monto moneda={s.moneda} valor={x.real} className="text-cs-gris-oscuro" />
                <td className={td}>
                  <div className="mb-1 text-right text-[11px] font-bold tabular-nums">{x.avancePct.toFixed(1)}%</div>
                  <div className="h-1.5 rounded-full bg-chart-track">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(x.avancePct, 100)}%` }} />
                  </div>
                </td>
                <Monto moneda={s.moneda} valor={x.forecast} className="text-primary" />
                <td className={cn(td, 'text-right font-bold whitespace-nowrap tabular-nums', tono(x.desv))}>
                  {`${x.desv > 0 ? '+' : x.desv < 0 ? '−' : ''}${s.moneda} ${formatNumber(Math.round(Math.abs(x.desv)))}`}
                </td>
                <td className={cn(td, 'text-right font-bold tabular-nums', tono(x.desvPct))}>
                  {`${x.desvPct > 0 ? '+' : x.desvPct < 0 ? '−' : ''}${Math.abs(x.desvPct).toFixed(1)}%`}
                </td>
                <td className={cn(td, 'whitespace-nowrap')}>
                  <button
                    type="button"
                    onClick={() => navigate('/forecast')}
                    title="Editar el forecast de esta línea"
                    className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-bold text-primary hover:bg-[#E8EEFB]"
                  >
                    <Icon name="edit" size={13} color="currentColor" /> Forecast
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
